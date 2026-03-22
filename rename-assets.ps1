# rename-assets.ps1
# Renombra archivos de assets a nombres en minúsculas y actualiza referencias en .html, .css y .js
# Hacer copia de seguridad automática antes de mover/editar.

$root = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
$backupDir = Join-Path $root ("rename_backup_" + (Get-Date -Format "yyyyMMddHHmmss"))
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

$exts = @('*.png','*.jpg','*.jpeg','*.gif','*.webp','*.svg')
$mappings = @()

Write-Host "Buscando archivos de imagen y creando copias de seguridad..."
foreach ($ext in $exts) {
    Get-ChildItem -Path $root -Recurse -Filter $ext -File | ForEach-Object {
        $file = $_
        $oldFull = $file.FullName
        $oldName = $file.Name
        $base = [System.IO.Path]::GetFileNameWithoutExtension($oldName)
        $extOnly = $file.Extension.ToLower()
        # Normalizar: minúsculas, espacios -> '-', quitar caracteres no alfanuméricos salvo '-' y '_'
        $safeBase = $base.ToLower() -replace '\s+','-' -replace '[^a-z0-9\-_]','-'
        $newName = "$safeBase$extOnly"
        $newFull = Join-Path $file.DirectoryName $newName
        # Evitar colisiones: si existe, añadir sufijo numérico
        $counter = 1
        while (Test-Path $newFull -PathType Leaf -ErrorAction SilentlyContinue) {
            if ($newFull -ieq $oldFull) { break }
            $newName = "{0}-{1}{2}" -f $safeBase, $counter, $extOnly
            $newFull = Join-Path $file.DirectoryName $newName
            $counter++
        }
        if ($newFull -ne $oldFull) {
            Copy-Item -LiteralPath $oldFull -Destination $backupDir -Force
            Move-Item -LiteralPath $oldFull -Destination $newFull -Force
            $mappings += [PSCustomObject]@{ old = $oldName; new = ([System.IO.Path]::GetFileName($newFull)); oldFull=$oldFull; newFull=$newFull }
            Write-Host "Renombrado: $oldName -> $([System.IO.Path]::GetFileName($newFull))"
        }
    }
}

if ($mappings.Count -eq 0) { Write-Host "No se encontraron archivos para renombrar." }

# Actualizar referencias en archivos de código
$codeFiles = Get-ChildItem -Path $root -Recurse -Include *.html,*.css,*.js -File
foreach ($cf in $codeFiles) {
    $content = Get-Content -Raw -LiteralPath $cf.FullName -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    $original = $content
    foreach ($map in $mappings) {
        $old = [regex]::Escape($map.old)
        $new = $map.new
        # También reemplazar la versión URL-encoded del nombre (p.ej. logo%231.jpg)
        try {
            $urlEncoded = [uri]::EscapeDataString($map.old)
        } catch {
            $urlEncoded = $map.old
        }
        $content = [regex]::Replace($content, $old, $new, 'IgnoreCase')
        if ($urlEncoded -ne $map.old) {
            $encodedEsc = [regex]::Escape($urlEncoded)
            $content = [regex]::Replace($content, $encodedEsc, $new, 'IgnoreCase')
        }
    }
    if ($content -ne $original) {
        Copy-Item -LiteralPath $cf.FullName -Destination $backupDir -Force
        Set-Content -LiteralPath $cf.FullName -Value $content -Force
        Write-Host "Actualizado: $($cf.FullName)"
    }
}

Write-Host "Proceso terminado. Copia de seguridad en: $backupDir"
if ($mappings.Count -gt 0) {
    Write-Host "Mapeo realizado (primeras 50):"
    $mappings | Select-Object old,new | Select-Object -First 50 | Format-Table -AutoSize
}

Write-Host "Siguiente paso: revisa los archivos modificados y prueba en un servidor case-sensitive." 
