# Pruebas y recursos

Todos los comandos se ejecutan desde la raíz. Las pruebas, fixtures, herramientas auxiliares y configuraciones exclusivas están en `tests/`.

| Ruta | Uso |
|---|---|
| `tests/unit/` | Vitest y Testing Library |
| `tests/e2e/` | Playwright; ejemplo alternativo Selenium |
| `tests/fixtures/` | Proyectos de prueba y extensión de zoom |
| `tests/setup.ts` | Preparación del entorno unitario |
| `tests/vitest.config.ts` | Descubrimiento, jsdom y ubicación de cobertura |
| `tests/playwright.config.ts` | Chromium, servidor y reportes |
| `tests/katalon/` | Proyecto y recursos de Katalon |
| `tests/tools/` | Comprobación de arquitectura y auditoría PDF opcional |
| `tests/results/` | Resultados locales ignorados, incluido el archivo de ejecuciones anteriores |
| `tests/reports/` | Reportes HTML y cobertura ignorados |

## Comandos habituales

```powershell
npm test
npm run test:watch
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:a11y
```

Los scripts npm pasan explícitamente la configuración correspondiente. Para seleccionar un comportamiento:

```powershell
npm run test:e2e -- --grep 'backup|recovery|reset' --workers=3
npm run test:e2e -- --list
```

Playwright guarda los resultados en `tests/results/playwright/` y los reportes HTML y JSON en `tests/reports/playwright/`. El JSON `results.json` permite contar casos únicos y separar sus ejecuciones por proyecto, sin sumar reintentos. La configuración ya incluye estos reporteros; no necesita reemplazarlos mediante `--reporter`.

```powershell
npx playwright show-report tests/reports/playwright
```

Los tres perfiles son escritorio, tableta y celular en Chromium. El zoom real usa exclusivamente el perfil de escritorio y una extensión local en `tests/fixtures/zoom-extension/`. Los demás perfiles omiten ese caso deliberadamente. La emulación no valida voz, vibración ni dispositivos físicos.

## Reportes de CI

Quality ejecuta lint, Vitest con JUnit en `tests/results/vitest.xml` y compilación. E2E ejecuta la suite Playwright. Ambos workflows suben sus reportes con `always()` y retención de 14 días, también si las pruebas fallan. La cobertura se recoge desde `tests/reports/coverage/` si una ejecución la produce; no se activa ni instala un proveedor de cobertura nuevo.

Quality también comprueba las dependencias. Pages exige estas comprobaciones y E2E antes de subir su artefacto. Esto describe la configuración: su ejecución remota sigue pendiente hasta una autorización de publicación.

Tras compilar, `node tests/tools/audit-release.cjs` revisa los enlaces vigentes, archivos de prueba, resultados ignorados, posibles secretos y tamaños. Con un servidor de preview activo en el puerto 4173, `node tests/tools/audit-release.cjs --preview` comprueba por HTTP cada recurso de `dist/`. Guarda los resultados locales en `tests/reports/`; la búsqueda de secretos reconoce patrones concretos y no reemplaza una revisión humana.

La carga diferida se comprueba con peticiones retenidas y fallidas en `route-loading.spec.ts`. Los chequeos axe esperan el módulo real, sin analizar solo el indicador de carga. `laboratory-journey.spec.ts` enlaza los módulos mediante interacción y verifica la recuperación exacta de los datos; las suites específicas conservan la cobertura detallada de cada operación.

Para reproducir el cierre en este equipo se usa `npm run test:e2e -- --workers=3`. Seis procesos simultáneos agotaron los 30 segundos de cuatro recorridos extensos con axe; se redujo la concurrencia sin ampliar los límites ni retirar comprobaciones. La tabla de Curso declara su región y foco en el componente, y la prueba comprueba que recibe foco tras cargar la ruta. El zoom real de Chromium se obtiene mediante la extensión de prueba; las capturas usan CDP para conservar la geometría del zoom.

Los resultados y las herramientas locales están ignorados. Las capturas académicas elegidas se conservan aparte en [evidencias](evidencias/README.md). Las carpetas archivadas de ejecuciones antiguas conservan sus nombres internos originales para no alterar trazas y reportes históricos; no participan en el descubrimiento de pruebas.

## Auditoría PDF opcional

Requiere Python y PyMuPDF; no es requisito para compilar, probar con npm ni desplegar la aplicación.

```powershell
python -m pip install --target tests/.tools/pdf PyMuPDF==1.28.2
python -B tests/tools/review_report_pdf.py tests/results/playwright/ruta-del-caso/informe-impresion.pdf tests/results/pdf-review
```

Sustituya `ruta-del-caso` por la carpeta real de una ejecución. También puede usar PyMuPDF instalado en su entorno Python. El script admite únicamente entradas y salidas dentro del checkout.

## Herramientas alternativas

- Selenium: con Chrome y el servidor de preview activos, `node tests/e2e/selenium-example.mjs`.
- [Katalon](katalon.md): abra `tests/katalon/HCI-Lab-IA.prj`.
- Lighthouse: con Lighthouse CI disponible en su entorno y `dist/` compilado, ejecute `lhci autorun --config=tests/lighthouserc.json`. La configuración se conserva; no se instala ni añade Lighthouse CI como dependencia.

## Arquitectura y persistencia

`node tests/tools/check-architecture.cjs` comprueba ciclos, imports públicos, aislamiento transitivo y dependencias de `shared/`. Las pruebas de operaciones nuevas usan Node sin React ni almacenamiento real; `projectTransactions.test.tsx` comprueba la composición con React. `module-persistence.spec.ts` provoca fallos de escritura en cada productor migrado, verifica que conserva los datos y comprueba el reintento y la recarga.

Las omisiones previstas de la suite existente son el zoom real por extensión en tableta/celular y el adaptador de validación de cámara en celular. La prueba de cámara usa dobles de prueba: no valida hardware físico.

## Cierre de los seis idiomas

`node tests/tools/check-translations.cjs` comprueba catálogos auxiliares y textos naturales estáticos de JSX. Mantiene excepciones explícitas para marcas, unidades y comandos; no analiza semánticamente cualquier expresión dinámica. `interfaceTranslations.test.ts` exige todas las claves base en cada idioma sin fallback y verifica interpolaciones y catálogos históricos. `legacyInterface.test.tsx` recorre los ejemplos antiguos y verifica que notas y alias no se traduzcan.

`interface-languages.spec.ts` recorre las 19 rutas vacías por idioma, busca copias españolas pendientes y claves visibles, comprueba los estados auxiliares y CSV, y verifica idioma/texto TTS con un adaptador simulado. Ejecuta axe en Accesibilidad con texto al 200 %. Las suites previas conservan las comprobaciones de proyecto con datos, temas, zoom real de escritorio, relaciones, almacenamiento fallido, reset y recuperación. La suite completa se ejecuta una vez sobre el estado final; las ejecuciones focalizadas no se suman a sus cifras.
