# Iteración 6: Seguimiento UX

La iteración se limita al seguimiento y a su integración necesaria con Informes, reset y respaldo. No se publicó ni se hizo push. Los registros antiguos y los textos escritos por el usuario se conservan.

## Cambios

- Un motor de captura y controles compartidos para el ejemplo y el contenido principal de la página. Flujo preparar, iniciar, interactuar, detener, revisar y guardar; alias opcional, sin código de participante.
- Clics y activaciones de teclado contados una vez, excluyendo controles de seguimiento, navegación y barra superior. Muestras con coordenadas, tiempo relativo al inicio, ruta y zona estructural; sin valores de los formularios observados.
- Eventos de rueda separados del desplazamiento efectivo, profundidad máxima e historial. Desplazarse no demuestra lectura ni atención.
- Mapas sobre el contenido registrado, capas independientes para clics, cursor, simulación y cámara; visibilidad, leyenda, cantidades y equivalente textual. Exportación JSON, CSV y PNG de la capa visible. El PNG no incluye el contenido ni la imagen de cámara.
- Cursor como aproximación, patrón F y Gutenberg explícitamente simulados. Inicio, pausa, continuación, detención y cambio de modo; tiempos reales y reducción de movimiento.
- Cámara opcional con consentimiento, vista previa, estado y WebGazer 3.5.3. Calibración de nueve puntos con cinco pulsaciones cada uno y validación con cinco puntos independientes. Se informa el error mediano observado en píxeles y las muestras válidas; no se inventa precisión ni se infieren emociones.
- Sesiones guardadas con tarea, observaciones, duración, muestras, scroll, cambios de modo y validación cuando existe. Consulta en Seguimiento e Informes, respaldo y recuperación compatibles con registros anteriores y reset global.
- Traducciones completas del módulo en español, inglés, portugués, francés, italiano y catalán. Controles accesibles, foco al iniciar/detener, calibración modal con teclado y Escape.

## Verificación automatizada

- `npm run lint`: aprobado, sin advertencias de ESLint.
- `npm test`: 94 pruebas aprobadas en 11 archivos.
- `npm run build`: aprobado. Vite mantiene la advertencia no bloqueante de un paquete mayor de 500 kB; el paquete principal es aproximadamente 724 kB antes de gzip.
- `npm run test:e2e -- --workers=4 --output=test-results-iteration-6-approved`: 282 casos aprobados, 3 omisiones previstas y ningún fallo (285 casos, 7,8 minutos). Se omiten dos variantes de zoom real, reservado a escritorio, y el adaptador antiguo de calibración en celular; las cinco pruebas nuevas de cámara simulada sí se ejecutan en los tres tamaños. Estado final disponible en `test-results-iteration-6-approved/.last-run.json`.
- Verificación focalizada tras corregir el conteo de rueda: 42 casos aprobados en los tres tamaños (`test-results-iteration-6-closure`). Incluye descarga PNG, JSON/CSV y axe.

La cobertura incluye conteo exacto y teclado, exclusión de controles, privacidad de formularios, rueda sin desplazamiento, scroll efectivo, profundidad, alineación del mapa al desplazarse, simulación y pausa, cambio de modo, descarte/cancelación, exportaciones, observaciones antes de guardar, recarga, Informes, respaldo, recuperación y reset. Se prueba la interrupción por ruta/tamaño y que abrir resultados con mayor altura no interrumpa una captura válida.

Axe se ejecuta en las rutas existentes y en el módulo, incluidos sus estados y el diálogo de calibración. Se verifican los seis idiomas, los temas claro/oscuro y alto contraste, y los tamaños de escritorio, tableta y celular en Chromium; tableta y celular se emulan en Playwright. La prueba existente de zoom real al 200 % se ejecuta en escritorio.

Las pruebas de cámara usan un estimador, permisos y pistas de vídeo simulados: permiso concedido/rechazado, dispositivo ausente, API ausente, ausencia de predicciones, calibración/validación independientes, error calculado, predicciones simultáneas con simulación, vista previa, navegación, reset y liberación de recursos, incluida una activación asíncrona tardía. Estas pruebas comprueban el adaptador y el flujo, no el rendimiento del SDK con una cámara física.

## Revisión manual

