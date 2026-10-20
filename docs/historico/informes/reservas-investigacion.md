# Iteración 5: reservas, personas, empatía y escenarios

## Cambios

Las rutas `#/lab` y `#/research` mantienen el diseño común de las iteraciones anteriores. No se modificaron los componentes de Seguimiento UX, Experimentos, Conceptos ni Patrones. No se publicó ni se hizo push.

Reservas ofrece universidad (asesoría y taller), salud (cita ficticia) y cultura (visita y actividad). Todos los servicios y horarios son didácticos; no existe conexión con instituciones ni disponibilidad real. El flujo tiene servicio, fecha y hora, revisión y confirmación. Permite volver conservando los campos, cancelar sin cambiar reservas guardadas y comenzar otra reserva. Valida fechas reales y futuras según la hora local del navegador. La confirmación tiene protección frente a doble clic y reservas activas idénticas, también en el almacenamiento compartido. Las reservas guardadas permiten reprogramar con revisión y confirmación, o cancelar mediante diálogo. Las canceladas se conservan en el historial.

Buena práctica y antipatrón comparten datos, pasos y controles. Cambiar la condición conserva el avance. El problema deliberado del antipatrón consiste en ocultar el resumen del servicio durante la selección de fecha y hora, obligando a recordarlo o volver. Los controles generales, errores y confirmaciones siguen siendo accesibles. Sus estilos están limitados al ejemplo.

Personas tiene lista, consulta y formulario independiente para crear o editar. Solicita nombre ficticio, contexto, objetivo, necesidades o barreras y dispositivo; edad o rango es opcional. Se distinguen observaciones, supuestos y fuentes. El mapa de empatía es opcional y conserva dice, piensa, hace y siente. Las emociones nuevas o modificadas requieren origen observado o autodeclarado; ninguna se infiere mediante cámara. Los registros anteriores sin origen permanecen disponibles y se identifican como «Origen sin registrar».

Escenarios tiene lista, consulta y formulario independiente con título, persona vinculada, contexto, tarea, restricción y éxito observable. Si no hay personas, se indica cómo crear una. El ejemplo ficticio solo se copia al formulario cuando se pulsa su acción y no se guarda hasta confirmar el formulario.

Los vínculos nuevos usan el identificador estable de la persona y sobreviven al cambio de nombre. Los vínculos antiguos por nombre se resuelven solo cuando son inequívocos. Una persona con escenarios vinculados no puede eliminarse hasta reasignarlos o eliminarlos explícitamente; no se hace borrado en cascada. Los nombres antiguos ambiguos deben repararse desde el escenario antes de renombrar o borrar la persona. Los escenarios antiguos con personas ausentes se conservan y muestran una advertencia para reparar su vínculo.

Todo el contenido nuevo está traducido a español, inglés, portugués, francés, italiano y catalán. Los textos del usuario y los datos existentes se conservan literalmente. Los formularios validan junto al campo, conservan las entradas y enfocan el primer error. Los cambios de paso, consultas y resultados tienen foco; las confirmaciones son visibles y anunciadas. Los diálogos nativos permiten Tab, Shift+Tab y Escape.

## Persistencia y compatibilidad

El proyecto conserva su versión 2 y el respaldo su versión 1. Se agregaron campos opcionales de servicio y condición en reservas; procedencia en personas; vínculo y marca ficticia en escenarios. El validador rechaza tipos y valores inválidos para estos campos y sigue aceptando respaldos anteriores sin ellos. Reset e importación reinician también los formularios abiertos de esta iteración. Se comprobó la conservación de evidencias anteriores de Conceptos y Patrones, además de las demás colecciones.

Archivos principales: `src/projectActivities/{Reservations,Research,ui}.tsx`, `src/projectActivities/{model,fields,locales}.ts`, `src/projectActivities/styles.css`. Integración indispensable: `src/Pages.tsx`, `src/domain.ts`, `src/store.tsx`, `src/projectBackup.ts` y `src/i18n.ts`. Se ampliaron las pruebas y se adaptaron las comprobaciones antiguas al nuevo flujo.

## Verificación

Comandos: `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e -- --workers=4 --output=test-results-iteration-5-complete`.

La verificación específica cubre los tres contextos y ambas condiciones en los seis idiomas, escritorio, tableta y celular; campos inválidos, regreso, cancelación, confirmación única, reprogramación, creación, consulta, edición, eliminación, empatía, cambio de nombre, reasignación, vínculos antiguos ambiguos, conservación de texto al cambiar idioma, recarga, reset con borradores abiertos, respaldo y recuperación. Se rechazan JSON inválidos y estructuras incompletas sin alterar el proyecto. Axe revisa los pasos, errores, resultados, formularios, empatía, consultas y diálogos en los cuatro temas. La suite mantiene la revisión de todas las rutas, menú móvil, foco de ruta y zoom real al 200 % en Chromium de escritorio.

