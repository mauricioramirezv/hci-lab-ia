# Iteración 8: Informes

Esta entrega corresponde únicamente a Informes. Conserva rutas y datos anteriores. No representa la verificación integral del proyecto ni publicación en GitHub.

## Cambios

- Tres secciones: resumen, evidencias guardadas y generación del informe. Un proyecto vacío muestra orientación y enlaces; no muestra cuestionarios vacíos ni resultados ficticios.
- Catálogo unificado de personas y empatía, escenarios, reservas, hallazgos, sesiones UX antiguas, Conceptos, Patrones, Fitts/Hick, SUS, Raw TLX, chatbots, decisiones humanas sobre IA, seguimiento actual e histórico, actividades multimodales, eventos y comprobaciones de accesibilidad.
- Búsqueda sin distinción de acentos o mayúsculas, filtros por tipo/condición, detalle, datos originales y selección explícita. Filtrar no modifica la selección. Los botones de selección total afectan todo el catálogo, según sus etiquetas.
- Indicadores separados por tarea, condición, versión y método. Los ceros observados se conservan; no se usan ceros para suplir datos ausentes. Las medias indican n y su cálculo. SUS y Raw TLX se calculan a partir de respuestas individuales completas. Los registros antiguos incompletos se conservan con advertencias y se excluyen de las métricas que no permiten calcular.
- Comparación de grupos de registros con tarea, método e instrumento equivalentes; condiciones y versiones homogéneas dentro de cada grupo, sin registros compartidos. Se muestran fechas, versiones, condiciones, n, medias y diferencias. Cambiar tamaño de Fitts o cantidad de opciones de Hick es posible cuando los intentos y el método de entrada son equivalentes. No se mezclan teclado y puntero ni Fitts y Hick. Hace falta una justificación escrita para incorporar la comparación al informe.
- Borrador con identificación, objetivo, método, interpretación, mejoras, limitaciones, conclusiones y referencias aportadas por el estudiante. No se generan conclusiones ni referencias automáticamente. Las secciones sin información se identifican.
- Vista previa semántica con tablas; Markdown proviene del mismo modelo. Exportar no guarda el borrador ni altera las evidencias. El borrador solo se guarda explícitamente; incluye selección y comparación, participa en el respaldo y desaparece con reset. Un error de almacenamiento no confirma un guardado inexistente.
- Markdown para edición; PDF mediante impresión del navegador; CSV con encabezados localizados, BOM UTF-8 y una fila por campo/respuesta/intento/muestra; JSON con originales exactos de la selección y el texto del informe. Los nombres internos de los datos originales se conservan para análisis y trazabilidad. CSV protege textos que podrían ejecutarse como fórmulas.
- Los controles y textos generados se traducen a los seis idiomas. No se traducen textos escritos por el usuario ni se reescriben datos históricos. Los originales completos están disponibles en JSON y en el detalle técnico.

## Verificación realizada

- Lint y compilación: correctos. Vite mantiene su advertencia no bloqueante por el paquete principal de aproximadamente 839 kB.
- Pruebas unitarias: 113 aprobadas en 13 archivos.
- Regresión pertinente: 133 pruebas aprobadas y 2 omisiones previstas para zoom real en los perfiles de tableta y celular. Se comprobó zoom real al 200 % en escritorio, navegación, gestión del proyecto y compatibilidad con evidencias anteriores.
- Suite completa de Informes: 42 pruebas aprobadas en escritorio, tableta y celular, incluidos búsqueda, selección, comparación, guardado, recuperación, seis idiomas y axe sin infracciones en los estados comprobados.
- Comprobación final de exportación y presentación: 30 pruebas aprobadas después del ajuste de impresión, con los seis idiomas y los temas existentes.
- Los siete PDF de comprobación se renderizaron y auditaron: 18 páginas cada uno, sin texto fuera de los límites de página, glifos de sustitución ni marcadores de traducción pendientes. Se revisaron también las tablas, acentos y capturas adaptativas. Esto no sustituye la revisión manual de otros navegadores ni de proyectos con textos de longitud excepcional.
- No quedan fallos automatizados en estas ejecuciones. Las ejecuciones se solapan: sus cantidades no deben sumarse como pruebas distintas.

