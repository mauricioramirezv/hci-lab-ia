# Cierre integral local: 2.5.0

Fecha de revisión: 23 de octubre de 2026. Estado: revisión local; publicación y aprobación asistiva pendientes. Se conservan los cambios de usuarios, consistencia de CRUD y preferencias recibidos antes del cierre. Se prepara el commit local autorizado después de las verificaciones. No se hace push, merge, release ni despliegue.

2.5.0 es un incremento menor de 2.4.0: incorpora funciones compatibles y reorganización interna, sin cambiar la versión 2 de los datos ni las claves existentes. `package.json`, las dos versiones raíz del lockfile y la versión visible comparten el mismo valor. Los identificadores de versiones históricas en evidencias y ejemplos se conservan como procedencia.

## Cumplimiento

«Funcional local» significa una operación real sobre el proyecto guardado en el navegador; no significa un servicio institucional, autenticación ni validación clínica. La cobertura automática no equivale a conformidad WCAG completa.

| Requisito | Implementación | Prueba | Estado | Limitación |
| --- | --- | --- | --- | --- |
| Usuarios | CRUD ficticio, correo único, estado, confirmación y deshacer; evidencias | `users`, `usersProject`, E2E `users`, `crud-consistency` y recorrido integral | Funcional local | Sin autenticación ni permisos reales |
| Reservas | Crear, consultar, reprogramar, cancelar, validar fechas y duplicados | `reservation*`, E2E `project-activities`, `reservations-persistence` | Funcional local; servicios simulados | No contacta instituciones |
| Personas, empatía y escenarios | Reglas, vínculos estables, bloqueo de eliminación y borradores | `researchOperations`, `crudConsistency`, E2E `project-activities*` | Funcional local | Calidad de investigación requiere evaluación humana |
| Conceptos | Once actividades, dos condiciones, mediciones y observaciones | `concepts`, `learning-workflows`, E2E `concepts` | Actividades funcionales | Ejemplos didácticos, no estudios poblacionales |
| Patrones | Seis categorías, dos condiciones y evidencia escrita | `patterns`, E2E `patterns` | Actividades funcionales | No aplica cambios a servicios externos |
| Evaluación heurística | Hallazgos, severidad, revisión y procedencia | `evaluationOperations`, E2E `evaluation*`, `crud-consistency` | Funcional local | No certifica accesibilidad automáticamente |
| Experimentos | Fitts/Hick, práctica excluida, ensayos y contexto de visualización | `experimentOperations`, `displayPreferences`, E2E `evaluation`, `display-preferences` | Medición didáctica funcional | Dimensiones de objetivos conservadas; condiciones distintas separadas |
| Cuestionarios y tareas UX | SUS, Raw TLX y registros manuales | `evaluation-scores`, `learning-workflows`, E2E `evaluation*` | Cálculos funcionales | Autoinformes, sin emociones inferidas |
| IA y chatbots | Propuestas, decisiones e incorporación explícita; chat y rúbricas | `aiChatOperations`, `chatbotCancellation`, E2E `evaluation`, `module-persistence` | Simulación revisable | Proxy opcional sin validación de servicio externo |
| Seguimiento | Clics, scroll, cursor, recorridos simulados y exportaciones | `tracking*`, E2E `tracking*` | Captura funcional; atención simulada | Scroll/cursor no demuestran lectura ni mirada |
| Cámara | Consentimiento, calibración, validación y liberación de recursos | E2E `tracking-camera`, `tracking`, `project-management` | Adaptador probado con mocks | Cámara y precisión físicas pendientes |
| Multimodal | Ocho contextos, canales y evidencias | `multimodal`, E2E `multimodal` | Simulación y adaptadores del navegador | Voz, audio y háptica físicos pendientes |
| Informes | Selección, borrador, agrupación compatible, Markdown/CSV/JSON e impresión | `reports`, `reportOperations`, E2E `reports` | Funcional local | Interpretación académica y PDF final requieren revisión humana |
| Respaldo, recuperación y reset | Transacción común, compatibilidad antigua, invalidación de operaciones | `projectBackup`, `projectTransactions`, `recoveryOperations`, E2E `project-management`, recorrido integral | Funcional local | Almacenamiento local; sin sincronización entre pestañas |
| Preferencias | Estado único, texto 100–200 %, contraste, fuente, espaciado, movimiento y restauración | `displayPreferences`, integración y E2E homónimos, `browser-zoom` | Funcional local | Fuente alternativa sin garantía universal para dislexia |
| Teclado y semántica | Tab/Mayús+Tab, Enter/Espacio, Escape, foco, etiquetas y ayudas; Alt+Mayús+V | E2E `crud-consistency`, `display-preferences`, `route-loading`, axe | Flujos críticos comprobados automáticamente | Lector de pantalla real pendiente |
| Mensajes de acciones | Resultado textual, foco, confirmaciones y tonos explícitos en CRUD, preferencias, informes y seguimiento | E2E de cada flujo, fallos de almacenamiento y axe | Flujos y demostraciones revisados | Antipatrones mantienen sus defectos didácticos dentro del ejemplo; lectura asistiva real pendiente |
| Seis idiomas | Navegación, CRUD, conceptos, patrones, evaluación, informes, seguimiento y preferencias | `interfaceTranslations`, `legacyInterface`, `interface-languages`, suites específicas y `check-translations.cjs` | Catálogos completos y cobertura automática de las 19 rutas | Revisión lingüística por hablantes competentes recomendada; datos previos y del usuario conservan su idioma original |
| Estados y adaptación | Vacío, edición, validación, éxito, confirmación, carga y error de ruta | E2E de módulos, `route-loading`, `shell`, zoom y preferencias | Automatizado en Chromium | No se declara cobertura de todo estado posible ni de Safari/Firefox |
| Arquitectura y repositorio | Dominios, capas utilizadas, entradas públicas; pruebas en `tests/` | `check-architecture.cjs`, `audit-release.cjs`, lint | Comprobación estática | Imports dinámicos construidos y secretos no reconocibles requieren revisión humana |
| Dispositivos | Flujos compactos y priorización en ocho contextos | `interface-languages`, suites multimodales y de reservas | Demostración didáctica | La vista circular del reloj es una maqueta; su botón no realiza una reserva |
| Calidad y curso | Guías, planificación y ejemplos de herramientas | Inspección de rutas y documentación | Material educativo | Selenium, Lighthouse, Katalon y LSC no quedan aprobados por existir una interfaz o archivo |
| Pages | Base y URL conservadas; verificación antes de subir artefacto | Build, preview, auditoría de recursos y workflows | Preparado localmente | No se ha ejecutado el despliegue real ni los workflows remotos |

