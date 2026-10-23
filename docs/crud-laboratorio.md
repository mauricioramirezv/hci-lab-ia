# CRUD del Laboratorio

## Patrón común

Crear abre un formulario independiente con título de creación. Ver detalle presenta el registro sin campos editables. Editar abre un borrador del registro; Guardar persiste antes de confirmar y Cancelar o Volver no modifican el original. Los campos obligatorios se marcan con `*` y semántica de obligatoriedad. Los errores permanecen junto a sus campos y conservan lo escrito.

Los formularios comparten `Field`, `FormActions`, `RequiredFields`, `Confirmation` y `useDraftGuard`. No comparten un motor de CRUD: las validaciones, relaciones y operaciones permanecen en cada dominio. La presentación de Reservas conserva los pasos de selección, fecha/hora y revisión; Guardar aparece en el último paso.

Un borrador distinto de su valor inicial requiere confirmación antes de Cancelar, Volver o seguir un enlace a otra ruta. Seguir editando y Escape conservan el borrador y devuelven el foco al control que abrió el aviso. Para atrás/adelante del navegador se usa su confirmación nativa; la recarga y el cierre usan `beforeunload`, cuyo texto lo decide el navegador. Reset y recuperación conservan su confirmación propia y desmontan los borradores pendientes.

El éxito recibe foco y se anuncia después de persistir. Un fallo conserva datos y borrador, informa del problema y permite reintentar. Cancelar un diálogo devuelve el foco al control de apertura. Eliminar deja el foco en el anuncio del resultado porque la fila original ya no existe.

## Revisión por módulo

| CRUD | Flujo y comprobación manual | Diferencias conservadas |
| --- | --- | --- |
| Reservas (`/lab`) | Crear reserva → completar pasos → Guardar. Ver detalle → Volver → Editar. Cambiar fecha, cancelar, seguir editando y finalmente salir sin guardar. Cancelar una reserva y comprobar que sigue en la lista como cancelada. | La edición reprograma una reserva confirmada. Cancelar conserva el registro y lo vuelve no editable; no es una eliminación ni ofrece deshacer. Se conservan las políticas de fechas y de ejemplos antiguos. |
| Usuarios (`/lab/users`) | Crear → Ver detalle → Editar; cancelar un cambio de nombre. Probar correo inválido/duplicado, desactivar, eliminar con confirmación y deshacer. | Desactivar mantiene identidad y datos y permite reactivar. Eliminar retira el registro; deshacer restaura la última eliminación durante la visita, si no hay conflicto. Los registros son ficticios y no otorgan permisos. |
| Personas (`/research`) | Crear persona con procedencia y datos obligatorios → Ver detalle → Editar. Intentar borrar una persona vinculada. Reasignar o eliminar sus escenarios antes de borrar la persona. | El nombre distingue personas; la procedencia y las emociones conservan su validación propia. Renombrar actualiza vínculos vigentes sin reescribir las evidencias históricas. No se añaden fechas a los datos antiguos. |
| Escenarios (`/research`) | Crear escenario → seleccionar persona → guardar. Editar tarea y cancelar. Intentar guardar un escenario idéntico y uno con otra tarea. | La persona debe existir. Se rechaza un duplicado completo de título, contexto, tarea, restricción y éxito para la misma persona, ignorando mayúsculas y espacios exteriores; se permite otra tarea. Los vínculos antiguos ambiguos requieren reparación explícita. |
| Hallazgos (`/evaluation`) | Crear hallazgo → completar tarea, problema, ubicación y recomendación → guardar. Ver detalle → Editar; comprobar identidad, fecha, procedencia y revisión. Cancelar y confirmar una eliminación. | Se conservan gravedad, procedencia humana/IA y estados de revisión. Se rechaza repetir tarea, heurística, problema y ubicación para la misma procedencia; humano e IA pueden aportar observaciones comparables. No se inventa una puntuación global ni se añade deshacer. |

En los cinco módulos: probar Guardar dos veces, un error de validación, fallo de almacenamiento con reintento, recarga, respaldo, reset y recuperación. Cambiar los seis idiomas con un borrador escrito y comprobar que el texto se conserva. Revisar teclado, foco, tema, móvil y ampliación.

