# Integración opcional con el backend — iteraciones 9 y 10

El frontend 2.5.0 conserva su laboratorio local. `/cuenta` gestiona la sesión y `/sync` permite consultar o crear un espacio, seleccionar categorías, revisar el envío y confirmarlo. Consultar la sesión no crea una cuenta. Un visitante no tiene controles de sincronización ni realiza escrituras remotas.

## Estado vigente verificado — 26 de octubre de 2026

Esta sección sustituye las cifras preliminares de pruebas anteriores de este documento.

| Historia | Estado al corte |
|---|---|
| HU-02 Cuenta, verificación, sesión, recuperación y sincronización | Completa en entorno local con SMTP Mailpit: el registro pendiente repetido vuelve a emitir un token nuevo y los anteriores quedan invalidados. Se creó y verificó `admin@hci-lab.local`, y se probó su inicio de sesión por navegador. Gmail/Brevo externo no está configurado ni probado. |
| HU-03 Administración de cuentas y roles | Completa en API y pantalla: asignación autorizada, desactivación/revocación y transiciones explícitas de estado, con pruebas de no escalamiento. La política institucional de bloqueo automático no está definida. |
| HU-04 Trabajo, actividades y evaluaciones | Completa en Aprendizaje y sincronización explícita, con versiones, idempotencia y autorización por espacio. El recorrido E2E de navegador contra los cuatro servicios reales queda registrado como deuda técnica. |
| HU-05 Colaboración en grupos | Completa en Comunidad/API: grupos, membresías, invitaciones, espacios compartidos e historial con permisos locales. El aislamiento entre dos grupos se verificó en el flujo real de HU-06; completar todo el recorrido desde el navegador queda como deuda técnica. |
| HU-06 Seguimiento por docente/líder | Flujo real verificado contra Identidad, Comunidad y Aprendizaje con dos cuentas activas y dos grupos: invitación/membresía, asignación versionada, ejecución completada, entrega, revisión del líder y retroalimentación visible para el estudiante. Las consultas a recursos del grupo ajeno fueron denegadas (404). La pantalla ofrece acciones de entrega y revisión. |
| HU-07 Sugerencias | Completa en Comunidad: autoría protegida para anónimas, historial, moderación autorizada e idempotencia cubiertos por API/pruebas. |
| HU-08 Informes y procedencia | Completa para selección de evidencias, versiones/fórmulas y exportaciones JSON, Markdown y CSV. La navegación E2E conectada a datos reales forma parte de la deuda técnica de integración. PDF no está implementado. |
| HU-09 Seguimiento UX remoto | El consentimiento por finalidad y la minimización están implementados. Según la decisión de esta iteración, la retención automática es de al menos 30 días: Evidencias limpia al iniciar y cada 24 horas; el administrador puede configurar un plazo mayor mediante `EVIDENCE_RETENTION_DAYS`. |

| Regla / requisito | Estado |
|---|---|
| RN-02 Cuenta activa y autorizada | Cumple: cada escritura de trabajo valida sesión, estado y permiso en el servicio propietario; visitante permanece local. |
| RN-04 Roles globales separados de funciones de grupo | Cumple según la matriz de permisos aprobada: ser docente/líder no concede administración global; se deniega lo no asignado. |
| RN-05 Estados y transiciones | Cumple en código y pruebas: verificación activa la cuenta; admin no puede saltar `pending→active`; cambios inválidos se rechazan; desactivar revoca sesiones. El bloqueo automático requiere política institucional. |
| RN-09 Consentimiento, retención y eliminación | Cumple la decisión aprobada: mínimo 30 días, valor configurable solo hacia arriba, barrido automático al iniciar y diario ejecutado por el servicio Evidencias. |
| Requisitos de arquitectura, REST/OpenAPI, PostgreSQL, propiedad de datos, outbox/inbox, reintentos y concurrencia | Implementados y cubiertos por las suites backend; sin FK/consultas cruzadas ni transacciones distribuidas. IA/chatbots no tienen proveedor IA backend configurado; sus funciones locales no implican un servicio remoto. |

### Verificaciones ejecutadas

