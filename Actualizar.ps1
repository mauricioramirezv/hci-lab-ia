param(
    [string]$Repositorio = (Join-Path $env:USERPROFILE "Downloads\hci-lab-ia-repositorio")
)
$ErrorActionPreference = "Stop"
if (-not (Test-Path (Join-Path $Repositorio ".git"))) { throw "No existe un repositorio Git en $Repositorio" }
$branch = & git -C $Repositorio branch --show-current
if ($LASTEXITCODE -ne 0) { throw "No se pudo verificar Git." }
if ($branch.Trim() -ne "feature/interaccion-multimodal") { throw "Debe estar en feature/interaccion-multimodal. Ejecute git switch feature/interaccion-multimodal." }
$pending = & git -C $Repositorio status --porcelain
if ($LASTEXITCODE -ne 0) { throw "No se pudo verificar el estado de Git." }
if ($pending) { throw "Hay cambios pendientes. Guarde o revise esos cambios antes de aplicar este paquete." }
$files = Get-Content (Join-Path $PSScriptRoot "archivos-actualizados.json") -Raw | ConvertFrom-Json
foreach ($relative in $files) {
    if (-not (Test-Path (Join-Path $PSScriptRoot $relative) -PathType Leaf)) { throw "El paquete esta incompleto: $relative" }
}
foreach ($relative in $files) {
    $source = Join-Path $PSScriptRoot $relative
    $target = Join-Path $Repositorio $relative
    New-Item -ItemType Directory -Path (Split-Path $target -Parent) -Force | Out-Null
    Copy-Item -LiteralPath $source -Destination $target -Force
}
Push-Location $Repositorio
try {
    & npm.cmd ci
    if ($LASTEXITCODE -ne 0) { throw "npm ci fallo. No haga commit aun." }
    & npm.cmd run lint
    if ($LASTEXITCODE -ne 0) { throw "Lint fallo. No haga commit aun." }
    & npm.cmd test
    if ($LASTEXITCODE -ne 0) { throw "Las pruebas fallaron. No haga commit aun." }
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw "La compilacion fallo. No haga commit aun." }
    & git status --short
    Write-Host "Actualizacion 2.2 aplicada y verificada. Revise la aplicacion; despues siga ACTUALIZAR_WINDOWS.md para commit y publicacion."
} finally {
    Pop-Location
}