Resultados de la suite completa: lint y compilación correctos, **84 pruebas unitarias correctas**, **240 pruebas E2E correctas y 3 omisiones previstas**, sin fallos. El zoom mediante extensión se ejecuta solo en escritorio; se omite en tableta y celular. El adaptador experimental de cámara con motor simulado se omite en celular. Axe no detectó infracciones en los estados comprobados. La compilación informa un paquete principal de aproximadamente 686 kB, con la advertencia de tamaño indicada en Limitaciones.

Después del indicador visual de condición seleccionada se repitieron los 63 casos específicos y el zoom real: **64 correctos y 2 omisiones previstas**, sin fallos. Se repitieron también lint y compilación. Las 14 capturas para revisión se conservan en `docs/evidencias/reservas-investigacion/`: reservas en los cuatro temas y tres tamaños, formularios de personas y escenarios en los tres tamaños, y zoom real al 200 %. Ejemplos: [reservas en escritorio](../../evidencias/reservas-investigacion/reservas-desktop-claro.png), [persona en celular](../../evidencias/reservas-investigacion/persona-mobile-claro.png), [escenario en tableta](../../evidencias/reservas-investigacion/escenario-tablet-claro.png) y [zoom 200 %](../../evidencias/reservas-investigacion/reservas-zoom-200.png). Las capturas usan datos ficticios de las pruebas en un navegador aislado.

## Revisión manual

1. Ejecute `npm run dev` y abra la URL indicada por Vite. Entre en `#/lab`. Elija cada contexto y complete una reserva en buena práctica y antipatrón. Pruebe fecha pasada, campos vacíos, volver y cambiar condición sin perder datos. Confirme con doble clic: debe aparecer un único registro y permanecer visible el resultado.
2. Reprograme desde la lista: cambie fecha y hora, vuelva desde la revisión y confirme. Compruebe que cancelar la edición no cambia la reserva. Cancele una reserva, primero cierre el diálogo con Escape y luego confirme. Recargue y compruebe el estado y el historial.
3. Entre en `#/research`. Cree una persona sin edad y sin código de participante. Distinga observaciones de supuestos. Abra el mapa opcional, registre sus cuatro elementos y seleccione la fuente de las emociones. Guarde y consulte el perfil. Cambie de idioma durante una edición y compruebe que los textos siguen intactos.
4. Cree un escenario vinculado a la persona. Pruebe el ejemplo opcional y la validación del vínculo. Renombre la persona: el escenario debe conservar la relación. Intente eliminarla: se debe explicar por qué está protegida. Cree otra persona, reasigne el escenario y vuelva a intentar eliminar la primera; pruebe cancelar y confirmar el diálogo. Edite y elimine también el escenario.
5. Desde «Gestionar proyecto», descargue un respaldo con sus datos. Intente recuperar un JSON inválido y uno incompleto: nada debe cambiar. Recupere el respaldo válido, primero cancelando y después confirmando. Haga reset con un formulario abierto; deben desaparecer registros y borradores sin cargar ejemplos. Recargue y luego recupere el respaldo.
6. Repita el recorrido con Tab, Shift+Tab, Enter y Escape, en los seis idiomas y en claro, oscuro, alto contraste y oscuro con alto contraste. Revise escritorio, tableta y celular; use zoom real al 200 %. Compruebe foco al volver a un paso, errores junto al campo y anuncios de guardado, eliminación, cancelación y reprogramación.

## Limitaciones

Es un laboratorio local: no reserva citas reales ni coordina disponibilidad entre dispositivos o pestañas. Los datos guardados usan el almacenamiento del navegador; los borradores sin guardar no sobreviven a navegación, recarga, reset o recuperación. Los vínculos antiguos ausentes o ambiguos se conservan para reparación explícita, no se adivinan ni se descartan. La compatibilidad se comprobó al recuperar respaldos anteriores en esta versión; versiones antiguas de la aplicación pueden rechazar los campos nuevos.

Las pruebas de tamaños usan emulación de Chromium. La revisión con lector de pantalla y dispositivos físicos queda como comprobación manual. La compilación conserva la advertencia de Vite sobre el paquete principal mayor de 500 kB; optimizarlo corresponde a una revisión separada.
