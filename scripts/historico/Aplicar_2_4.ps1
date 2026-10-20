param([Parameter(Mandatory=$true)][string]$Paquete, [Parameter(Mandatory=$true)][string]$Repositorio)
$ErrorActionPreference = 'Stop'
$Repositorio = (Resolve-Path -LiteralPath $Repositorio).Path
if (-not (Test-Path -LiteralPath (Join-Path $Repositorio '.git'))) { throw 'La carpeta destino no es un repositorio Git.' }
$rama = (& git -C $Repositorio branch --show-current).Trim()
if ($LASTEXITCODE -ne 0) { throw 'No se pudo consultar la rama.' }
if ($rama -ne 'feature/actualizacion-2-4') { throw 'Use git switch -c feature/actualizacion-2-4 (o git switch si ya existe).' }
$pendientes = & git -C $Repositorio status --porcelain
if ($LASTEXITCODE -ne 0) { throw 'No se pudo consultar el estado.' }
if ($pendientes) { throw 'Hay cambios locales pendientes. Conservelos antes de aplicar la actualizacion.' }
$manifiesto = Get-Content -LiteralPath (Join-Path $Paquete 'actualizacion-2-4.json') -Raw -Encoding UTF8 | ConvertFrom-Json
function Get-NormalizedHash([string]$Ruta) {
  $texto = [IO.File]::ReadAllText($Ruta, [Text.Encoding]::UTF8).TrimStart([char]0xFEFF).Replace("`r`n", "`n")
  $sha = [Security.Cryptography.SHA256]::Create()
  try { return ([BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($texto)))).Replace('-', '').ToLowerInvariant() }
  finally { $sha.Dispose() }
}
foreach ($item in $manifiesto.files) {
  $origen = Join-Path $Paquete $item.path
  $destino = Join-Path $Repositorio $item.path
  if (-not (Test-Path -LiteralPath $origen -PathType Leaf)) { throw "Falta el archivo fuente: $($item.path)" }
  if ((Get-NormalizedHash $origen) -ne $item.sha256) { throw "El archivo fuente no coincide con el paquete: $($item.path)" }
  if (Test-Path -LiteralPath $destino) {
    $hash = Get-NormalizedHash $destino
    if ($item.base_sha256 -notcontains $hash) { throw "Conflicto en $($item.path). No se ha copiado ningun archivo." }
  } elseif (-not $item.allow_missing) { throw "Falta un archivo base: $($item.path). No se ha copiado ningun archivo." }
}
foreach ($item in $manifiesto.files) {
  $destino = Join-Path $Repositorio $item.path
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destino) | Out-Null
  Copy-Item -LiteralPath (Join-Path $Paquete $item.path) -Destination $destino -Force
}
Copy-Item -LiteralPath (Join-Path $Paquete 'actualizacion-2-4.json') -Destination (Join-Path $Repositorio 'actualizacion-2-4.json') -Force
Push-Location $Repositorio
try {
  & npm.cmd ci; if ($LASTEXITCODE -ne 0) { throw 'Fallo npm ci. Revise el error; los archivos ya fueron copiados.' }
  & npm.cmd run lint; if ($LASTEXITCODE -ne 0) { throw 'Fallo lint.' }
  & npm.cmd test; if ($LASTEXITCODE -ne 0) { throw 'Fallaron las pruebas unitarias.' }
  & npm.cmd run build; if ($LASTEXITCODE -ne 0) { throw 'Fallo la compilacion.' }
} finally { Pop-Location }
Write-Host 'Actualizacion 2.4 aplicada. Revise localmente con npm run dev antes de hacer commit o publicar.'