| Verificación | Resultado |
|---|---|
| Backend, PostgreSQL local con bases temporales de instalación/actualización | 137/137 pruebas pasaron, incluidas instalación y actualización desde datos existentes. |
| Backend lint, ESLint y límites de arquitectura | Pasaron. |
| Backend compilación | Los cuatro servicios compilaron. |
| Frontend unitarias | 319/319 pasaron, incluidas pruebas de envío y revisión de entregas. |
| Frontend lint y compilación | Pasaron. |
| Frontend regresión E2E completa | 600 pasaron, 3 omitidas por limitaciones/capacidades no aplicables del navegador, 0 fallidas (603 ejecuciones; escritorio, tableta y móvil). |
| Contenedores | PostgreSQL, Mailpit y los cuatro servicios saludables; Identidad se reconstruyó con el código probado. |
| Cuenta administradora local | `admin@hci-lab.local` verificada; inicio de sesión por API y navegador; cookie `HttpOnly`; pantalla y listado de administración accesibles. |

Las pruebas E2E de regresión del frontend sustituyen respuestas de API y no demuestran una navegación completa contra los cuatro servicios reales. HU-06 sí se probó por API real con dos cuentas/grupos y se comprobó el aislamiento. El E2E de navegador con los cuatro servicios reales y la validación auditiva manual con lector de pantalla quedan aceptados como deuda técnica, fuera del cierre de esta iteración. La IA remota se difiere a una versión posterior. No se desplegó ni se hizo commit, push o merge.

## Comportamiento y contratos

| Datos locales | Servicio y operación |
|---|---|
| Cuenta y perfil | Identidad: `/v1/accounts`, `/v1/sessions`, `/v1/accounts/me` y verificación/recuperación |
| Espacios | Aprendizaje: `/v1/workspaces` |
| Personas y escenarios | Aprendizaje: `/v1/workspaces/{id}/personas` y `/scenarios`; referencias locales se resuelven a UUID remotos |
| Conceptos, patrones, Fitts y Hick | Aprendizaje: catálogo localizado/versionado → `/v1/executions` → `/results`; resultados conservan la versión de actividad |
| Tareas, SUS/TLX y hallazgos | Aprendizaje: instrumentos y heurísticas versionados → sesiones de evaluación/respuestas/hallazgos; SUS/TLX se calculan en el servidor desde respuestas originales |
| Usuarios ficticios | Aprendizaje: `/v1/demo-users`; no son cuentas ni conceden roles |
| Reservas confirmadas | Comunidad: `/v1/reservations`; se mantienen reglas y conflictos del servidor |
| Verificaciones de accesibilidad | Evidencias: `/v1/workspaces/{id}/accessibility-checks/{code}` |
| Selección de informe | Evidencias: `/v1/reports`; referencias tipadas a registros confirmados, sin consultas directas entre bases |
| Agregados UX | Evidencias: `/v1/ux-sessions`; consentimiento separado y actividad remota propia seleccionada explícitamente |

El plan de envío es puro (`synchronization/domain`); el coordinador y sus puertos están en `application`; HTTP y almacenamiento están en `infrastructure`; la pantalla y sus estados están en `presentation`. Los contratos HTTP siguen las rutas `/v1` y los OpenAPI de cada servicio (`/openapi.json`). El catálogo se consulta con el idioma actual y paginación `limit/offset`; no se trunca silenciosamente al superar el límite de seguridad. Los formatos locales de 2.5.0 se vinculan únicamente a las versiones 1 compatibles de actividades, instrumentos y heurísticas; SUS requiere `SUS-5PT-1.0` y TLX requiere `RAW-TLX-MEAN-1.0`. Una versión futura exige revisar el adaptador: no se asigna automáticamente al trabajo histórico. Si falta una versión compatible, el registro permanece local.

Cada escritura vuelve a consultar la cuenta. Solo una cuenta con correo verificado y estado `active` puede iniciarla; el servidor conserva la autorización definitiva sobre cada recurso. Ser profesor o líder de grupo no habilita administración global. Al modificar cuentas, la interfaz preserva los roles de profesor/evaluador existentes.

La sesión viaja en cookie `HttpOnly` mediante `credentials: include`. Identidad devuelve además el valor anti-CSRF ligado a esa sesión en inicio de sesión y consulta del perfil. Este valor se mantiene en memoria y se envía en `X-CSRF-Token`; no es un token de acceso. No se persisten contraseñas, cookies de sesión ni tokens de acceso en `localStorage`. Identidad valida el origen y la vinculación de la cookie CSRF antes de devolver dicho valor. Sus respuestas de sesión y sus esquemas OpenAPI se ajustaron de forma aditiva; los enlaces de correo conservan la base de Pages y usan `/#/cuenta?verify=…` o `?reset=…`. El frontend retira el token del enlace al procesarlo.

## Reintentos, cambios e historial

