# Iteración 3: Conceptos

El módulo reúne once conceptos en las cuatro temáticas solicitadas. El catálogo permite combinar temática y búsqueda sin distinguir tildes; cada tarjeta explica el concepto y el aprendizaje antes de abrir una actividad. Se conserva la interfaz común y la gestión del proyecto de las iteraciones anteriores.

## Actividades

Solo hay una actividad abierta. El recorrido tiene instrucciones, prueba y resultado, con foco en la etapa correspondiente. Buena práctica y antipatrón se pueden cambiar durante cualquier etapa: se detiene la actividad y se reinician sus contadores y resultados sin guardar. El aviso explica que se conservan los textos escritos y los registros guardados.

| Concepto | Actividad propia | Problema representado en el antipatrón |
| --- | --- | --- |
| UX | Continuar un itinerario de escritorio a celular | Pérdida del destino al cambiar de dispositivo |
| Usabilidad | Elegir una visita sin renovación | Nombres de planes que ocultan precio y modalidad |
| Accesibilidad | Interpretar un estado con la información disponible | Color sin texto ni leyenda equivalente |
| Awareness | Guardar una nota y reconocer la confirmación | Ausencia de información sobre el resultado |
| Engagement ético | Elegir libremente avisos opcionales | Presión mediante una racha ficticia |
| Emociones | Corregir un cupón y declarar valoraciones opcionales | Mensaje que culpa sin orientar la recuperación |
| Ergonomía | Ajustar tamaño y separación de un esquema | Objetivos representados pequeños y próximos |
| Cognición | Preparar un kit con una lista de referencia | Lista oculta que exige recordar o consultar de nuevo |
| Arquitectura de información | Encontrar audiolibros por categorías | Nombres de áreas y elementos que no describen contenido |
| Diseño universal | Adaptar canales a dos contextos de uso | Una sola alternativa de audio |
| IA responsable | Revisar una propuesta y justificar aceptar, editar o rechazar | Propuesta sin evidencia ni límites visibles |

Los problemas son muestras didácticas. Los controles reales mantienen etiquetas, tamaño y navegación por teclado en las dos condiciones. Los estilos se limitan a `.concept-module`; el catálogo de Patrones y antipatrones y su demostrador anterior permanecen sin cambios.

## Resultados y persistencia

- El tiempo se mide con `performance.now()` desde iniciar hasta terminar o cancelar. Las interacciones cuentan activaciones y cambios de controles de la prueba; escribir, mover el foco y utilizar controles del laboratorio quedan fuera.
- Los errores cuentan intentos explícitos que incumplen la regla indicada. Explorar categorías no es un error. Las decisiones de engagement e IA responsable no reciben una clasificación automática de error.
- Emoción y confianza son autoinformes opcionales sin valor predeterminado. No se infieren desde el tiempo, los errores, la cámara ni otros sensores.
- Un resultado cancelado se identifica como parcial. Guardar confirma la operación y evita duplicar el mismo resultado. Repetir permite generar otro registro.
- El alias es opcional. Los textos y respuestas escritas se guardan sin traducir. Los títulos y condiciones se muestran en el idioma seleccionado.
- Las observaciones también pueden guardarse como hallazgos humanos pendientes de validación y consultarse en Evaluación. No se generan conclusiones automáticas a partir de los contadores.
- La evidencia usa la colección existente, con metadatos opcionales `concept` que incluyen identificador estable, resultado y respuesta escrita. El respaldo y la recuperación validan esos campos; los respaldos anteriores siguen siendo compatibles.
- El reset global borra evidencia y hallazgos, descarta borradores y cancela el temporizador del guardado simulado. El proyecto sigue vacío al recargar.
- Los borradores sin guardar son locales al módulo: volver al catálogo los conserva; salir del módulo, recargar o restablecer el proyecto los descarta. Los registros guardados se conservan hasta el restablecimiento o el reemplazo confirmado del proyecto.

El diagnóstico heurístico incluye situación, pregunta, respuesta seleccionable y botón **Comprobar**. Se explican tanto la respuesta como la corrección; **Volver a intentar** devuelve el foco al selector.

## Idiomas y archivos

El módulo completo tiene diccionarios independientes para español colombiano, inglés estadounidense, portugués brasileño, francés, italiano y catalán: catálogo, instrucciones, muestras, controles, errores, autoinformes, resultados, evidencia y diagnóstico.

La implementación está en `src/enhancements/Concepts.tsx` y `src/enhancements/concepts/`. La integración compartida se limita al registro de esos diccionarios en `src/i18n.ts` y los campos opcionales de evidencia en `src/enhancements/model.ts` y `src/projectBackup.ts`. Las pruebas anteriores de Conceptos se adaptan al nuevo recorrido y se añaden pruebas específicas unitarias y E2E. No se modifican rutas, datos existentes ni otros módulos.