1. Ejecute `npm run preview -- --host 127.0.0.1` y abra `http://127.0.0.1:4173/hci-lab-ia/#/tracking`. Seleccione idioma y tema; revise también tableta, celular y zoom al 200 %.
2. Describa una tarea y deje el alias vacío si lo prefiere. Inicie la captura del ejemplo. Compruebe el foco, active servicios con ratón y Enter, y escriba una descripción ficticia. Los clics deben aumentar inmediatamente; cambiar los controles de seguimiento no debe aumentarlos.
3. Desplace el ejemplo con rueda y teclado. Compare eventos de rueda con desplazamientos efectivos, profundidad y resumen textual. Cambie las capas, oculte/muestre el mapa y compruebe su alineación al desplazarse.
4. Inicie el recorrido del cursor; después pruebe F y Gutenberg, pausa, continuación y detener recorrido. Las capas de simulación y cámara deben permanecer separadas. Detenga la captura, escriba observaciones, descargue JSON/CSV/PNG y guarde. Recargue y consulte la sesión en Seguimiento e Informes.
5. Prepare otra sesión y pruebe cancelar el descarte. En otra página abra “Seguimiento de página”, seleccione su contenido principal e inicie. Cambiar de ruta o tamaño debe detener y explicar la interrupción, ocultando un mapa cuya geometría dejó de ser válida. Aumentar solo la altura de resultados no debe detenerla.
6. Descargue un respaldo antes de probar el reset con datos propios. Compruebe recuperación de registros nuevos y antiguos, cancelación del reset y reset confirmado; recargue para verificar que los datos eliminados no reaparecen.
7. Con una cámara física, use localhost o HTTPS y conexión a Internet. Antes de capturar, lea la explicación y otorgue consentimiento; pruebe permisos concedidos/rechazados y ausencia de dispositivo. Active la vista previa, calibre los nueve puntos y valide mirando los cinco puntos independientes sin pulsarlos. Compruebe muestras reales y error mediano calculado; con predicciones insuficientes debe aparecer una explicación sin precisión inventada. Recalibre o elija simulación explícitamente.
8. Con cámara física, compruebe el indicador de cámara y la liberación de pistas al cerrar/Escape, detener cámara, detener captura, salir del módulo y restablecer el proyecto. Compruebe también cancelar mientras está pendiente el permiso. Revise las solicitudes de red y el comportamiento del SDK en su navegador y dispositivo.

## Límites y datos

- No se realizaron pruebas con cámara física. La utilidad de la mirada estimada, iluminación, disponibilidad de modelos, permisos del navegador y liberación efectiva del dispositivo requieren la revisión manual anterior. Un resultado validado sigue siendo una estimación experimental, no fijaciones, atención, comprensión ni emociones.
- WebGazer procesa los fotogramas en el navegador. La aplicación carga código y recursos externos de jsDelivr y MediaPipe; los proveedores reciben las solicitudes de descarga y sus metadatos de red. La aplicación no exporta vídeo ni fotogramas. Guarda posiciones, tiempos y calidad de validación, además de tarea, alias y observaciones introducidos explícitamente. Referencias: [WebGazer](https://webgazer.cs.brown.edu/) y [versión fijada 3.5.3](https://cdn.jsdelivr.net/npm/webgazer@3.5.3/package.json).
- La captura de página usa coordenadas de documento y su scroll principal. Si se desplaza un panel independiente dentro del contenido capturado, se detiene para evitar mezclar coordenadas; el ejemplo tiene su propio sistema de coordenadas y permite capturar su scroll interno.
- Cambios que invalidan posiciones registradas detienen la captura. Los mapas históricos no se reproducen sobre contenido que haya cambiado; se conservan sus resúmenes y exportaciones, sin guardar instantáneas de HTML.
- Límite de 5.000 muestras por capa e historial acotado. Si se alcanza, aparece el aviso de truncamiento; el contador total de clics continúa aunque se limite su detalle. El resumen visible muestra los últimos veinte registros de scroll; JSON/CSV incluyen todos los conservados.
- La cantidad de predicciones de cámara puede superar las muestras guardadas: la captura filtra por contenido elegido y limita frecuencia y tamaño. Los mapas son distribuciones relativas de muestras, no medidas de comprensión.

## Archivos principales

Capturas de revisión de la versión comprobada: [escritorio](iteracion-6-capturas/desktop-preparar.png), [tableta](iteracion-6-capturas/tablet-preparar.png), [celular](iteracion-6-capturas/mobile-preparar.png), [mapa sobre el ejemplo](iteracion-6-capturas/mobile-mapa-cursor.png) y [antipatrón aislado](iteracion-6-capturas/mobile-antipatron.png). La carpeta contiene también controles y mapas en los tres tamaños.

`src/components/tracking/` contiene el motor, controles, ejemplo, cámara, resultados y traducciones. La integración necesaria está en `src/App.tsx`, `src/i18n.ts`, `src/enhancements/PageTracker.tsx`, `src/enhancements/model.ts`, `src/projectBackup.ts`, `src/enhancements/Reports.tsx`, `src/enhancements/reportModel.ts` y estilos de seguimiento en `src/styles.css`. Las verificaciones están en las pruebas unitarias de seguimiento y las suites E2E de seguimiento, cámara y gestión del proyecto.