El registro `hci-lab-ia-sync-v1:{cuenta}:{espacio}` conserva huellas de contenido, solicitudes pendientes, claves de idempotencia y confirmaciones. Se guarda antes de cada petición. Tras una caída o recarga, el reintento reutiliza la clave pendiente y omite los pasos confirmados. No hay reintentos automáticos de escrituras. Una revisión posterior utiliza otra clave, incluso cuando vuelve a un valor anterior. Los conflictos HTTP 409 y los cambios locales/de referencias detienen el envío y muestran una decisión explícita.

Los cambios confirmados en personas, escenarios, resultados, evaluaciones e informes generan nuevas copias. Las verificaciones de accesibilidad actualizan el estado actual del espacio conforme al contrato existente; no ofrecen historial inmutable. La pantalla explica esta diferencia antes de confirmar los cambios. Una reserva modificada se somete de nuevo a las reglas de duplicidad/disponibilidad del servidor. Un borrado o cancelación local no elimina ni cancela registros remotos automáticamente.

El formato del proyecto y sus respaldos v2 no cambia. El registro de sincronización queda fuera del respaldo; restaurar en otro navegador no recupera los vínculos remotos. Importe antes de sincronizar en un espacio nuevo para evitar duplicados. No edite el mismo proyecto desde varias pestañas: no se implementa coordinación ni fusión entre ellas. Cerrar sesión conserva el trabajo local; no lo convierte en almacenamiento privado para equipos compartidos.

## Configuración local en PowerShell

Requiere el backend hermano instalado y migrado según su documentación. No copie `.env.example` sobre un `.env` existente. En el `.env` del backend revise las siguientes entradas, manteniendo sus contraseñas y demás configuración:

```dotenv
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173
IDENTITY_WEB_BASE_URL=http://localhost:5173/hci-lab-ia/
IDENTIDAD_NODE_ENV=development
IDENTITY_COOKIE_SECURE=false
IDENTITY_COOKIE_SAME_SITE=lax
```

Los orígenes no incluyen rutas. Use el mismo nombre de host durante todo el recorrido. El frontend trae proxies locales `/api/identity`, `/api/learning`, `/api/community` y `/api/evidence` hacia los puertos 3001–3004, tanto en Vite dev como en preview. El proxy no sustituye ni omite la validación CORS del servidor.

Desde el frontend:

```powershell
npm ci
npm run dev
```

Abra `http://localhost:5173/hci-lab-ia/#/sync`. Para usar las fuentes actualizadas del backend con PostgreSQL ya iniciado, libere primero sus puertos si los ocupan contenedores de servicios. Desde el backend, en cuatro terminales separadas:

```powershell
npm run dev --workspace=@hci-ia-lab/identidad
npm run dev --workspace=@hci-ia-lab/aprendizaje
npm run dev --workspace=@hci-ia-lab/comunidad
npm run dev --workspace=@hci-ia-lab/evidencias
```

Son cuatro procesos persistentes, uno por terminal. No ejecute estas líneas consecutivamente en la misma terminal esperando que arranquen las cuatro. El correo de desarrollo se obtiene del adaptador local según la guía de Identidad; no se ha validado entrega SMTP real.

Pages sirve archivos estáticos y no ejecuta el proxy de Vite. Una instalación remota debe configurar los cuatro `VITE_*_API_URL` con rutas HTTPS de un gateway común que reciba la misma cookie de sesión, los orígenes exactos permitidos y cookies `Secure`. Si el frontend y el gateway son de sitios distintos, se necesita `SameSite=None` y comprobar las restricciones de cookies de terceros del navegador. No coloque secretos en `VITE_*`. No se publica ni se modifica el workflow de Pages en esta iteración.

## Revisión manual

1. Sin sesión, cree trabajo y una reserva local; exporte e importe un respaldo. En Red no debe haber POST/PUT/PATCH/DELETE a las API por estas acciones.
2. Abra **Cuenta** desde la barra superior: inicio de sesión está abierto; recuperación y registro se expanden al seleccionarlos. Registre una cuenta de prueba con nombre, apellido y confirmación de contraseña. En Docker, pulse **Abrir Mailpit** y abra el enlace recibido en `http://127.0.0.1:8025`; es correo local de prueba y no se entrega a Internet. Si usa el adaptador de memoria antiguo, el enlace se muestra en Cuenta. Luego inicie sesión. Revise cookie `HttpOnly` y ausencia de tokens de acceso en localStorage.
3. En Sincronización, consulte/cree un espacio, seleccione categorías y prepare el envío. Hasta confirmar, no se deben escribir los registros seleccionados. Revise los excluidos.
4. Envíe y compruebe los registros desde sus API o pgAdmin en la base de cada servicio. Reintente: los registros confirmados no deben duplicarse.
5. Interrumpa un servicio a mitad del envío y reanúdelo después de recuperarlo. Modifique un registro ya enviado: revise el conflicto y confirme las copias/actualizaciones. Con sesión vencida o cuenta desactivada deben detenerse las siguientes escrituras.
6. Cambie entre los seis idiomas y recorra los controles con teclado en escritorio y móvil. Revise carga, foco de la vista previa, mensajes de error y conservación del proyecto local.

