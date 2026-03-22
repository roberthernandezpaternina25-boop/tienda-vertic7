# fix-case-in-script.ps1
# Compara rutas en script.js con archivos reales y corrige diferencias de case
$root = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
$scriptPath = Join-Path $root 'script.js'
if (-not (Test-Path $scriptPath)) { Write-Error "No se encontró script.js"; exit 1 }
$js = Get-Content -Raw -LiteralPath $scriptPath
$start = $js.IndexOf('const categories =')
if ($start -lt 0) { Write-Error "No se encontró 'const categories' en script.js"; exit 1 }
$blockStart = $js.IndexOf('{', $start)
$blockEnd = $js.IndexOf('};', $blockStart)
if ($blockEnd -lt 0) { Write-Error "No se encontró el cierre del bloque 'categories'"; exit 1 }
$block = $js.Substring($blockStart, $blockEnd - $blockStart + 1)
# Extraer todas las rutas entre comillas simples o dobles
$re = [regex]"(['\"])(?<p>[^'\"]+)\1"
$matches = $re.Matches($block)

$report = @()
$fixes = @{}
foreach ($m in $matches) {
    $path = $m.Groups['p'].Value
    # saltar claves de objeto (que no contienen '/'), y extensiones no de imagen
    if ($path -notmatch '/|\.(png|jpg|jpeg|gif|webp|svg)$') { continue }
    $fullLocal = Join-Path $root ($path -replace '/','\\')
    $dir = [System.IO.Path]::GetDirectoryName($fullLocal)
    $file = [System.IO.Path]::GetFileName($fullLocal)
    if (-not (Test-Path $dir)) {
        $report += [PSCustomObject]@{ path=$path; status='dir-missing' }
        continue
    }
    $found = Get-ChildItem -LiteralPath $dir -File | Where-Object { $_.Name -ieq $file }
    if ($found.Count -eq 0) {
        $report += [PSCustomObject]@{ path=$path; status='missing' }
    } else {
        # tomar primer match
        $actual = $found[0].Name
        if ($actual -ne $file) {
            $report += [PSCustomObject]@{ path=$path; status='case-diff'; actual=$actual }
            $fixes[$path] = ($path -replace [regex]::Escape($file), $actual)
        } else {
            $report += [PSCustomObject]@{ path=$path; status='ok' }
        }
    }
}

# mostrar reporte
"Reporte de verificación:`n" | Write-Host
$report | Group-Object status | ForEach-Object {
    "- $($_.Name): $($_.Count)" | Write-Host
}

# Mostrar detalles para case-diff y missing
$report | Where-Object { $_.status -eq 'case-diff' } | ForEach-Object { "case-diff: $($_.path) -> $($_.actual)" | Write-Host }
$report | Where-Object { $_.status -eq 'missing' } | ForEach-Object { "missing: $($_.path)" | Write-Host }
$report | Where-Object { $_.status -eq 'dir-missing' } | ForEach-Object { "dir-missing: $($_.path)" | Write-Host }

if ($fixes.Count -gt 0) {
    Copy-Item -LiteralPath $scriptPath -Destination (Join-Path $env:TEMP ("script_backup_casefix_" + (Get-Date -Format "yyyyMMddHHmmss") + ".js")) -Force
    $newJs = $js
    foreach ($k in $fixes.Keys) {
        $escaped = [regex]::Escape($k)
        $newVal = $fixes[$k]
        $newJs = [regex]::Replace($newJs, $escaped, $newVal)
        "Se corregirá: $k -> $newVal" | Write-Host
    }
    Set-Content -LiteralPath $scriptPath -Value $newJs -Force
    "script.js actualizado. Backup creado en TEMP." | Write-Host
} else {
    "No hay entradas con diferencias solo de mayúsculas para corregir." | Write-Host
}

# Salida detallada para el usuario (también la guardamos en TEMP)
$out = @()
$out += "Reporte generado: $(Get-Date)"
$out += "Backup script.js si se aplicaron cambios: $env:TEMP"
$out += "Detalles:" 
$report | ForEach-Object { $out += ("$($_.status) - $($_.path) - $($_.actual)") }
$outPath = Join-Path $env:TEMP ("asset_check_report_$(Get-Date -Format yyyyMMddHHmmss).txt")
$out | Out-File -FilePath $outPath -Encoding UTF8
"Reporte guardado en: $outPath" | Write-Host
