# sync-categories.ps1
# Escanea carpetas y actualiza el objeto `categories` en script.js con nombres reales de archivos
$root = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
$scriptPath = Join-Path $root 'script.js'
if (-not (Test-Path $scriptPath)) { Write-Error "No se encontró script.js"; exit 1 }
$js = Get-Content -Raw -LiteralPath $scriptPath
# Extraer keys existentes
$keys = ([regex]::Matches($js, "'([^']+)'\s*:", 'IgnoreCase') | ForEach-Object { $_.Groups[1].Value }) | Select-Object -Unique

$newObj = "const categories = {`n"
foreach ($k in $keys) {
    $dir = Join-Path $root $k
    $entries = @()
    if (Test-Path $dir) {
        Get-ChildItem -Path $dir -File | Where-Object { $_.Extension -match '(?i)\.(png|jpg|jpeg|gif|webp|svg)$' } | Sort-Object Name | ForEach-Object {
            $rel = ($k + '/' + $_.Name) -replace '\\','/'
            $entries += "'$rel'"
        }
    }
    $arr = $entries -join ",`n            "
    $newObj += "    '$k': [`n            $arr`n        ],`n"
}
$newObj += "};`n"
# Reemplazar el bloque existente
$pattern = "const\s+categories\s*=\s*\{[\s\S]*?\};"
if ($js -match $pattern) {
    $js2 = [regex]::Replace($js, $pattern, $newObj)
    Copy-Item -LiteralPath $scriptPath -Destination (Join-Path $env:TEMP ("script_backup_" + (Get-Date -Format "yyyyMMddHHmmss") + ".js")) -Force
    Set-Content -LiteralPath $scriptPath -Value $js2 -Force
    Write-Host "Actualizado script.js con nombres reales de archivos para $($keys.Count) categorías."
} else {
    Write-Error "No se encontró el bloque 'categories' en script.js"
}