## Verificación y alcance

Los casos `tests/unit/{httpClient,identityClient,identityProvider,identityAdministration,serviceGateway,syncPlan,synchronization}.test.*` comprueban transporte, roles, respuestas, versiones, selección, idempotencia y fallos parciales. `tests/e2e/synchronization.spec.ts` prueba el navegador con respuestas HTTP controladas: visitante, inicio de sesión, cookie HttpOnly, conflictos, reanudación tras recarga, expiración, seis idiomas y axe en escritorio/móvil. Estas pruebas de navegador no equivalen a una validación completa de los cuatro servicios reales conectados.

## Medición preliminar de la iteración 10 — 25 de octubre de 2026

Las cifras de prueba y los pendientes de este corte corresponden al estado previo a la integración SMTP local, las pantallas nuevas y los eventos durables. Las filas de HU/RF/RNF actualizadas abajo reflejan el estado actual; la sección final contiene las verificaciones más recientes y sustituye los resultados preliminares donde se contradigan.

### Pruebas ejecutadas

| Área | Resultado |
|---|---|
| Frontend unitarias/componentes | 286/286 en 41 archivos con Vitest 5.0.5; lint, compilación y verificador de arquitectura pasan. |
| Frontend E2E/regresión | 543 aprobadas, 3 omitidas por capacidades del navegador, 0 fallidas; 546 ejecuciones en escritorio, tablet y móvil, 19,2 minutos. Los omitidos son zoom nativo en tablet/móvil y un adaptador de cámara simulado móvil. |
| Backend | 79/79 en 28 archivos con `TEST_POSTGRES=1` contra PostgreSQL 17 efímero. Lint de arquitectura, lint ESLint y compilación de los cuatro servicios pasan. Incluye contratos OpenAPI, permisos, idempotencia, concurrencia e integración de repositorios. |
| Migraciones | Las 15 migraciones de los cuatro servicios instalaron en bases vacías. Pasaron las dos pruebas de compatibilidad de Identidad desde datos de la versión anterior. Se usó una base temporal aislada; las bases persistentes y sus contraseñas no se modificaron. |
| Respaldo y recuperación | `pg_dump` y restauración en bases temporales conservaron el número de tablas: Identidad 11, Aprendizaje 31, Comunidad 12 y Evidencias 15. Esta comprobación cubre estructura vacía, no recuperación de datos productivos. |
| API en contenedores locales | Se reconstruyeron las imágenes y arrancaron los cuatro servicios en Docker. Identidad, Aprendizaje, Comunidad y Evidencias están `healthy` en los puertos 3001–3004; PostgreSQL sigue `healthy` en 5432 y no se reinició. Las cuatro rutas `/openapi.json` responden OpenAPI 3.1.0 con 12, 31, 20 y 16 rutas respectivamente; `/health/live` y `/health/ready` respondieron correctamente. Identidad expone `/__dev/mailbox` en desarrollo; el buzón en memoria inició vacío tras el reinicio. |
| Rendimiento local | En preview estático, 5 cargas Chromium nuevas: p50 173 ms, p95 203,5 ms, 1.072.777 bytes transferidos y 15 recursos. Además, 50 lecturas secuenciales de `/health/ready` por servicio, sin errores; p95: Identidad 17,58 ms, Aprendizaje 18,10 ms, Comunidad 15,66 ms y Evidencias 15,66 ms. Son referencias locales sin CPU/red limitadas, no pruebas de carga ni SLA. |
| Seguridad de dependencias/secretos | `npm audit --audit-level=high` encontró 0 vulnerabilidades en ambos proyectos después de actualizar Vitest a 5.0.5 y aplicar parches compatibles. El `.env` del frontend está ignorado y no rastreado; el escaneo de patrones de secretos de alta confianza en sus archivos versionados no encontró coincidencias. |

