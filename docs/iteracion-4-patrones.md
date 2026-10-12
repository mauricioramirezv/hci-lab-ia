# Iteración 4: Patrones y antipatrones

Se conservan los seis patrones del catálogo anterior y sus recomendaciones útiles. Cada uno corresponde a una categoría: formularios y validación, navegación y orientación, estado y retroalimentación, decisiones y engagement ético, contenido y legibilidad, y privacidad y consentimiento. Las tarjetas explican el problema, el contexto, ambas condiciones, la heurística de Nielsen, su relación y una mejora concreta. Categoría y búsqueda se combinan; la búsqueda ignora mayúsculas y tildes.

## Ejemplos propios

| Patrón | Comportamiento funcional | Antipatrón aislado |
| --- | --- | --- |
| Formulario | Validar una solicitud de soporte y corregir el correo conservando la descripción | Etiquetas visuales sustituidas por placeholders y error genérico |
| Navegación | Recorrer Ayuda → Facturación → Facturas, identificar la ubicación y regresar | Destinos visuales ambiguos, enlaces duplicados y ausencia de migas de pan |
| Retroalimentación | Preparar una constancia en tres etapas, confirmar y cancelar | Progreso silencioso y confirmación fugaz en la muestra |
| Decisiones | Comparar capacidad y coste anual de planes ficticios, elegir, continuar y cancelar | Plan preseleccionado, presión ficticia y cancelación oculta en la muestra |
| Contenido | Buscar una política y comprobar su plazo para cambios | Información en un bloque denso en mayúsculas |
| Privacidad | Guardar un favorito aceptando o rechazando permisos opcionales | Permisos preseleccionados y consentimiento presentado como un bloque |

Solo se abre un ejemplo. Cambiar de condición, reiniciarlo o volver detiene su actividad y descarta las elecciones o el progreso del ejemplo; conserva los textos escritos durante la visita. El reset global también vacía esos borradores. Las tareas no reutilizan el demostrador de Conceptos. Los estilos de las malas prácticas se limitan a la muestra, bajo `.pattern-module`; los controles reales conservan nombres accesibles, foco, cancelación y mensajes persistentes del laboratorio. La tabla comparativa dispone de una región con nombre y foco visible; si desborda en celular, se puede desplazar con las flechas del teclado.

## Evidencia y compatibilidad

El estudiante escribe el problema identificado, el principio afectado y la corrección propuesta. El alias es opcional y editable; se reutiliza el último disponible. La evidencia conserva los textos originales, el identificador estable del patrón y la condición. No calcula tiempos, errores, puntuaciones ni conclusiones. Una confirmación accesible comunica el guardado y se evita duplicar exactamente la misma observación.

Informes incluye una sección traducida para consultar y eliminar estas observaciones. Su filtro también busca en los tres textos y en el nombre traducido del patrón. Markdown conserva los tres campos; CSV conserva las nueve columnas anteriores y añade tres para esos campos. Las observaciones quedan fuera de las comparaciones numéricas.

El respaldo versión 2 incorpora los nuevos registros; su validador exige un patrón conocido, condición válida y estructura completa antes de reemplazar datos. Se conserva la importación de los respaldos anteriores. El reset existente elimina la evidencia y detiene las preparaciones pendientes. Los otros módulos mantienen su funcionamiento y sus datos.

Todo el módulo y su panel de evidencia están traducidos a español, inglés, portugués, francés, italiano y catalán. Cambiar de idioma conserva los textos del usuario. La traducción del resto de Informes permanece fuera de esta iteración.

## Verificación

Comandos: `npm run lint`, `npm test`, `npm run build` y `npm run test:e2e -- --workers=4`.

Resultados finales: lint y compilación correctos; **56 pruebas unitarias correctas**. La suite completa terminó con **177 pruebas E2E correctas y 3 omisiones previstas**: el zoom mediante extensión se ejecuta solo en escritorio y el adaptador experimental de cámara se omite en la emulación móvil. Después del ajuste final del contador en los seis idiomas, se repitieron los 39 casos de Patrones y el zoom real: **40 correctos y 2 omisiones previstas**. No quedan fallos de pruebas. Axe no detectó infracciones en el módulo ni en su panel de evidencia en los estados comprobados.