Se completan los textos pendientes con 417 claves estáticas en diez catálogos por dominio y las claves base ausentes en italiano/catalán. No se usa traducción automática en ejecución. Se revisó la correspondencia de instrucciones, advertencias, resultados e interpolaciones entre los seis idiomas; las pruebas no certifican la calidad lingüística y se recomienda revisión por hablantes competentes. La revisión asistiva/física permanece pendiente. Este cierre no equivale a certificación WCAG ni a validación de hardware.

## Verificación final local

Lint, las 238 pruebas unitarias/integración en 34 archivos, el grafo de 245 módulos y `npm ls --depth=0` pasan. No se detectan ciclos ni dependencias prohibidas. El análisis de traducciones comprueba 64 componentes TSX y diez catálogos, sin textos naturales estáticos pendientes; conserva una lista explícita de marcas, unidades y comandos. Las pruebas comprueban todas las claves sin recurrir al español y la equivalencia de las interpolaciones.

La compilación termina sin advertencia de bloques superiores a 500 kB; el preview responde correctamente para los 42 archivos. La ejecución final E2E secuencial evaluó 172 casos únicos en tres proyectos (516 combinaciones): 513 aprobadas, cero fallos y tres skips previstos. El primer intento completo paralelo tuvo 507 aprobadas, seis timeouts móviles y los mismos tres skips; los seis casos pasaron al repetirlos solos con un trabajador, y la suite completa secuencial confirmó el resultado. El resumen final registra exclusivamente esta última ejecución: escritorio 172/172, tableta 171/172 y móvil emulado 170/172. Los skips son el zoom mediante extensión de escritorio en tableta y móvil, y una prueba de cámara simulada restringida a escritorio/tableta. La duración registrada fue 36,7 minutos; las repeticiones anteriores se documentan aquí como diagnóstico y no se suman a los casos únicos. La prueba nueva recorre las 19 rutas vacías en seis idiomas, comprueba mensajes, CSV y TTS con un adaptador simulado; el recorrido integral y las suites específicas conservan la cobertura con datos, reset y recuperación.

