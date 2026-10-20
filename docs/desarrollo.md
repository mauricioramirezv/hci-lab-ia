# Desarrollo y despliegue

Requiere Node.js 22.12 o posterior y npm. Ejecute todos los comandos desde la raíz del checkout.

```powershell
npm ci
npm run dev
```

Abra la dirección que muestre Vite con base `/hci-lab-ia/`. La entrada es `src/app/main.tsx`. No abra `index.html` como archivo local.

Para revisar la distribución:

```powershell
npm run build
npm run preview -- --host 127.0.0.1
```

El proyecto académico se guarda en el navegador. Use Gestionar proyecto para respaldarlo en JSON antes de cambiar de origen, navegador o equipo. Los datos de localhost y GitHub Pages no se comparten automáticamente.

## Comprobar cambios

```powershell
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

La [guía de pruebas](pruebas.md) describe configuraciones, fixtures y reportes. La [estructura](estructura.md) explica la organización por dominios. No se añaden dependencias ni se cambia el formato persistente al reorganizar.

## Publicación existente

El workflow `.github/workflows/deploy-pages.yml` instala dependencias, compila, sube `dist/` como artefacto de Pages y despliega al recibir cambios en `main`. Vite conserva la base `/hci-lab-ia/`; `public/` conserva los recursos necesarios. En GitHub Pages se usa GitHub Actions como origen.

Publicar requiere una instrucción explícita posterior. No hace falta ejecutar los scripts de paquetes antiguos para trabajar con este checkout.
