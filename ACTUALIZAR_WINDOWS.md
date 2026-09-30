# Actualizar a HCI Lab + IA 2.2 en Windows

El paquete implementa la actualización. Todavía no cambia el repositorio remoto ni GitHub Pages.

## 1. Descomprimir

Descargue `HCI_Lab_IA_V2-2.zip` y descomprímalo dentro de Descargas. Debe existir:

```text
C:\Users\gramirez\Downloads\HCI_Lab_IA_V2-2\Actualizar.ps1
```

Si el explorador creó dos carpetas con el mismo nombre, mueva la carpeta interior a Descargas o ajuste la ruta. Compruebe la ruta con:

```powershell
Test-Path "$env:USERPROFILE\Downloads\HCI_Lab_IA_V2-2\Actualizar.ps1"
```

Debe responder True.

## 2. Aplicar y probar

El estado recibido era una rama limpia `feature/interaccion-multimodal`, igual a main en 2533e25. El script requiere esa rama y una copia limpia, copia únicamente los archivos del manifiesto y ejecuta instalación, lint, pruebas unitarias y build. Conserva `.git` y los workflows existentes. Si una comprobación falla, se detiene y no hace commit ni push.

```powershell
cd "$env:USERPROFILE\Downloads\hci-lab-ia-repositorio"
git switch feature/interaccion-multimodal
powershell -NoProfile -ExecutionPolicy Bypass -File "$env:USERPROFILE\Downloads\HCI_Lab_IA_V2-2\Actualizar.ps1"
```

`ExecutionPolicy Bypass` afecta únicamente este proceso para ejecutar el script descargado; no cambia la configuración permanente de PowerShell.

Compruebe los archivos realmente añadidos:

```powershell
Test-Path ".\src\components\multimodal\MultimodalPage.tsx"
node -p "require('./package.json').version"
git status --short
```

Resultados esperados: True, 2.2.0 y una lista de cambios.

Abra la app:

```powershell
npm run dev
```

Abra la URL de Vite, use el menú Interacción multimodal y compruebe `#/multimodal`. Pruebe los dispositivos, filtros y guardado de evidencia. Los controles nativos de voz, sonido y vibración requieren verificación en su navegador/dispositivo. Termine Vite con Ctrl+C.

Opcional: ejecutar también las pruebas en navegador:

```powershell
npx playwright install chromium
npm run test:e2e
```

## 3. Guardar y subir la rama

Ejecute uno por uno, después de las comprobaciones anteriores:

```powershell
git add .
git commit -m "feat: incorporar laboratorio multimodal y evidencias v2.2"
git push -u origin feature/interaccion-multimodal
```

## 4. Actualizar main y GitHub Pages

```powershell
git switch main
git pull --ff-only origin main
git merge --ff-only feature/interaccion-multimodal
git push origin main
```

Si `pull` o `merge` devuelve un error, deténgase y revise la salida antes de continuar. No use force push. `--ff-only` evita una integración inesperada si main cambió durante el trabajo.

El workflow de Pages existente se ejecuta al subir main. Compruebe su resultado en GitHub > Actions y luego visite:

https://mauricioramirezv.github.io/hci-lab-ia/#/multimodal

Puede contrastar las referencias con:

```powershell
git fetch origin
git log --oneline --decorate -3
git diff --stat origin/main...feature/interaccion-multimodal
```

Después del push correcto, ambas referencias deben incluir el commit nuevo. Una diferencia vacía solo significa que las ramas tienen el mismo contenido; verifique también que el archivo existe y el commit nuevo aparece.