## Datos, evidencias y compatibilidad

Se conserva un único `ProjectState`, sus claves de almacenamiento y versiones de datos y respaldo. Las operaciones leen el agregado vigente, preservan las demás colecciones y rechazan callbacks anteriores a reset/recuperación. Las escrituras repetidas no crean registros adicionales; Usuarios tampoco registra evidencia adicional por un estado o edición sin cambios. Las pantallas de investigación y hallazgos bloquean el segundo envío tras un guardado correcto.

Editar conserva identificadores y las fechas que ya existen en el formato. Personas y escenarios no incorporan una fecha nueva. Las colecciones de mediciones, sesiones y evidencias históricas conservan sus identificadores, tareas y datos; editar o eliminar un registro no las reescribe ni las elimina en cascada. Los registros actuales de los informes reflejan el estado actual; las evidencias guardadas conservan su contexto anterior. Los respaldos antiguos sin usuarios siguen inicializando esa colección vacía.

## Pruebas y límites

Las pruebas nuevas están en `tests/unit/crudConsistency.test.ts` y `tests/e2e/crud-consistency.spec.ts`, con fixture compartido en `tests/fixtures/crudProject.ts`. Los recorridos anteriores conservan sus comprobaciones y actualizan los nombres de acciones, la apertura explícita de creación y la nueva confirmación de descarte.

```sh
npm run lint
npm test
node tests/tools/check-architecture.cjs
npm run build
npm run test:e2e -- tests/e2e/crud-consistency.spec.ts tests/e2e/project-activities.spec.ts tests/e2e/project-activities-integrity.spec.ts tests/e2e/users.spec.ts tests/e2e/reservations-persistence.spec.ts tests/e2e/evaluation.spec.ts tests/e2e/project-management.spec.ts tests/e2e/reports.spec.ts tests/e2e/module-persistence.spec.ts tests/e2e/core-flow.spec.ts tests/e2e/browser-zoom.spec.ts --workers=3
```

La revisión con lector de pantalla y dispositivos físicos sigue siendo manual. El aviso nativo de recarga depende de las políticas y de la interacción previa que exija cada navegador. No se añade sincronización entre pestañas ni un historial persistente de borradores. No se incorpora el panel de preferencias visuales.

## Resultado de verificación — 21 de octubre de 2026

| Comprobación | Resultado |
| --- | --- |
| Lint y compilación | Correctos. Se conserva la advertencia de paquete JavaScript superior a 500 kB. |
| Unitarias e integración | 201 pruebas correctas en 30 archivos; incluyen 16 regresiones nuevas de consistencia. |
| E2E pertinentes | 259 correctos de 261 casos, en escritorio, tableta y móvil. |
| Comprobación tras el ajuste final de acciones | 34 E2E correctos y las tres pruebas de integración de la aplicación correctas; son repeticiones del conjunto anterior, no casos adicionales. |
| Axe, idiomas y presentación | Sin infracciones en los estados comprobados; seis idiomas, temas, contenido al 200% y zoom real de Chromium de escritorio correctos. |
| Dependencias | 233 módulos analizados, sin ciclos ni infracciones de capas; ninguna dependencia nueva. |
| Datos e historial de tareas | Identidades y fechas existentes, vínculos, fallos/reintentos, recarga, reset, respaldos antiguos, recuperación, informes y mediciones comprobados. |
| Git | Cambios anteriores conservados; ningún archivo eliminado. Resultados, reportes y herramientas locales ignorados y sin seguimiento. Sin commit, push ni publicación. |

Las dos omisiones son las previstas en la prueba de zoom real: la extensión requiere el perfil de escritorio y no se ejecuta en los perfiles tableta/móvil. Ambos perfiles sí ejecutaron las pruebas de contenido ampliado, disposición y axe. No se ejecutaron los E2E de módulos ajenos a la selección anterior, Selenium ni Katalon. La revisión manual pendiente es la indicada en la matriz por módulo y, especialmente, lector de pantalla, dispositivos físicos y navegadores distintos de Chromium.
