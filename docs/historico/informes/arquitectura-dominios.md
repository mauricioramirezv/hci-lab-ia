# Separación progresiva de responsabilidades

Base: `31d1b1e7df8d1e4ab576479c7ba3f998369e2b64`. El árbol estaba limpio al iniciar. La referencia es reservas. Cada dominio conserva sus rutas, datos, claves e identificadores; las capas se crean solo si contienen responsabilidades concretas. No se cambian los formatos de respaldo ni las dependencias.

Orden previsto: investigación (personas, empatía, escenarios), conceptos y patrones, evaluación, experimentos, IA y chatbots, seguimiento y multimodal, informes, gestión del proyecto y accesibilidad. Informes se revisa después de sus productores. La composición del proyecto se ajusta cuando cada módulo necesita una operación transaccional sobre el estado vigente.

La estructura objetivo por dominio es `domain/` para tipos y reglas puras, `application/` para operaciones y contratos, `infrastructure/` para almacenamiento y APIs externas y `presentation/` para React y sus efectos. Los puntos de entrada públicos deben evitar que otros módulos dependan de componentes internos. `shared/` no importa funcionalidades.

Se mantiene un solo agregado del proyecto. Las escrituras deben persistir antes de comunicar éxito y rechazar comandos invalidados por reset o recuperación. Cámara, audio, temporizadores y eventos permanecen en adaptadores o presentación, con su liberación al salir.

Este objetivo se documentó antes de iniciar los movimientos. Las instrucciones vigentes se encuentran en [Arquitectura](../../arquitectura.md); este documento conserva el plan y los resultados del trabajo.

## Avance verificado

| Módulo | Separación | Verificación | Límites |
| --- | --- | --- | --- |
| Personas, empatía y escenarios | Tipos y validaciones en dominio, operaciones sobre el proyecto vigente, adaptador transaccional y presentación | 38 pruebas pertinentes, 30 E2E; lint y compilación | Los métodos históricos del store conservan su política de datos antiguos; el formulario usa validación completa. |
| Conceptos y patrones | Puntuaciones, observaciones y duplicados en dominio; registro separado de la interfaz | 29 pruebas pertinentes, 81 E2E; lint y compilación | Las demostraciones conservan sus límites didácticos; no certifican accesibilidad ni infieren emociones. |
| Evaluación y cuestionarios | Entidades, hallazgos, tareas, SUS y Raw TLX; operaciones sobre el mismo proyecto | 23 pruebas pertinentes, 9 E2E; lint y compilación | Se mantienen datos y hallazgos antiguos, sin imponerles metadatos nuevos. |
| Experimentos | Geometría, ensayos y agregados puros; registro separado del reloj y controles | 9 pruebas pertinentes, 3 E2E; lint y compilación | Mediciones locales, dependientes del dispositivo y la tarea; práctica excluida. |
| IA y chatbots | Revisión, incorporación, rúbrica y progresión; proveedores y temporizador aislados | 9 pruebas pertinentes, 12 E2E; lint y compilación | IA local y revisión humana; no se prueba un proxy real ni se añade servicio. |
| Seguimiento y multimodal | Geometría, muestras, validación y comandos puros; persistencia y navegador separados | 31 pruebas pertinentes, 48 E2E; lint y compilación | Cámara simulada; hardware físico, precisión real, voz y háptica requieren revisión manual. |
| Informes | Colecciones, comparaciones, unidades y bloques; borradores y exportación separados de formatos traducidos y componentes | 30 pruebas pertinentes, 42 E2E; lint y compilación | Se mantiene el guardado explícito; impresión física y revisión académica final son manuales. |
| Proyecto y accesibilidad | Agregado, respaldo, operaciones, almacenamiento, composición y efectos sensoriales separados | 32 pruebas pertinentes; 5 de transacciones/checklist; 27 E2E; lint y compilación | Sin sincronización entre pestañas. Lectores de pantalla y LSC requieren validación manual. |

Las pruebas de etapas se solapan y sus cantidades no deben sumarse como casos diferentes. Todos los grupos solicitados están separados; la regresión global figura a continuación. Dashboard, dispositivos, métricas, curso y calidad conservan sus pantallas y solo actualizan imports: no se declaran migraciones adicionales.

## Verificación global

- Suite unitaria completa: 158 pruebas aprobadas en 27 archivos. Se repite sobre las entradas públicas finales y se conserva un JUnit local en `tests/results/vitest.xml`.
- Lint y compilación correctos. Vite mantiene la advertencia no bloqueante por el paquete principal, aproximadamente 845 kB.
- Dependencias: 223 módulos, imports/reexports de tipos incluidos; cero ciclos, cero accesos internos prohibidos y cero dependencias transitivas prohibidas en dominio/aplicación. `shared/` no depende de funcionalidades. Comando: `node tests/tools/check-architecture.cjs`.
- Regresión nueva de fallos de escritura y reintentos: 27 casos aprobados en escritorio, tableta y celular. Cubre investigación, conceptos, patrones, cuestionarios, experimentos, IA, chatbots, seguimiento y multimodal. Verifica almacenamiento sin cambios, formularios conservados, reintento y recarga.
- Suite E2E completa: 390 aprobadas y 3 omisiones existentes, sin fallos, en 11,9 minutos. Cubre seis idiomas, cuatro temas, teclado, adaptación visual, zoom, impresión/exportaciones, reservas, todos los módulos migrados, persistencia, reset y recuperación. El HTML local está en `tests/reports/playwright/index.html`.
- Auditoría de integridad: 39 archivos de pruebas/fixtures anteriores conservan sus cuerpos y aserciones; solo cambian imports. Se comprueban 27 recursos de traducción y 10 configuraciones/README, sin alteración de contenido ni dependencias. No hay resultados, reportes generados ni herramientas locales versionados.
- Enlaces de la documentación afectada correctos; `git diff --check` sin errores.

La comprobación completa usa `npm run test:e2e -- --workers=3`. Los casos nuevos, añadidos después del descubrimiento de esa ejecución, se verifican mediante `npm run test:e2e -- tests/e2e/module-persistence.spec.ts --workers=3 --reporter=line --output=tests/results/module-persistence`. Son casos diferentes: los 420 casos actuales quedan ejecutados con 417 aprobados y 3 omisiones en esas dos ejecuciones. No se suman las ejecuciones parciales anteriores. Las salidas permanecen ignoradas.

## Límites y estado de entrega

Se conservan las omisiones existentes del zoom real por extensión en tableta/celular y de validación de cámara en celular. Los dobles de cámara no verifican hardware, iluminación ni precisión real. Quedan pendientes cámara, micrófono, audio, háptica y reconocimiento físicos, lector de pantalla, comprensión con personas, impresión física y validación de LSC. No se ejecutan Selenium, Katalon ni Lighthouse como herramientas independientes.

El análisis estático no cubre imports construidos mediante cadenas en ejecución. Se conserva almacenamiento local sin bloqueo ni sincronización entre pestañas. La inicialización no sobrescribe comandos ejecutados desde efectos hijos, y reset/recuperación invalidan comandos y lecturas pendientes según su generación o token de operación.

No se añaden dependencias, backend, base de datos ni CRUD de usuarios. El cierre se realiza mediante commit local autorizado, tras revisar el diff y las exclusiones. No se hace push ni publicación.