Una prueba de idioma que dependía de una transición no esperada de forma asíncrona se hizo determinista (`tests/unit/learning-workflows.test.tsx`); se mantuvieron las aserciones. No se desactivaron pruebas ni se redujo su cobertura. La ejecución completa E2E del navegador usa respuestas HTTP controladas para los flujos de cuenta/sincronización: **no es una prueba E2E conectada a los cuatro procesos fuente**. Las pruebas PostgreSQL sí ejecutan las API y adaptadores de cada servicio, pero no sustituyen esa validación de red entre procesos.

### Trazabilidad de historias y requisitos

Esta matriz usa las **nueve HU de la solicitud vigente** y sustituye la numeración anterior de diez historias. El MER v2.1 de 55 tablas sigue siendo la referencia lógica; no se ha modificado ni aplicado su DDL consolidado como una migración única. «Verificado» se limita al código y a las pruebas identificadas; una API implementada no acredita que exista su pantalla conectada ni que el recorrido completo entre los cuatro servicios esté probado.

| HU | Resultado de la revisión | Evidencia y límite pendiente |
|---|---|---|
| HU-01 Visitante | Verificada en los recorridos E2E dirigidos | Laboratorio y reserva local sin escrituras API; el recorrido con backend real aún requiere una comprobación SQL completa de todos los flujos públicos. |
| HU-02 Cuenta y sincronización | Parcial, flujo local real comprobado | Registro, verificación por Mailpit, inicio de sesión y cookie HttpOnly verificados contra Identidad en Docker; la interfaz ofrece reenvío y sincronización explícita. E2E del navegador usa API simulada; SMTP Brevo real está pendiente. |
| HU-03 Administración | Parcial | La API aplica roles/permisos y revoca sesiones al desactivar cuentas; la pantalla administrativa está disponible. Ratificación institucional de la matriz final y validación manual de todos los estados siguen pendientes. |
| HU-04 Guardar actividades | Parcial | APIs de Aprendizaje/Comunidad, versiones, propiedad e idempotencia tienen pruebas; Sincronización permite guardar las categorías compatibles y Progress muestra actividad propia. La sincronización completa de todo el MER y cursos/proyectos sigue pendiente. |
| HU-05 Colaborar en grupo | Parcial, pantallas conectadas | Grupos, membresías, invitaciones y sugerencias tienen interfaz conectada; E2E de Comunidad y pruebas de aislamiento backend pasan. Falta el recorrido autenticado de navegador con los cuatro servicios reales y la resolución UI de cambios compartidos. |
| HU-06 Seguimiento docente/líder | Parcial, panel conectado | Seguimiento muestra asignaciones, ejecuciones, entregas y revisiones autorizadas; APIs verifican responsabilidades locales. La evidencia de dos grupos con roles distintos necesita revisión manual integrada. |
| HU-07 Sugerencias | Parcial, pantalla conectada | La interfaz permite enviar y consultar sugerencias según permisos; la API protege autoría y estados. Los flujos frontend están cubiertos por pruebas de componentes/E2E dirigidas, no por un navegador conectado a Docker. |
| HU-08 Informes | Parcial, flujo remoto disponible | Evidencias guarda selección y snapshots versionados, genera/reintenta y exporta JSON, Markdown o CSV; las fuentes fallidas quedan identificadas. PDF no está implementado y la agregación no sustituye una validación institucional del informe. |
| HU-09 Investigación UX | Parcial | Consentimiento por finalidad y API de eventos/calibración están implementados; seguimiento detallado no se envía por defecto ni incluye video. El aviso, retención, borrado y flujo de investigador requieren política institucional. |

| Requerimiento funcional | Estado y alcance |
|---|---|
| RF-01 Cuentas y roles | Registro, verificación, recuperación, perfil, reenvío y administración están conectados; prueba real local SMTP con Mailpit. Entrega externa requiere completar Brevo. |
| RF-02 Cursos, proyectos, grupos y membresías | Espacios/asignaciones y grupos/membresías disponibles por API. El contenido de Curso es local; no existe aún un flujo completo de gestión remota de cursos y proyectos de grupo. |
| RF-03 Actividades, personas, escenarios, conceptos y patrones | API, catálogo versionado, persistencia y adaptadores de sincronización compatibles probados. Los registros no compatibles permanecen locales y se explican en la vista previa. |
| RF-04 SUS/TLX y Fitts/Hick | Cálculos desde respuestas, versiones y ensayos numerados probados por dominio e integración. No se acepta un puntaje arbitrario enviado por el cliente en lugar de respuestas. |
| RF-05 Usuarios ficticios y reservas | Implementados y probados; usuarios ficticios no autentican. Reservas conservan restricciones y conflictos concurrentes de Comunidad. |
| RF-06 IA y chatbots | Funciones locales y tablas del modelo lógico; no se verificó un contrato específico de persistencia/sincronización de revisión IA o evaluación de chatbots. Pendiente completar ese flujo remoto. |
| RF-07 UX, evidencias e informes | APIs de telemetría con consentimiento, accesibilidad, metadatos e informes; pantalla remota permite snapshot, generación, reintento y exportación JSON/Markdown/CSV. Sin UI de seguimiento remoto detallado por defecto. |
| RF-08 Sugerencias, respaldos e historial | Sugerencias e historial por API e interfaz; respaldos locales preservados. Outbox/inbox y snapshots de informes son durables. Objetivos RPO/RTO y política de retención SQL siguen pendientes. |

