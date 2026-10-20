# Organización del repositorio por dominios

## Alcance y estado recibido

La [estructura objetivo](../../estructura.md) se escribió antes de reorganizar. Esta entrega amplía la limpieza previa para centralizar pruebas y separar `src/` en `app/`, `features/` y `shared/`, según la instrucción posterior del usuario.

Se conserva la rama existente, el historial y las bajas de generados que ya estaban en el índice. Antes de mover archivos se guardó una copia de código, pruebas, documentación y configuraciones, junto con hashes y el estado de Git, en `tmp/reorganization-baseline/`. El inventario previo de la limpieza también se conserva.

## Etapas realizadas

1. **Pruebas:** Katalon y la auditoría PDF pasan a `tests/`; las configuraciones de Vitest, Playwright y Lighthouse también. Los scripts npm pasan las configuraciones explícitamente. Pruebas, fixtures y extensión de zoom conservan su contenido; los nombres de suites se expresan por comportamiento.
2. **Aplicación:** entrada y composición en `app/`; funcionalidades en dominios de `features/`; únicamente UI, formularios y exportación compartida en `shared/`. Se separan las pantallas de `pages.tsx` y los símbolos mezclados en los modelos previos, conservando sus cuerpos. Se sustituyen tres reenvíos de exportaciones por imports de los componentes concretos.
3. **Documentación:** índice vigente breve en `docs/`; informes de trabajo en `docs/historico/informes/`; capturas en carpetas por funcionalidad. Los README traducidos se conservan con referencias actualizadas.
4. **Archivos locales:** resultados antiguos se archivan en `tests/results/archive/`, HTML en `tests/reports/archive/`, auditorías PDF en el archivo de resultados y PyMuPDF en `tests/.tools/pdf/`. Se conservan sus contenidos. La caché local de PowerShell se guarda en `tmp/local-cache/`.

Las rutas públicas, claves de almacenamiento, esquema persistente, identificadores históricos, traducciones y dependencias de la aplicación se conservan. Los marcadores antiguos dentro de datos y fixtures se mantienen para verificar compatibilidad; no nombran módulos activos.

## Verificación

- Primera etapa de pruebas: 114 pruebas unitarias aprobadas y descubrimiento de 387 casos E2E en 19 archivos, con los nombres por comportamiento.
- Aplicación: 103 archivos originales distribuidos en 123 archivos por dominio. Comparación estructural de 330 declaraciones/instrucciones, sin cambios de cuerpo; 14 archivos de estilos y recursos conservados byte a byte. Tres archivos que solo reenviaban exportaciones se consolidan en sus implementaciones.
- Datos de fixtures conservados; solo cambian sus imports. Las 71 capturas seleccionadas conservan sus hashes.
- Los 8.037 archivos generados retirados previamente del índice se encuentran en sus nuevas rutas locales y conservan sus bytes. Los nombres exteriores del archivo local se abrevian cuando hace falta para mantener rutas compatibles con Windows.
- Dependencias, lockfile, base de Vite y workflow de Pages conservados. No hay carpetas vacías ni nombres de iteración en las carpetas y archivos de código, pruebas o evidencias seleccionadas.
- Enlaces Markdown locales revisados: sin destinos ausentes. Las reglas de exclusión no ocultan código, pruebas, fixtures, recursos, traducciones ni documentación vigente.
- `git diff --check`: correcto. Sintaxis de los scripts históricos PowerShell: correcta; no se aplican paquetes a repositorios de usuario.
- Lint y ejecución unitaria final: correctos, 114 pruebas en 14 archivos. JUnit se produce en `tests/results/vitest.xml`.
- La carpeta definitiva del reporte HTML se comprueba con un caso de accesibilidad aprobado, usando `tests/results/report-path-check` como salida independiente.
- El script PDF se ejecuta desde `tests/tools/` sobre una salida nueva de 18 páginas. Genera sus imágenes/texto en `tests/results/pdf-review`, sin texto fuera de página ni glifos de sustitución.

- Compilación final con las configuraciones definitivas: correcta. Persiste la advertencia anterior de Vite por el paquete principal de aproximadamente 839 kB; no se cambia la división de paquetes.
- Suite E2E completa: **384 aprobadas y 3 omisiones previstas**, 387 casos en 19 archivos, en escritorio, tableta y celular (16,3 minutos). Se omiten el zoom real de tableta/celular y el adaptador antiguo de cámara en celular. Sin fallos.
- Reporte completo disponible localmente en `tests/reports/playwright/index.html`; resultados en `tests/results/playwright/`. La comprobación independiente de la ruta HTML queda archivada bajo `tests/reports/archive/`. No quedan carpetas duplicadas `tests/tests/`.

Las pruebas y la compilación necesitaron ejecución fuera de la restricción local que impedía a esbuild leer sus configuraciones. No requirieron cambiar las configuraciones de seguridad del proyecto ni instalar dependencias nuevas.

No se ejecutan Katalon, Selenium ni Lighthouse en sus herramientas externas. Los workflows se revisan localmente; su subida efectiva de artefactos requiere una ejecución futura de Actions. Las comprobaciones con cámara usan el motor simulado de las pruebas y no validan hardware físico.

Los mapas detallados de movimientos y el inventario de integridad se conservan localmente en `tmp/reorganization-baseline/`. Las bajas anteriores de generados permanecen en el índice; la reorganización nueva queda en el árbol de trabajo. Los destinos nuevos todavía no se añaden al índice, de modo que Git puede mostrar origen eliminado y destino nuevo hasta preparar los movimientos. No se ha hecho commit, push ni publicación.
