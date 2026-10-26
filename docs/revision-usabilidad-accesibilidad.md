# Revisión de usabilidad y accesibilidad

## Secciones desplegables y tipografía común

Las páginas públicas y las pantallas de cuenta y comunidad comparten tarjetas con cabecera verde, título blanco y foco visible. `DisclosureCard` expone `aria-expanded`, `aria-controls` y una región identificada; `ExpandableCard` conserva sus controles montados al plegarse para no borrar textos. El bloque principal de cada tarea comienza abierto y los contenidos complementarios se consultan al desplegarlos.

En Laboratorio, Reservas y Usuarios están dentro del contenido, después del encabezado, mediante `LabSections`. Crear una reserva o un usuario despliega el formulario directamente. Plegar un formulario con cambios solicita resolver el borrador; el historial guardado permanece independiente. Los usuarios ficticios siguen separados de las cuentas reales.

La escala compartida usa una sola familia de fuentes: texto de 1 rem, h4 de 1.0625 rem, h3 de 1.125 rem, h2 de 1.4 rem y h1 adaptable entre 1.9 y 2.65 rem. Las tarjetas anidadas del laboratorio mantienen la secuencia h2 → h3 → h4. El contexto superior usa 1 rem. Seguimiento de página y los demás controles superiores comparten familia, tamaño y peso; el nombre del laboratorio y el subtítulo permanecen legibles en móvil. Las preferencias de tamaño, espaciado y dislexia siguen aplicándose.

El contraste calculado de los títulos blancos sobre las cabeceras verdes es 6.42:1, y 8.51:1 al abrirlas o pasar el puntero. Esto verifica esas combinaciones concretas. La revisión manual con lector de pantalla ya se realizó; queda un ajuste técnico puntual del lector. Para revisar tarjetas: recorrerlas con Tab, abrir con Enter o Espacio, editar un borrador y comprobar que plegarlo o cambiar de módulo permite conservarlo antes de descartar.

El recorrido simulado de seguimiento de página utiliza el área visible del contenido, descontando la parte cubierta por la cabecera fija. Las auditorías automatizadas despliegan los contenidos complementarios para incluirlos en la revisión de accesibilidad.

Verificación de esta revisión (2026-10-26): lint y compilación correctos; 45 archivos y 311 pruebas unitarias aprobadas. La regresión completa del frontend en escritorio ejecutó 201 casos: 200 aprobaron y uno conservaba un selector h3 anterior a la nueva jerarquía. Tras actualizarlo a h4, aprobaron los siete casos de Usuarios, incluido búsqueda, filtros y ordenación. También aprobaron nueve pruebas de tarjetas, navegación, conservación de borradores y tipografía en escritorio, tableta y móvil, y cinco repeticiones del recorrido de seguimiento corregido. La regresión incluyó zoom real al 200%, los seis idiomas y auditorías axe en los cuatro temas.

Revisión de la integración de cuentas, sincronización, grupos, seguimiento, sugerencias, informes e integración entre servicios sobre el frontend 2.5.0. Las heurísticas de Nielsen son criterios de inspección, no una certificación de conformidad. Se contrastó la interfaz y sus estados con el código y las pruebas disponibles.

| Heurística | Evidencia en la interfaz integrada | Resultado y límite |
|---|---|---|
| 1. Visibilidad del estado | Cuenta, sincronización y pantallas remotas anuncian carga, resultado, error y conflicto con `status` o `alert`; `/eventos` muestra disponibilidad, contadores y cola de fallos. | Implementado y cubierto por pruebas de componentes; la latencia o caída real depende del backend local. |
| 2. Relación con el lenguaje del usuario | Etiquetas describen cuenta, actividad, entrega, grupo y evidencia; los errores de Informes se traducen a mensajes con acciones de recuperación. | Revisado manualmente con recorridos de estudiante y docente. |
| 3. Control y libertad | Se conserva el laboratorio público y local, se puede cerrar sesión, cancelar antes de confirmar el envío y volver a intentar una operación fallida. | Verificado para los flujos incluidos; borrar o cancelar en local no elimina registros ya sincronizados. |
| 4. Consistencia y estándares | Formularios, botones, paneles, foco visible, tamaños de objetivo y estados comparten estilos; la navegación conserva el enlace para saltar al contenido. | Verificado con compilación, lint y E2E disponibles. |
| 5. Prevención de errores | Confirmación explícita de sincronización, validación de campos, confirmación de contraseña, protección CSRF, permisos servidor y control de versión previenen envíos inválidos o ajenos. | Verificado por pruebas y recorridos manuales con tareas de estudiante/docente. |
| 6. Reconocimiento frente al recuerdo | Campos tienen etiquetas visibles, estados en contexto, versiones de actividad/instrumento/fórmula, ayuda de teclado y referencias legibles para integrantes. | Revisado; algunos identificadores de evidencia de informes aún son técnicos. |
| 7. Flexibilidad y eficiencia | Tab/Shift+Tab, Enter, Space y Escape usan comportamiento nativo; el menú móvil confina el foco, Escape lo cierra y devuelve el foco; actualizar y reintentar evitan rehacer formularios. | Código y E2E revisados. No se añadieron combinaciones globales propias porque pueden interferir con tecnologías asistivas. |
| 8. Diseño minimalista | Cuenta abre inicio de sesión y mantiene recuperación/registro colapsados; formularios adicionales aparecen al seleccionarlos. Grupos, seguimiento e informes se separan por tareas. | Revisado en recorridos manuales de estudiante y docente. |
| 9. Ayuda para reconocer y recuperarse de errores | Los errores conservan códigos estables internamente; Informes muestra texto traducido y una acción para recuperarse. La referencia de solicitud aparece separada cuando existe. | Verificado por pruebas dirigidas y revisión de los flujos. |
| 10. Ayuda y documentación | La ayuda persistente de teclado explica navegación, activación y cierre; la documentación cubre SMTP local, registro, sincronización y límites conocidos. | Verificado en código y documentación; las instrucciones se deben validar con personas usuarias. |

Las nuevas traducciones cubren español, inglés, portugués, francés, italiano y catalán. Las pantallas usan encabezados jerárquicos, nombres accesibles, etiquetas explícitas, regiones anunciables y foco visible. Las pruebas E2E de Comunidad abarcan escritorio, tableta y móvil y reportaron cero violaciones de axe. Axe no detecta todos los problemas de comprensión, foco o pronunciación.

La ayuda de teclado documenta **Tab / Shift+Tab**, **Enter**, **Space** y **Esc**. No hay atajos globales personalizados; no se interceptan teclas de escritura. Los controles de formularios deben poder recorrerse con teclado en orden visual y lógico.

Revisión manual completada por el equipo: se recorrieron los flujos autenticados y las tareas de estudiante/docente, incluyendo formularios, estados y errores con lector de pantalla. Queda una deuda técnica: un ajuste puntual del lector de pantalla. Este documento no acredita una auditoría completa WCAG.