| Requerimiento técnico/calidad | Estado y evidencia |
|---|---|
| RNF-01 Visitante local | Cubierto en los flujos probados; permanece pendiente el conteo SQL de toda la navegación pública real. |
| RNF-02 Propiedad por servicio | Cuatro bases y roles separados; pruebas de denegación de conexión entre servicios y revisión estática sin SQL ni FK cruzadas. Compartir instancia PostgreSQL no comparte propiedad. |
| RNF-03 Clean Architecture | **Parcial**. El verificador de imports pasa y el frontend conserva dominios/capas, pero `AuthApplication` todavía contiene SQL PostgreSQL. Falta moverlo a adaptadores de infraestructura con puertos de aplicación; pasar el lint no acredita independencia de PostgreSQL. |
| RNF-04 Autorización en servidor | Probada en endpoints implementados: sesión activa, origen, CSRF, permisos y denegación ante dependencias no disponibles. Las operaciones públicas de alta/verificación/recuperación tienen controles propios y no autorizan trabajo remoto. |
| RNF-05 Aislamiento por grupo | Pruebas de pertenencia y liderazgo local; teacher global no equivale a líder ni a administrador. Recorrido entre dos grupos desde pantallas conectadas aún pendiente. |
| RNF-06 Contratos REST | Rutas `/v1`, OpenAPI 3.1, errores estables y HTTP sin dependencia del frontend. API reutilizable por móvil; no se probó una app móvil consumidora. Se corrigió aislamiento de esquemas por instancia y 405 de `/openapi.json`. |
| RNF-07 Migraciones | 15 migraciones instaladas en bases vacías temporales y dos pruebas de actualización de Identidad con datos anteriores. No se editaron migraciones aplicadas. Las concesiones SQL requieren roles canónicos `identity_app`, `learning_app`, `community_app`, `evidence_app`; nombres arbitrarios no están soportados por esas migraciones. Actualizaciones no vacías de los otros servicios pendientes. |
| RNF-08 Atomicidad y concurrencia | Transacciones y pruebas de propiedad, versión optimista, entrega inmutable y duplicados concurrentes en los flujos existentes. Sin transacciones distribuidas. |
| RNF-09 Idempotencia | Persistida y probada en las operaciones que la declaran; no todos los endpoints mutables ofrecen `Idempotency-Key`. |
| RNF-10 Idiomas y accesibilidad | Seis idiomas; pruebas E2E dirigidas comprueban cuenta, sincronización, grupos, teclado y axe en recorridos seleccionados. Pendiente lector de pantalla real y revisión manual completa en navegadores/dispositivos. |
| RNF-11 Consentimiento y minimización | API probada, sin video ni envío detallado predeterminado. Política institucional, aviso de retención y operación periódica del borrado pendientes. |
| RNF-12 Secretos y datos de prueba | Pruebas con credenciales efímeras solo en memoria; no se escriben secretos en Git ni se usan datos personales reales. Falta revisar el backend completo bajo control Git y configurar secretos de producción. |
| RNF-13 Respaldo y recuperación | Respaldo local disponible. La restauración SQL anterior cubrió esquemas vacíos; no valida restauración de datos operativos ni RPO/RTO. |
| RNF-14 Evaluación frente a finalización | Se distinguen ejecución completada, entrega versionada, valoración y retroalimentación. SUS/TLX conservan versiones y respuestas originales; seguimiento pedagógico completo por UI pendiente. |
| RNF-15 Fallos parciales y eventos | Cada servicio tiene outbox/inbox, proyecciones, correlación, reintentos con backoff y dead letter; no hay transacciones distribuidas. Panel `/eventos` consulta estado y permite reencolar bajo permiso de administrador. Suites backend verifican duplicados, concurrencia y fallos parciales. |

