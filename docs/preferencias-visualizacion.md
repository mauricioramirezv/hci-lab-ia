# Preferencias de visualización

El botón junto al tema abre un panel global en todas las rutas. Accesibilidad usa los mismos controles y estado: texto entre 100 % y 200 %, restablecimiento del tamaño, fondo oscuro, alto contraste, espaciado, fuente alternativa y reducción de movimiento. La fuente alternativa es una elección de lectura; no garantiza beneficios para toda persona con dislexia.

Las opciones se conservan al navegar y recargar, y forman parte del respaldo. Las preferencias antiguas parciales se completan con los valores predeterminados. Un fallo de almacenamiento conserva la configuración anterior y permite reintentar, sin anunciar éxito. Restaurar preferencias modifica únicamente la visualización; el reset global conserva su alcance anterior y el idioma seleccionado.

## Teclado y revisión

Abra el botón con Enter o Espacio. Tab y Mayús+Tab recorren el panel modal; Escape o Cerrar devuelve el foco al botón. El fondo queda inerte. El tamaño actual se muestra sin anuncios repetidos; restaurar sí ofrece confirmación accesible.

Revise formularios, navegación, tablas, mensajes, ejemplos, diálogos e informes en los seis idiomas, con temas claro/oscuro y alto contraste. Combine texto al 200 %, espaciado y fuente alternativa; pruebe también zoom real del navegador al 200 %. Las tablas anchas pueden desplazarse dentro de su contenedor. La impresión utiliza unidades relativas para respetar el tamaño elegido.

## Experimentos y capturas

Los objetivos de Fitts conservan sus dimensiones en píxeles CSS: son parte de la condición experimental. La interfaz circundante sí aumenta. Cambiar preferencias o tamaño de ventana interrumpe un ensayo activo y conserva sus filas parciales para revisión; exige repetir la práctica antes de medir. Un resultado completo conserva el contexto del inicio aunque se guarde después de cambiar preferencias.

Los nuevos experimentos registran apariencia, tamaño de ventana y relación de píxeles en el mapa numérico de puntuaciones existente. Los informes separan las agrupaciones con contextos diferentes y los registros históricos sin contexto. Se conservan claves, identificadores y versión del respaldo.

Cambiar preferencias detiene una captura UX activa, libera sus recursos y oculta el mapa de coordenadas anterior. Las muestras siguen disponibles para guardar o descargar; una nueva captura requiere otra sesión. No se superponen coordenadas incompatibles.

Los simuladores de discapacidad están identificados como demostraciones independientes. La reducción de movimiento pausa el desplazamiento de la simulación motora sin cambiar su selección ni los filtros didácticos.

## Comprobaciones

Las pruebas están en `tests/unit/displayPreferences.test.ts`, `tests/unit/displayPreferenceIntegration.test.tsx`, `tests/e2e/display-preferences.spec.ts` y `tests/e2e/browser-zoom.spec.ts`. Cubren reglas, persistencia fallida, recuperación antigua y actual, restauración, reset, foco, idiomas, axe, disposición y conservación de capturas y condiciones experimentales. Los resultados y capturas generados permanecen ignorados.

La automatización de Chromium y axe no sustituye una revisión con lectores de pantalla, dispositivos físicos ni personas usuarias. Compruebe manualmente anuncios, comodidad de lectura y uso táctil en los dispositivos previstos.

Para revisar: abra el panel con teclado y combine opciones; recorra un formulario y un ejemplo; guarde un respaldo, restaure preferencias y recupere el respaldo; cambie el tamaño durante una captura y compruebe que sus muestras siguen disponibles. Verifique con su lector de pantalla el anuncio de restauración y el retorno del foco. Repita en un celular físico.

La regresión completa ejecutada obtuvo 483 E2E correctos y tres omisiones existentes: zoom por extensión en tableta y móvil, y calibración simulada de cámara en móvil. El zoom real se verifica en escritorio; los adaptadores de cámara se prueban con simulaciones, sin afirmar validación de una cámara física. Las 220 pruebas unitarias y de integración pasan; el analizador de 241 módulos no encuentra ciclos ni infracciones de aislamiento.

Una ejecución final añadió cuatro comprobaciones correctas: ejemplos con preferencias combinadas en los tres tamaños de pantalla y todas las rutas con texto al 200 % más zoom real al 200 %. Lint y compilación pasan; Vite mantiene su aviso de paquete JavaScript superior a 500 kB. Los reportes locales se conservan en `tests/reports/playwright/` y `tests/reports/display-preferences-review/`, fuera de Git.