## Verificación final

- `npm run lint`: aprobado, sin advertencias de ESLint.
- `npm test`: 47 pruebas aprobadas en ocho archivos, incluidas diez específicas de Conceptos.
- `npm run build`: aprobado. Vite advierte que el paquete principal supera 500 kB (557,82 kB; 176,19 kB comprimido).
- `npm run test:e2e -- --workers=4 --output=test-results-iteration-3-final`: 138 aprobadas, cero fallos y tres omisiones previstas. Las omisiones pertenecen a la configuración anterior: zoom real solo en escritorio y calibración prolongada excluida en celular.
- Las 42 pruebas E2E nuevas de Conceptos pasan en los tres tamaños. Se completan y guardan las once actividades en ambas condiciones en los seis idiomas, con comprobación de los contadores reales de cada recorrido y de la persistencia tras recargar.
- Se prueban filtros y búsqueda, cambio de condición, conservación de textos, cancelación, repetición, guardado, respaldo y recuperación, diagnóstico con explicación y reintento, y reset global mientras hay una operación pendiente.
- Axe no encuentra infracciones en el catálogo y las once actividades en ambas condiciones, en claro, oscuro, alto contraste claro y alto contraste oscuro; también se comprueban resultados y evidencia guardada. La suite anterior vuelve a comprobar las 18 rutas.
- Se verifica un recorrido con Tab y Enter, foco visible, foco al cambiar de etapa y volver, el menú móvil existente, texto ampliado y zoom real de Chromium al 200 % con una actividad abierta. Se revisan capturas de escritorio, tableta y celular.

## Revisión manual

1. Ejecute `npm run dev` y abra la dirección de Vite con `/hci-lab-ia/#/concepts`.
2. Combine temática y búsqueda, escriba `COGNICION`, pruebe una búsqueda sin coincidencias y limpie los filtros. Abra las once actividades, una por una.
3. En cada actividad, lea la regla, pruebe ambas condiciones y termine la tarea. Cambie de condición durante una prueba; revise el aviso y el reinicio. Cancele una prueba y repítala.
4. En Emociones pruebe un cupón incorrecto y luego `CALMA`; deje los autoinformes vacíos una vez y selecciónelos en otra prueba. Compruebe que solo las valoraciones declaradas se guardan.
5. Escriba alias y observación si lo desea, guarde resultados y consulte evidencia. Guarde una observación como hallazgo y revise Evaluación. Cambie entre los seis idiomas y compruebe que sus textos no cambian.
6. Responda el diagnóstico y pulse **Comprobar**; revise una respuesta incorrecta, la explicación y la corrección. Use **Volver a intentar**.
7. Use Tab, Mayús+Tab, Enter, flechas y Escape; revise el foco al iniciar, terminar, repetir, consultar evidencia y volver al catálogo. Pruebe celular, tableta, temas claro/oscuro/alto contraste y zoom del navegador al 200 %.
8. Descargue un respaldo desde **Gestionar proyecto**, restablezca y recargue. Compruebe evidencia y formularios vacíos. Recupere el respaldo y compruebe sus resultados y textos.

## Límites

Las actividades son ejercicios didácticos: el guardado de Awareness tiene una demora simulada, el cambio de dispositivo de UX ocurre dentro del ejercicio y las propuestas de IA no se ejecutan. No se mide rendimiento de servidores, postura, precisión táctil ni emociones automáticamente. Las traducciones se comprueban funcionalmente; su revisión editorial por hablantes nativos sigue siendo recomendable.

La comprobación de navegador se realiza con Chromium en escritorio y tamaños de tableta/celular. El zoom real al 200 % usa una extensión de Chromium de escritorio. No se ejecutaron Safari, Firefox ni un lector de pantalla real. La compilación advierte que el paquete principal supera 500 kB; esto no impide compilar, pero la división del paquete queda pendiente.

## Capturas

- [Catálogo en escritorio](iteracion-3-capturas/catalogo-escritorio.png).
- [Catálogo en celular](iteracion-3-capturas/catalogo-celular.png).
- [Actividad en tableta con alto contraste oscuro](iteracion-3-capturas/actividad-tableta-alto-contraste.png).
- [Resultado y evidencia con tema oscuro](iteracion-3-capturas/evidencia-oscura.png).
- [Actividad con zoom real al 200 %](iteracion-3-capturas/zoom-200-conceptos.png).

No se publica ni se hace push a GitHub. No se avanza a otro módulo.