| Regla de negocio vigente | Verificación y pendiente |
|---|---|
| RN-01 Visitantes sin filas PostgreSQL | E2E público sin llamadas de escritura y contrato de consulta de cuenta sin persistencia. Falta auditoría SQL de todos los recorridos reales; no se crea una cuenta temporal al explorar. |
| RN-02 Cuenta activa y autorizada | Validada en APIs implementadas, sesiones y permisos. Interpretación necesaria: registro y consumo/solicitud de tokens son excepciones acotadas de aprovisionamiento/recuperación; nunca habilitan sincronización ni escritura de trabajo a visitantes. |
| RN-03 Cuenta real ≠ usuario ficticio | Separación de servicios/tablas y pruebas de usuarios didácticos; editar un usuario ficticio no concede sesión ni roles reales. |
| RN-04 Roles globales ≠ funciones de grupo | RBAC y liderazgo local probados con denegación de escalamiento. Administración completa de roles en la interfaz y ratificación institucional de permisos pendientes. |
| RN-05 Estados de cuenta | `pending→active` al verificar y desactivación con revocación probados. **Parcial:** la administración acepta estados enumerados, pero falta una tabla explícita de transiciones válidas y pruebas completas de `locked`; no hay política institucional de bloqueo automático. |
| RN-06 Tokens y enumeración | Hash, propósito, expiración, consumo atómico, recuperación y reenvío de verificación probados. Mensajes genéricos y límites reducen enumeración; SMTP local probado, Brevo externo pendiente. |
| RN-07 Métricas tipadas | Pruebas de SUS/TLX desde respuestas/fórmulas y ocho ensayos Fitts/Hick ordenados, con rechazo de tipos/repeticiones inválidos. |
| RN-08 Conservación de versiones | Catálogos, instrumentos/fórmulas, ejecuciones, respuestas e historial de entregas probados. El adaptador no reasigna a una versión futura un resultado local antiguo sin compatibilidad declarada. |
| RN-09 UX informado y retención | Consentimiento por finalidad, no video y retención opcional/configurable probados. **Parcial:** falta comunicar y conservar la política institucional de retención aplicable y operar su eliminación; no se inventó un plazo. |
| RN-10 Integración entre servicios | Outbox/inbox durable, reintentos, dead letter, correlación e idempotencia probados por servicio; no se usan transacciones distribuidas. La prueba E2E del navegador conectado simultáneamente a los cuatro servicios sigue pendiente. |

### Actualización de integración, correo y accesibilidad — 25 de octubre de 2026

La pantalla Cuenta mantiene inicio de sesión primero y deja recuperación y registro colapsados. El registro solicita nombre, apellido, correo, contraseña y confirmación. Identidad usa SMTP local de Mailpit en Docker; el mensaje llega a `http://127.0.0.1:8025` y no sale a Internet. La cuenta de prueba sintética se verificó por el enlace de Mailpit, inició sesión contra Identidad y recibió cookie `HttpOnly`. El frontend incluye aviso del modo SMTP local y acción para reenviar verificación. La entrega real con Brevo queda pendiente hasta disponer de cuenta, remitente verificado y clave SMTP; no se reporta como probada.

Las pantallas conectadas cubren grupos/membresías/invitaciones, sugerencias, seguimiento, selección y exportación de informes, además del tablero de outbox/inbox y reintentos. El informe exporta JSON, Markdown o CSV; PDF aún no está soportado. El tablero de eventos consulta estado por servicio y restringe el reintento a permisos autorizados por el servidor. Las operaciones entre servicios conservan outbox/inbox, reintentos y correlación, sin transacciones distribuidas.