Capturas para orientar la revisión: [escritorio](../../evidencias/informes/desktop.png), [tableta](../../evidencias/informes/tablet.png) y [celular](../../evidencias/informes/mobile.png).

## Revisión manual

1. Ejecute `npm run preview -- --host 127.0.0.1` y abra `http://127.0.0.1:4173/hci-lab-ia/#/reports`.
2. En un proyecto vacío, compruebe las tres secciones y use los enlaces a actividades. Guarde evidencias propias en varios módulos y regrese: deben aparecer con tipo, tarea, fecha, condición, alias cuando exista, resultados y observaciones.
3. Busque una observación; filtre por tipo y condición. Abra el detalle de una persona para revisar los cuatro cuadrantes de empatía y el de seguimiento para revisar muestras y canales. Observe que no se declaran lectura, mirada real ni precisión sin validación.
4. Quite la selección y marque unos pocos registros. Abra Generar informe, escriba su objetivo, método e interpretación. Añada solo referencias realmente utilizadas. Revise la vista previa y compruebe que no contiene datos excluidos. Modificar la selección o el texto obliga a abrir otra vista previa.
5. Seleccione grupos antes/después con la misma tarea e instrumento. Compruebe fechas, versión, condición y n. Por ejemplo, tiempo 20 s antes y 10 s después da una diferencia de −10 s. Un grupo con SUS y otro con Raw TLX, tareas distintas o Fitts frente a Hick debe rechazarse. Justifique la comparación antes de incluirla.
6. Descargue Markdown, CSV y JSON. Compare títulos, acentos, observaciones y selección con la vista previa. JSON debe conservar todas las respuestas y muestras originales; CSV incluye sus índices, campos y unidades. En un editor de hojas de cálculo, importe UTF-8 y campos separados por coma; los decimales usan punto.
7. Use Imprimir / guardar PDF. Revise A4, márgenes, tablas y saltos de página. Solo se imprime la vista previa. Puede desactivar encabezados y pies propios del navegador. El cuadro de impresión depende del navegador y sistema operativo.
8. Repita en los seis idiomas, temas claro/oscuro/alto contraste, escritorio/tableta/celular y zoom 200 %. Use Tab, Shift+Tab, Enter y Espacio. El foco debe llegar al formulario y a la vista previa al abrirlos.
9. Guarde el borrador y recargue. Descargue un respaldo desde Gestionar proyecto antes de probar reset con datos propios. Cancele reset y compruebe que no cambia nada; después confirme, recargue y recupere el respaldo. La selección y el texto del borrador deben recuperarse junto a las evidencias.

## Límites

- n cuenta registros, no participantes independientes. Alias repetidos o vacíos no demuestran independencia; las diferencias son descriptivas y no establecen causalidad ni significancia estadística.
- Las personas y escenarios antiguos no guardaban fecha, alias ni versión: se indica que no se registraron. Se conservan los resultados históricos aunque no haya respuestas o método suficiente para verificar una métrica.
- Los mapas de seguimiento se presentan mediante conteos por canal y resultados textuales; las coordenadas y muestras completas se conservan en JSON/CSV. No se reconstruye una página histórica ni se superponen mapas con geometrías incompatibles.
- Las referencias son texto aportado por el estudiante. Debe verificar que realmente consultó las fuentes; no se atribuye una validación automática de su pertinencia.
- PDF usa impresión, no un servicio externo de generación. Chromium se prueba automáticamente; quedan la revisión con lector de pantalla, otros navegadores y dispositivos físicos, calidad lingüística y la impresión de proyectos con observaciones extraordinariamente largas.
- La advertencia de tamaño del paquete principal en Vite sigue siendo no bloqueante. La verificación integral de las ocho iteraciones queda para el trabajo posterior solicitado.

## Archivos

Componentes y estilos: `src/reports/`. Adaptadores de la ruta conservada: `src/enhancements/Reports.tsx` y `reportModel.ts`. Persistencia mínima del borrador: `src/domain.ts`, `src/store.tsx` y `src/projectBackup.ts`. Pruebas: `tests/unit/reports.test.ts`, comprobación transaccional en `projectStore.test.tsx`, `tests/fixtures/reportsProject.ts` y `tests/e2e/reports-iteration8.spec.ts`; se actualizaron los selectores de pruebas anteriores para la organización nueva de Informes.