Entorno local: Windows x64, Node.js 24.15.0, Playwright 1.63.0 y Chromium distribuido con Playwright 153.0.8010.12 (revisión 1243). Se usan tres proyectos de Chromium headless: escritorio, viewport de tableta y emulación Pixel 7. El perfil de tableta adapta el viewport de escritorio; no valida interacción táctil física. No se han probado Firefox, Safari, dispositivos físicos ni Node.js 22 localmente; Node.js 22 es la configuración propuesta de CI, aún sin ejecutar remotamente en este cierre.

## Rendimiento

La entrada anterior incluía todas las pantallas. El bloque principal era aproximadamente 907,94 kB (286,73 kB gzip); junto a los dos bloques compartidos, el JavaScript inicial sumaba aproximadamente 1.005,30 kB (319,88 kB gzip).

Se difieren las rutas secundarias mediante `React.lazy`, `Suspense` y un límite de error que permite recargar conservando los datos. Las traducciones se agrupan por dominio, sin cambiar idioma ni claves. No se aumenta `chunkSizeWarningLimit`. Los catálogos de idiomas todavía se cargan inicialmente para conservar el cambio inmediato y los contratos existentes; no se afirma que todos los recursos sean diferidos ni que mejore un indicador Lighthouse sin medirlo.

La auditoría local escribe tamaños exactos en `tests/reports/release-audit.json`. Deben distinguirse tamaño del mayor bloque, carga inicial y suma de todos los bloques: dividir puede aumentar ligeramente la suma total por envoltorios y referencias.

| Medida de JavaScript | Antes, aproximado | Después, compilación revisada |
| --- | ---: | ---: |
| Mayor bloque | 907,94 kB / 286,73 kB gzip | 259,84 kB / 82,60 kB gzip |
| Carga inicial | 1.005,30 kB / 319,88 kB gzip | 970,59 kB / 312,15 kB gzip |
| Todos los bloques | 1.005,30 kB / 319,88 kB gzip | 1.178,10 kB / 383,72 kB gzip |

Frente a la entrada original de 2.4.0, la carga inicial baja aproximadamente 3,5 % sin comprimir y 2,4 % con gzip. La suma total sube aproximadamente 17,2 % sin comprimir y 20,0 % con gzip. Completar los catálogos aumenta la carga respecto al cierre anterior incompleto (833,54 kB / 272,24 kB gzip); por eso ya no se atribuye a esta versión la reducción previa del 17 %. Hay 12 archivos JS iniciales frente a los tres anteriores; más peticiones pueden afectar una conexión con alta latencia. No se ha medido Lighthouse ni una red móvil física. Los tamaños se miden en bytes de archivo y gzip local; no representan un tiempo de interacción real ni la compresión que aplicará Pages. Los 42 recursos de producción se comprobaron por HTTP en preview, incluidos tipos MIME y tamaños.

## Teclado, nombres y resultados

Se interpreta «tag» de teclado como Tab. Tab y Mayús+Tab recorren los controles; Enter y Espacio activan los controles nativos que lo admiten. Escape cierra diálogos y devuelve el foco. Alt+Mayús+V abre preferencias cuando no hay otro diálogo modal; se anuncia mediante `aria-keyshortcuts` y se explica en el panel. No se añaden atajos de una sola letra que interfieran con escribir o con un lector de pantalla.

Los campos compartidos conservan `label`, añaden `title` y enlazan la ayuda mediante `aria-describedby`; las páginas enlazan título y descripción. Los diálogos usan nombre y descripción. No se añaden `title` y `desc` indiscriminadamente a cada etiqueta HTML: no sustituyen las etiquetas visibles ni son atributos ARIA universales. Los SVG decorativos quedan ocultos; los gráficos requieren alternativa textual. La lectura real de estos elementos debe revisarse con tecnología asistiva.

Los éxitos revisados usan verde y los errores rojo; conservan explicación textual, roles y diferencias de borde. Alto contraste prioriza la paleta elegida y el texto, sin depender de reconocer colores. Cancelar, bloquear una eliminación o pedir confirmación no se presentan como una escritura exitosa. El guardado solo se confirma después de persistir.

## Disponibilidad y evidencia de revisión