| Verificación | Resultado actual |
|---|---|
| Frontend: unitarias/componentes | 309/309 en 45 archivos; lint y compilación pasan. |
| Frontend: E2E dirigidas | 72/72 en Cuenta, Comunidad y Sincronización, con proyectos de escritorio/tableta/móvil. Incluyen cuenta, visitante, grupos, navegación por teclado y comprobaciones axe seleccionadas. No equivalen a la regresión E2E completa ni a una prueba contra cuatro APIs reales. |
| Backend: pruebas | 130/130 en 38 archivos con PostgreSQL temporal; incluye instalación/actualización aislada de migraciones, eventos, permisos, idempotencia y fallos parciales. Lint de arquitectura/ESLint y compilación pasan. |
| Migraciones locales | Registradas por servicio: Identidad 5, Aprendizaje 6, Comunidad 4 y Evidencias 5. Las pruebas de instalación y actualización usan bases temporales aisladas. |
| Contenedores locales | PostgreSQL y los cuatro servicios están saludables; Mailpit también está saludable. Puertos API 3001–3004, PostgreSQL 5432 y UI de Mailpit 8025. SMTP 1025 permanece en la red interna de Compose. |
| Flujo real de correo local | Registro sintético → mensaje Mailpit → verificación → inicio de sesión → consulta de perfil con cookie HttpOnly: correcto. No se usó correo personal real. |
| Accesibilidad | Seis idiomas disponibles; axe no encontró violaciones en los casos E2E de Comunidad. La ayuda documenta Tab/Shift+Tab, Enter, Space y Escape. No hay atajos globales personalizados. |

La regresión E2E completa de 543 aprobadas y 3 omitidas corresponde a una medición previa y no se repitió en esta actualización. El E2E dirigido usa respuestas controladas para las APIs; la prueba de registro se realizó directamente contra los contenedores reales. No se completó todavía un E2E de navegador que sincronice el trabajo y recorra permisos entre los cuatro servicios.

### Pendientes y pasos de revisión

Para probar localmente, mantenga Docker Compose activo, abra el frontend en `http://localhost:5173/hci-lab-ia/` y Mailpit en `http://127.0.0.1:8025`. Registre una cuenta sintética, abra el mensaje de verificación, active la cuenta e inicie sesión. Luego revise `/grupos`, `/seguimiento`, `/sugerencias`, `/informes` y `/eventos`; la sincronización debe solicitar confirmación y un visitante no debe producir escrituras.

Falta validar manualmente la navegación completa con NVDA o Narrator, pronunciamiento de encabezados/errores, contraste/zoom, permisos reales entre dos grupos y el flujo de sincronización desde navegador contra las cuatro APIs. Estas comprobaciones, junto con el test SMTP, no son reemplazadas por los E2E simulados. La revisión de heurísticas, Tab y ayudas está en [revisión de usabilidad y accesibilidad](revision-usabilidad-accesibilidad.md).

Para correo, Mailpit local quedó validado y es suficiente para esta entrega; Gmail/Brevo no se configura ni se afirma como probado. Para administrar outbox/inbox abra **Integración de servicios** (`/eventos`) con una cuenta administradora. No se ejecutó despliegue ni se hizo commit, push o merge.

### Cierre de verificación — 26 de octubre de 2026

- HU-06: probado contra servicios reales con dos cuentas activas, pertenencia a dos grupos, asignación versionada, ejecución, entrega, revisión, feedback y denegación de acceso cruzado.
- Retención de Evidencias: mínimo de 30 días por decisión del administrador, configurable hacia arriba, con ejecución automática al arranque y cada 24 horas; pruebas unitarias e integración de PostgreSQL verifican el corte y la preservación de eventos pendientes/reintentos.
- Backend: 137/137 pruebas, lint, compilación y pruebas HTTP pasaron. PostgreSQL ejecutó las pruebas de migración en bases temporales.
- Frontend: 319/319 pruebas unitarias, lint y compilación pasaron; E2E completa 600 pasaron, 3 omitidas, 0 fallidas.
- Docker local: Identidad, Aprendizaje, Comunidad, Evidencias, PostgreSQL y Mailpit aparecen saludables. Mailpit es el único transporte de correo validado.
- Prueba real con Chromium desde Vite: salud y OpenAPI de los cuatro servicios respondieron 200; las pantallas Cuenta, Sincronización, Grupos, Sugerencias, Seguimiento e Informes cargaron. Con sesión activa, el navegador creó un espacio en Aprendizaje (201), leyó su lista en Evidencias (200) y recibió 200 de Comunidad/Aprendizaje; el ID de espacio inexistente fue rechazado con 404. El espacio sintético se eliminó al terminar. El recorrido HU-06 entre dos cuentas y dos grupos está probado contra APIs reales, pero su flujo de invitación, entrega y revisión no se completó desde el navegador.
- Deuda técnica aceptada: completar desde navegador el flujo autenticado entre dos cuentas/grupos, validar auditivamente con Narrator/NVDA la lectura de formularios y errores, y probar un proveedor remoto de IA en una versión posterior. Una repetición del login agotó tiempo antes de llegar a Identidad; el contenedor continuó saludable y no registró esa petición. La regresión E2E automatizada usa respuestas controladas.
