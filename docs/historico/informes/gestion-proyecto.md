# Iteración 2: gestión del proyecto

Respaldo, recuperación y restablecimiento se concentran en **Gestionar proyecto**, en la cabecera común. Se conserva el diseño de la iteración 1 y las rutas existentes. Los botones de exportación de sesiones e informes conservan su función específica.

## Comportamiento

- El restablecimiento requiere confirmación, permite cancelar, borra todas las colecciones y verificaciones, restablece preferencias, reinicia formularios y contadores y detiene las actividades. Conserva el idioma. El proyecto queda vacío también después de recargar; los ejemplos solo se cargan por una acción explícita.
- El JSON incluye los registros persistentes, las preferencias y el idioma. Las métricas se recalculan desde los registros. No incluye actividades sin guardar.
- Se validan versión, estructura, tipos, rangos, campos anidados e identificadores duplicados antes de presentar la confirmación de recuperación. Un rechazo o una cancelación conserva el proyecto actual.
- Los respaldos anteriores de proyecto versión 2 se aceptan sin metadatos de preferencias e idioma: conservan los ajustes actuales y las colecciones opcionales ausentes quedan vacías. Las sesiones antiguas sin contador de rueda reciben cero.
- Los respaldos nuevos conservan la raíz `version: 2` y añaden `backup`, con formato `hci-lab-ia-backup` y versión de metadatos 1.
- El reemplazo se persiste antes de cambiar el estado de la aplicación. Se informa si falla el almacenamiento. Los callbacks de actividades anteriores no pueden volver a guardar datos después del reset.
- Hay seis traducciones para las etiquetas, ayudas, advertencias y confirmaciones nuevas. El diálogo nativo contiene el foco; Cancelar recibe foco en la confirmación y el mensaje final visible, con `role="status"`, recibe foco después de completar la operación.

## Alcance de archivos

La gestión está en `src/enhancements/Reset.tsx`; almacenamiento y validación, en `src/store.tsx` y `src/projectBackup.ts`; mensajes, en `src/manageLocales.ts` y su registro en `src/i18n.ts`; integración y presentación, en `src/App.tsx` y `src/shell.css`.

Los cambios restantes de producción se limitan a retirar exportaciones globales duplicadas de `src/ui.tsx`, inicio, multimodal, seguimiento e informes; evitar una división por cero con un proyecto vacío en `src/domain.ts`; y cancelar un inicio de cámara pendiente antes de llamar a `begin()` en `CameraCalibration.tsx`.

## Verificación

- Lint, 37 pruebas unitarias y compilación aprobados.
- Suite E2E completa: 96 aprobadas, cero fallos y 3 omisiones previstas (zoom real solo en escritorio y calibración prolongada excluida en celular). La comprobación final del diálogo y zoom: 25 aprobadas, cero fallos y 2 omisiones del zoom en tableta/celular.
- Pruebas del reset completo, cancelación, recarga, recuperación con datos de todos los módulos, respaldo anterior, JSON inválido, estructura incompleta, versiones incompatibles y campos anidados incorrectos.
- Detención de micrófono, síntesis de voz, cámara y sus pistas de video; cancelación durante un inicio de cámara pendiente; reinicio de captura de página, chatbot y formulario de reserva.
- Escritorio, tableta y celular; seis idiomas; temas claro, oscuro y alto contraste; teclado, foco y regiones de confirmación; texto al 200 % y zoom real de Chromium al 200 % en escritorio.
- Axe en las 18 rutas, cuatro combinaciones de tema y tres tamaños, además del diálogo en seis idiomas y tres temas.

## Revisión manual

1. Ejecute `npm run dev` y abra la dirección que indique Vite con la ruta `/hci-lab-ia/`.
2. Con un proyecto que contenga registros, abra **Gestionar proyecto** y descargue el respaldo. El archivo se llama `hci-lab-ia-project.json`.
3. Seleccione **Restablecer proyecto** y cancele con el botón o Escape. Compruebe que los registros y preferencias se conservan.
4. Repita y confirme **Borrar datos y restablecer**. Revise las colecciones vacías, preferencias predeterminadas, idioma conservado y foco en la confirmación. Recargue y compruebe nuevamente.
5. Seleccione el respaldo descargado: examine el resumen antes de confirmar. Cancele una vez; luego repita y confirme. Revise datos, preferencias e idioma y recargue.
6. Pruebe archivos con `{` y con `{"version":2}`: deben rechazarse sin modificar el proyecto. Recorra el diálogo usando Tab, Shift+Tab, Enter y Escape.
7. En seguimiento, active la cámara y cierre la superposición de calibración; en multimodal, active el micrófono. Restablezca desde cada ruta y compruebe los indicadores del navegador. Revise los anuncios con su lector de pantalla habitual.

## Limitaciones

La importación admite hasta 25 MB; el almacenamiento efectivo depende de la cuota y permisos del navegador. Las pruebas de cámara y micrófono usan adaptadores simulados: el hardware, permisos reales y anuncios con NVDA, VoiceOver o TalkBack requieren la revisión manual indicada. La automatización se ejecutó en Chromium; no se verificaron Safari ni Firefox. No se publicó ni se hizo push a GitHub; el trabajo termina en esta iteración.

## Capturas

[Escritorio, tema claro](../../evidencias/gestion-proyecto/escritorio-claro.png) · [Tableta, tema oscuro](../../evidencias/gestion-proyecto/tableta-oscuro.png) · [Celular, alto contraste](../../evidencias/gestion-proyecto/celular-contraste.png)