| Comprobación | Estado | Evidencia y límite |
| --- | --- | --- |
| Revisión de código, catálogos y enlaces | Comprobado por inspección y herramientas | Catálogos estáticos por dominio, `check-translations.cjs`, `audit-release.cjs` y diff; no equivale a revisión lingüística nativa |
| Rutas, teclado, foco, temas, texto y zoom 200 % | Automatizado; revisión humana pendiente | Suite Playwright sobre preview; zoom real en Chromium de escritorio, otros perfiles emulados |
| Navegador interactivo de la sesión | No disponible | Browser devolvió `No browser is available`; la enumeración de navegadores devolvió `[]` |
| Lector de pantalla | Pendiente | Sin sesión de NVDA, JAWS o VoiceOver operada; axe no valida su experiencia de uso |
| LSC | Pendiente | Sin video final validado por persona competente; la muestra local es un mecanismo de carga |
| Cámara física | Pendiente | Consentimiento, permisos y liberación cubiertos con mocks; no se midió precisión con hardware |
| Voz y audio reales | Pendiente | TTS e idioma comprobados mediante adaptador simulado, sin verificar salida acústica ni reconocimiento real |
| Háptica | Pendiente | No se probó vibración física; se conserva alternativa textual |
| Celular y tableta físicos | Pendiente | Viewports y Pixel 7 emulado; no se acredita tacto ni comportamiento físico |
| Safari, Firefox y otros navegadores | Pendiente | La ejecución local usa Chromium; no se ejecutaron otros motores |

## Revisión manual pendiente

1. **Lector de pantalla:** NVDA o JAWS con Chromium y VoiceOver con Safari. Revisar títulos, etiquetas, errores, anuncios sin repetición, Tab/Mayús+Tab, Alt+Mayús+V, Escape y retorno de foco tras eliminar, cerrar o recuperar. Anotar producto, versión y sistema usados.
2. **LSC:** una persona competente debe validar el contenido del video, su comprensión, transcripción y relación con la tarea. La carga local de video no valida su contenido lingüístico.
3. **Cámara:** probar permiso concedido/denegado, ausencia de dispositivo, salida de ruta, reset, detención y recuperación con hardware. Registrar error de calibración, iluminación, distancia y limitaciones; no inferir emociones ni diagnósticos.
4. **Voz/audio:** comprobar micrófono, reconocimiento disponible/ausente, TTS, parada, permisos y alternativa escrita en el navegador real. El soporte depende de plataforma y servicios del navegador.
5. **Háptica:** probar dispositivo físico compatible y ausencia de soporte; mantener confirmación textual/visual cuando no vibre.
6. **Visual y táctil:** repetir en celular y tableta físicos; probar temas, todas las preferencias, ampliación y zoom del navegador. Revisar cada mensaje didáctico antiguo y la impresión final. No reducir texto para hacerlo caber.
7. **Idiomas:** solicitar una revisión lingüística de los seis catálogos por hablantes competentes, en especial terminología académica y mensajes didácticos. La cobertura de claves, el análisis de JSX y el recorrido automático no sustituyen esta revisión editorial. Los datos introducidos y los registros históricos conservan su texto original.

## Publicación

La URL prevista se conserva: https://mauricioramirezv.github.io/hci-lab-ia/. El workflow de Pages ahora exige lint, reglas de dependencias, unitarias/integración, build y E2E antes de subir `dist/`. Los reportes se suben con `always()` y retención de 14 días, incluso ante fallo. El job de despliegue depende de la verificación y recibe los permisos de Pages.

La revisión usa el servidor local de preview y la distribución de producción. Esto no valida permisos, configuración del repositorio ni disponibilidad del sitio remoto. Publicar sigue requiriendo una instrucción posterior. Consulte el inventario exacto de archivos en `archivos-publicacion.md` antes de aprobar.

## Preservación y alcance del commit local

Antes de esta corrección se creó `tmp/recovery-20261022-221608/`: copia de 470 archivos no ignorados, diff binario del árbol y del índice, HEAD y SHA-256. La copia es local e ignorada. Los cambios recibidos de usuarios, CRUD y preferencias forman parte de la entrega y se mantienen. No se cambian dependencias, claves, identificadores ni formato de respaldos. Los textos de los nuevos casos de exposición se generan en el idioma elegido y después se conservan como datos, sin retraducirlos al cambiar de idioma.

El commit autorizado es `feat: preparar HCI Lab IA 2.5.0 para publicación`. La publicación queda sujeta a la revisión final del usuario y a las limitaciones asistivas, físicas y de servicios externos descritas. La configuración de Pages se revisa localmente; no se declara ejecutada remotamente.