Las pruebas específicas cubren las seis categorías y sus dos condiciones en los seis idiomas, con escritorio, tableta y celular. Comprueban búsqueda sin tildes, filtros, validación y conservación de datos, ubicación y regreso, cancelación de tareas pendientes, comparación y cancelación, búsqueda de contenido, consentimiento opcional, reinicio, observaciones, consulta en Informes, Markdown, CSV, respaldo, recuperación y reset con recarga. La estructura incompleta de una observación se rechaza sin reemplazar el proyecto. También se comprueba la reutilización y edición del alias opcional.

Axe examina el catálogo y cada ejemplo antes y después de actuar, en ambas condiciones y en los cuatro temas existentes. También examina la evidencia expandida en los seis idiomas. La suite conserva las comprobaciones de todas las rutas, menú móvil, foco de ruta y zoom real de Chromium al 200 %. El recorrido de teclado del módulo se repitió tres veces en las tres resoluciones para comprobar la estabilidad del foco. La tabla desplazable acepta foco y desplazamiento horizontal con flechas.

Cambiar de condición o reiniciar enfoca una sola vez el título del ejemplo. Navegar entre las páginas de la muestra enfoca la nueva ubicación. Volver al catálogo recupera el foco en su tarjeta.

## Revisión manual

1. Ejecute `npm run dev` y abra la URL indicada por Vite, ruta `#/practices`. Explore las seis categorías, combine filtros y búsqueda; pruebe «NAVEGACION» sin tilde.
2. Abra cada ejemplo y pruebe ambas condiciones. En Formulario, conserve una descripción mientras corrige un correo inválido. En Navegación, avance hasta Facturas y regrese. En Retroalimentación, cancele antes de terminar. En Decisiones, compare, continúe y cancele. En Contenido, localice la política de cambios. En Privacidad, pruebe aceptar permisos seleccionados y rechazarlos todos.
3. Cambie la condición y reinicie. Compruebe el aviso y que sus textos permanezcan. Use Tab, Shift+Tab, Enter y las teclas de los controles nativos; compruebe el foco al abrir, cambiar condición, volver y seguir el enlace a Informes.
4. Escriba problema, principio y corrección, dejando el alias vacío. Guarde, consulte la evidencia en Informes y descargue Markdown y CSV. Cambie a cada idioma y compruebe que sus textos siguen intactos.
5. En «Gestionar proyecto», descargue un respaldo; cancele un reset y compruebe que nada se borró. Después confirme el reset, recargue y compruebe que el proyecto está vacío. Recupere el respaldo y compruebe sus observaciones. Un archivo incompleto debe rechazarse sin cambios.
6. Revise escritorio, tableta y celular, temas claro, oscuro y alto contraste; use también zoom real del navegador al 200 %. Las capturas de esta iteración se guardan en `docs/iteracion-4-capturas/`.

Capturas para comparar: [escritorio claro](iteracion-4-capturas/catalogo-escritorio-claro.png), [oscuro](iteracion-4-capturas/catalogo-escritorio-oscuro.png), [alto contraste](iteracion-4-capturas/catalogo-escritorio-contraste.png), [oscuro con alto contraste](iteracion-4-capturas/catalogo-escritorio-oscuro-contraste.png), [tableta](iteracion-4-capturas/catalogo-tableta.png), [celular](iteracion-4-capturas/catalogo-celular.png), [ejemplo de decisiones en celular](iteracion-4-capturas/decisiones-celular.png), [evidencia en Informes](iteracion-4-capturas/evidencia-informes.png) y [zoom real al 200 %](iteracion-4-capturas/zoom-200-patrones.png).

## Límites

- Los ejemplos son demostraciones locales: no envían correos, contratan planes ni solicitan permisos reales. Las demoras de la constancia son simuladas y se identifican como tales.
- Los borradores no guardados se conservan durante la visita al módulo, pero no se incluyen en el respaldo ni sobreviven a una recarga o cambio de ruta. La ayuda de gestión ya distingue actividades sin guardar de registros persistentes.
- Axe y las comprobaciones automáticas de foco no sustituyen una evaluación con lector de pantalla y personas usuarias.
- Vite mantiene su advertencia sobre el tamaño del paquete principal; dividir módulos para optimizar la carga queda fuera de esta iteración.

## Archivos

El catálogo y sus componentes, textos y estilos residen en `src/enhancements/Patterns.tsx` y `src/enhancements/patterns/`. La integración imprescindible de evidencia afecta `src/enhancements/model.ts`, `src/projectBackup.ts`, `src/i18n.ts`, `src/enhancements/Reports.tsx` y `src/enhancements/reportModel.ts`. Se añaden pruebas unitarias y E2E de Patrones y se amplía la comprobación existente de zoom real.
