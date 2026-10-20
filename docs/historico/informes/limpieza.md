# Iteración 9: limpieza y organización

Alcance exclusivo: organización del repositorio. No se reorganiza `src/`, no se cambian funciones, arquitectura, dependencias ni formatos persistentes. No se incorpora trabajo de la iteración 10.

## Estado recibido y preservación

Rama: `feature/limpieza-iteracion-9`; base recibida: `748a717`. Al comenzar, Git marcaba 158 archivos modificados y no había archivos nuevos sin seguimiento. Se guardaron rutas, estado y hashes SHA-256 de todos los archivos versionados en `tmp/iteration9-baseline/received-state.json`, antes de editar.

Con `core.autocrlf=true`, la comparación normal no mostraba cambios de contenido. La comparación sin conversión mostraba 12 archivos con finales de línea mixtos. Se preserva el estado recibido, sin normalizar esos archivos. Las modificaciones de esta limpieza se contrastan con el inventario recibido, además de con HEAD.

## Archivos generados retirados del índice

Se retiran del seguimiento **8.037 archivos**, **1.128.583.486 bytes** (aproximadamente **1,05 GiB**, suma de tamaños de las copias locales; no es el tamaño comprimido de Git). Las copias locales se conservan con `git rm --cached`.

| Grupo | Archivos | Bytes |
|---|---:|---:|
| `test-results*/` | 7.502 | 1.049.406.943 |
| `tmp/` | 395 | 23.502.649 |
| `.tools/` | 139 | 55.665.648 |
| `Microsoft/` | 1 | 8.246 |

Los resultados contienen trazas, videos, capturas y perfiles/cachés de Chromium. `tmp/` contiene renders y texto de auditoría PDF; las imágenes académicas seleccionadas estaban en `docs/` y se conservan. `.tools/` es una instalación local de PyMuPDF, usada únicamente por el script opcional de auditoría. `Microsoft/` contiene la caché de análisis de módulos de PowerShell. No se retiran código, fixtures, traducciones ni recursos públicos.

No había archivos versionados en `playwright-report/`, `coverage/`, `dist/` ni `node_modules/`. Quedan ignorados junto a las variantes de resultados por iteración. Las referencias históricas a resultados registran ejecuciones pasadas: sus carpetas ahora son locales, no enlaces a archivos del código.

**Retirar estos archivos del estado actual no elimina sus versiones anteriores del historial Git ni reduce por sí solo el historial descargado.** No se reescribe el historial.

## Reubicaciones y prevención

- Las 71 capturas seleccionadas de las ocho entregas se agrupan en `docs/evidencias/`; se actualizan sus enlaces. En total se reubican 83 archivos existentes: 71 imágenes, 8 guías/manifiestos históricos, 2 guías vigentes y 2 scripts.
- Las guías de accesibilidad y contribución pasan a `docs/`; `CONTRIBUTING.md` conserva una entrada para GitHub.
- Las guías antiguas de actualización, estado, verificación y configuración inicial pasan a `docs/historico/`, junto con los manifiestos originales. Se conserva el README principal anterior como referencia.
- Los dos scripts de actualización pasan a `scripts/historico/`. Ahora exigen `-Paquete` para usar un paquete original completo; no leen archivos desde su nueva carpeta como si fuera el paquete antiguo. Se conservan las comprobaciones de ramas, cambios pendientes e integridad.
- El README principal se abrevia. Los cuatro README traducidos conservan su contenido y solo reciben ajustes de enlaces necesarios.
- `.gitignore` previene resultados por iteración, temporales, herramientas locales y cachés; ESLint excluye esas salidas conservadas localmente.
- E2E produce reporte HTML y resultados descargables. Quality produce JUnit y recoge cobertura si existe. Ambos workflows suben artefactos con `always()` y retención de 14 días. No se generan archivos de reporte dentro del código versionado.

Las configuraciones, `package.json`, lockfile, licencia, política de seguridad y changelog permanecen en la raíz. Vite conserva `/hci-lab-ia/`; Pages sigue compilando y publicando `dist/`. No se modifica el workflow de despliegue.

## Verificación

- Auditoría SHA-256 de los 8.303 archivos recibidos: todos se encuentran en su ruta original o destino documentado. Sin cambios de bytes en `src/`, `tests/`, `public/`, imágenes seleccionadas, manifiestos archivados ni copias locales de los generados retirados.
- Enlaces Markdown locales de README, documentación y guías de scripts: sin destinos ausentes. Se conservan las referencias históricas a rutas internas de los paquetes originales.
- Índice Git: ninguno de los 8.037 generados sigue versionado. Exclusiones: coinciden los ocho grupos previstos y no se ignoran código, pruebas, fixtures, traducciones, recursos ni destinos reubicados.
- Sintaxis de ambos scripts PowerShell y presencia del parámetro `Paquete`: correctas. No se ejecutan las actualizaciones históricas contra repositorios de usuario.
- Script opcional de auditoría PDF: ejecutado sobre un PDF existente de 18 páginas; genera imágenes y texto en `tmp/pdfs/iteration9-script-check`, sin texto fuera de página, glifos de sustitución ni marcadores pendientes. La instalación local de PyMuPDF sigue disponible tras retirarla del índice.
- `npm ci`: correcto; no se modifica el lockfile ni las dependencias declaradas.
- `npm run lint`: correcto.
- Pruebas unitarias: **114 aprobadas en 14 archivos**. Se verifica también el comando de CI que genera `tmp/ci/vitest.xml`.
- `npm run build`: correcto; Vite conserva la advertencia previa del paquete principal de aproximadamente 839 kB. No se modifica su división por paquetes en esta iteración.
- Regresión pertinente E2E: **18 aprobadas**, con escritorio, tableta y celular; todas las rutas en cuatro temas con axe/layout, seis idiomas de la interfaz común y catálogo de evidencias de todos los módulos con fixtures. Se comprueba la producción del reporte HTML.

Comando E2E: `npm run test:e2e -- --grep 'all routes|six languages translate the common shell|reports8: every module' --workers=3 --output=test-results-iteration-9 --reporter=list,html`.

Limitaciones: las pruebas unitarias y el servidor E2E necesitaron ejecución fuera de la restricción local que impedía a esbuild leer la configuración. No se ha ejecutado la suite E2E completa ni se han lanzado workflows en GitHub; la subida y descarga efectiva de artefactos requiere una ejecución futura de Actions. Se revisan las rutas del despliegue existente y se compila, sin publicar. No se valida hardware físico ni otros navegadores.

El inventario local detallado por grupo y ruta, las reubicaciones y la auditoría están en `tmp/iteration9-baseline/`. Los archivos nuevos/reubicados de documentación se dejan para revisión; las bajas del seguimiento de generados están en el índice. No se hace commit, push ni publicación.
