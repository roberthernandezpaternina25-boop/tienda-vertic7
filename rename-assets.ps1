# rename-assets.ps1
# Renombra archivos de assets a nombres en minúsculas y actualiza referencias en .html, .css y .js
# Hacer copia de seguridad automática antes de mover/editar.

$root = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
# Crear copia de seguridad fuera de la carpeta del proyecto para evitar recursión
$backupDir = Join-Path $env:TEMP ("rename_backup_" + (Get-Date -Format "yyyyMMddHHmmss"))
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

$exts = @('*.png','*.jpg','*.jpeg','*.gif','*.webp','*.svg')
$mappings = @()

Write-Host "Buscando archivos de imagen y creando copias de seguridad..."
foreach ($ext in $exts) {
    Get-ChildItem -Path $root -Recurse -Filter $ext -File | ForEach-Object {
        $file = $_
        # Ignorar archivos dentro de la carpeta de backup (por si acaso)
        if ($file.FullName -like "$backupDir*") { return }
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
        if ($newFull -cne $oldFull) {
            # Copiar al backup (preservando estructura relativa)
            $relDir = Resolve-Path -LiteralPath $file.DirectoryName | ForEach-Object { $_.Path.Substring($root.Length).TrimStart('\') }
            $destBackupDir = if ($relDir) { Join-Path $backupDir $relDir } else { $backupDir }
            New-Item -ItemType Directory -Path $destBackupDir -Force | Out-Null
            Copy-Item -LiteralPath $oldFull -Destination (Join-Path $destBackupDir $oldName) -Force
            # En Windows no siempre cambia sólo la mayúscula, usar renombrado temporal si sólo cambia el case
            if ($oldFull.ToLower() -eq $newFull.ToLower() -and $oldFull -ne $newFull) {
                $tmp = Join-Path $file.DirectoryName ("tmp_" + [guid]::NewGuid().ToString() + $extOnly)
                Move-Item -LiteralPath $oldFull -Destination $tmp -Force
                Move-Item -LiteralPath $tmp -Destination $newFull -Force
            } else {
                Move-Item -LiteralPath $oldFull -Destination $newFull -Force
            }
            $relativeOld = Join-Path ($file.DirectoryName.Substring($root.Length).TrimStart('\')) $oldName
            $relativeNew = Join-Path ($file.DirectoryName.Substring($root.Length).TrimStart('\')) ([System.IO.Path]::GetFileName($newFull))
            $relativeOld = $relativeOld -replace '\\','/' -replace '^/',''
            $relativeNew = $relativeNew -replace '\\','/' -replace '^/',''
            $mappings += [PSCustomObject]@{ old = $oldName; new = ([System.IO.Path]::GetFileName($newFull)); oldFull=$oldFull; newFull=$newFull; relOld=$relativeOld; relNew=$relativeNew }
            Write-Host "Renombrado: $oldName -> $([System.IO.Path]::GetFileName($newFull))"
        }
    }
}

if ($mappings.Count -eq 0) { Write-Host "No se encontraron archivos para renombrar." }

# Actualizar referencias en archivos de código
$codeFiles = Get-ChildItem -Path $root -Recurse -Include *.html,*.css,*.js -File
foreach ($cf in $codeFiles) {
    # Ignorar archivos dentro del backup
    if ($cf.FullName -like "$backupDir*") { continue }
    $content = Get-Content -Raw -LiteralPath $cf.FullName -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    $original = $content
    foreach ($map in $mappings) {
        # Reemplazar tanto rutas relativas completas como sólo nombres de archivo
        $new = $map.new
        if ($map.relOld) {
            $oldRelEsc = [regex]::Escape($map.relOld)
            $content = [regex]::Replace($content, $oldRelEsc, $map.relNew, 'IgnoreCase')
        }
        $oldNameEsc = [regex]::Escape($map.old)
        $content = [regex]::Replace($content, $oldNameEsc, $map.new, 'IgnoreCase')
        # URL-encoded variant
        try { $urlEncoded = [uri]::EscapeDataString($map.old) } catch { $urlEncoded = $map.old }
        if ($urlEncoded -ne $map.old) {
            $encodedEsc = [regex]::Escape($urlEncoded)
            $content = [regex]::Replace($content, $encodedEsc, $map.new, 'IgnoreCase')
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
