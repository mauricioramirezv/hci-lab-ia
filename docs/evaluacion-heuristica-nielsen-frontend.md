# Evaluación heurística de Nielsen del frontend

**Fecha:** 2026-10-26
**Alcance:** las 26 rutas del frontend, renderizadas en Chromium de escritorio con el estado público/predeterminado. Se inspeccionaron además componentes y pruebas relacionados con carga, formularios, navegación, integración y accesibilidad.

## Evidencia y límites

- Las 26 rutas renderizaron un encabezado principal y no produjeron errores JavaScript durante el recorrido.
- Axe, con reglas WCAG 2.0 A/AA, WCAG 2.1 A/AA y WCAG 2.2 AA, reportó **cero infracciones en las 26 rutas**.
- Esto es evidencia automatizada de accesibilidad y una inspección heurística del producto; no demuestra conformidad completa con WCAG ni sustituye pruebas con personas.
- La pasada axe cubrió escritorio y el estado anónimo/predeterminado. La revisión manual de estados autenticados, recorridos de estudiante/docente y lectura con lector de pantalla fue realizada por el equipo; esa evidencia no forma parte del barrido automatizado descrito arriba.
- En esta evaluación no se repitieron las suites unitarias ni E2E. Las pruebas existentes se consideran evidencia previa, no ejecución de hoy.
- Queda una deuda técnica: un ajuste puntual relacionado con el lector de pantalla. Los recorridos manuales con lector y usuarios ya se realizaron.

## Resultado por heurística

| N.º | Heurística | Evaluación | Hallazgo o evidencia |
|---:|---|---|---|
| 1 | Visibilidad del estado del sistema | Adecuada, con verificación automatizada | Las rutas cargan sin errores de ejecución; las pruebas existentes cubren estados de carga, error, reintento y sincronización. No se simularon fallos de red en los 26 recorridos de hoy. |
| 2 | Relación entre el sistema y el mundo real | Adecuada tras corrección | Informes traduce fallos a mensajes de usuario y acciones de recuperación. Comunidad muestra una referencia legible del integrante o el alias que aporte el contrato, sin presentar el ID de cuenta. |
| 3 | Control y libertad del usuario | Adecuada por inspección y pruebas existentes | El laboratorio local sigue disponible sin cuenta; los flujos de cuenta y sincronización incluyen cancelar, volver o reintentar. El usuario debe poder distinguir una copia local de una ya sincronizada. |
| 4 | Consistencia y estándares | Adecuada por inspección | Se reutilizan navegación, controles, tarjetas desplegables, encabezados, foco visible y comportamiento nativo de teclado. No se detectaron errores de ejecución entre rutas. |
| 5 | Prevención de errores | Adecuada por inspección y pruebas existentes | Hay validación de formularios y confirmación antes de sincronizar o ejecutar acciones sensibles; permisos y protección de escrituras también se validan en servidor. La inspección axe no evalúa por sí sola estos flujos. |
| 6 | Reconocimiento antes que recuerdo | Adecuada tras corrección | Etiquetas, selección y estados aparecen en contexto. La lista de Comunidad usa referencias legibles para distinguir integrantes; si el contrato aporta un alias autorizado, se prioriza sobre la referencia ordinal. |
| 7 | Flexibilidad y eficiencia de uso | Adecuada para teclado estándar | Se mantiene Tab/Shift+Tab, Enter, Espacio y Escape, y la ayuda de teclado los explica. No se encontraron atajos globales propios; esto no constituye por sí solo una infracción. |
| 8 | Estética y diseño minimalista | Adecuada, evaluada en recorridos manuales | La navegación agrupa secciones y los formularios secundarios se despliegan bajo demanda. El equipo recorrió tareas de estudiante y docente; no se reportó una deuda de densidad visual. |
| 9 | Reconocer, diagnosticar y recuperarse de errores | Adecuada tras corrección | Informes traduce errores conocidos a mensajes con una acción concreta. La referencia de solicitud, cuando existe, se presenta aparte del mensaje. |
| 10 | Ayuda y documentación | Parcialmente adecuada | Hay ayuda de teclado y documentación de flujos. Falta verificar que las ayudas contextuales sean suficientes para completar tareas en cada pantalla sin asistencia externa. |

## Hallazgos priorizados

1. **Informes — resuelto:** los errores técnicos ya no se muestran directamente; se clasifican y traducen, con recomendaciones de recuperación y referencia de soporte separada.
2. **Comunidad — resuelto en frontend:** se reemplazó el fragmento del ID por una referencia legible por grupo. Se prefiere un alias opcional del contrato cuando esté disponible; no se consulta Identidad ni se expone el ID en pantalla.
3. **Deuda técnica:** queda un ajuste pendiente del lector de pantalla. La revisión manual con lector y las tareas de estudiante/docente ya se realizaron.

## Conclusión

El frontend tiene una base consistente y accesible según el barrido automatizado de las 26 rutas y la revisión manual informada por el equipo. Se corrigieron las dos fricciones identificadas en Informes y Comunidad. Permanece una deuda técnica puntual relacionada con el lector de pantalla; no se declara conformidad completa con WCAG.
