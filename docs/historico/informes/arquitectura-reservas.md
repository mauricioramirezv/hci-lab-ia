# Separación de responsabilidades de reservas

Base de trabajo: commit `d4c6ce0`. El árbol estaba limpio al comenzar. El alcance se limita a reservas y a sus puntos de composición con el proyecto; los demás módulos no se declaran migrados.

## Cambios

- Los cuatro archivos planos de reservas se distribuyen en nueve archivos: `domain/` (tipos y reglas), `application/` (operaciones y contrato del repositorio), `infrastructure/` (adaptador del proyecto) y `presentation/` (los tres componentes existentes y un hook). No hay capas vacías ni carpetas duplicadas.
- Fechas, obligatoriedad, duplicados y cambios permitidos por estado dejan los componentes. El dominio devuelve códigos y no importa React, DOM, traducciones ni almacenamiento.
- Las operaciones permiten listar, consultar, crear, reprogramar y cancelar. Validan sobre el estado vigente dentro de la transacción del repositorio, con reloj e identificadores inyectados.
- El adaptador conserva el proyecto completo y sus otras colecciones; guarda con el mecanismo actual antes de publicar éxito. Una escritura fallida conserva el estado anterior. Los comandos anteriores a reset o recuperación se rechazan.
- La integración del store mantiene una referencia al mismo objeto del proyecto para resolver comandos consecutivos antes del siguiente render. No se introduce un segundo almacenamiento. También se usa ese objeto vigente al guardar borradores de informe para no perder una reserva creada en el mismo lote de actualizaciones.
- Se conserva la compatibilidad de los métodos anteriores del store y del tipo `Appointment`. Las rutas de la aplicación y del ejemplo multiformato solo actualizan sus imports.

Las claves de almacenamiento, el respaldo versión 2, los identificadores, `createdAt`, el historial de canceladas, las traducciones, las condiciones y preferencias visuales se mantienen. No se modifican dependencias, workflows, `public/` ni las otras funcionalidades. El ejemplo multiformato conserva su validación mínima de fechas; el catálogo conserva la validación completa. No se añaden backend, base de datos ni gestión de usuarios.

La [guía de arquitectura](../../arquitectura.md) documenta las dependencias y el recorrido interfaz → operación → persistencia.

## Verificación

- Lint: correcto.
- Pruebas unitarias completas: 133 aprobadas en 17 archivos. Incluyen 16 pruebas de reglas, operaciones y adaptador en Node, sin React ni navegador, y tres pruebas nuevas de integración con el store.
- Se repite la integración del store tras añadir la comprobación del catálogo de informes: 8 pruebas aprobadas. Las ejecuciones se solapan; no se suman como casos diferentes.
- Dependencias: 114 módulos analizados, incluidos imports de tipos; cero ciclos y cero dependencias prohibidas en dominio/aplicación de reservas. Comando: `node tests/tools/check-reservation-dependencies.cjs`.
- Compilación final: correcta. Vite conserva la advertencia no bloqueante por tamaño del paquete principal (aproximadamente 841 kB).
- Regresión E2E pertinente: 96 casos aprobados, sin omisiones ni fallos, en escritorio, tableta y celular. Incluye seis idiomas, cuatro temas, reservas históricas, duplicados, reprogramación, cancelación, almacenamiento fallido, reset y recuperación de respaldos con preferencias y otras colecciones.
- Compatibilidad final del ejemplo multiformato, su presencia en Informes y reintentos de almacenamiento: 6 casos aprobados en los tres perfiles. Tres se solapan con la regresión anterior; no deben sumarse como casos distintos. Se verifican también la ausencia de campos opcionales que el ejemplo no tenía y su política mínima de fechas.
- Tras ese ajuste de campos opcionales se repiten las operaciones y la integración del store: 14 pruebas aprobadas; lint y compilación correctos.

Comando de regresión: `npm run test:e2e -- tests/e2e/project-activities.spec.ts tests/e2e/project-activities-integrity.spec.ts tests/e2e/project-management.spec.ts tests/e2e/reservations-persistence.spec.ts tests/e2e/core-flow.spec.ts --workers=3`. Comprobación final: `npm run test:e2e -- tests/e2e/reservations-persistence.spec.ts --workers=3`.

El reporte local de los 96 casos se conserva en `tests/reports/archive/reservations-architecture-regression/`; el reporte de la comprobación final está en `tests/reports/playwright/`. Los resultados correspondientes están en `tests/results/`, fuera del seguimiento. La suite unitaria y E2E requirieron ejecución fuera de la restricción local de lectura de configuraciones de esbuild.

## Límites

La consistencia del repositorio se aplica a los comandos del proveedor actual. Se conserva el almacenamiento local existente; no se incorpora sincronización ni bloqueo entre pestañas o dispositivos. Los otros módulos conservan su persistencia previa; la confirmación de guardado antes de publicar una reserva se implementa para reservas. No se ejecuta la suite E2E completa del proyecto ni se declaran migrados los demás módulos.

La comprobación de dependencias cubre los imports y reexports estáticos y los imports dinámicos literales del código fuente actual, no dependencias construidas mediante cadenas en ejecución. No se valida hardware físico ni se ejecutan herramientas externas de Katalon, Selenium o Lighthouse. Las pruebas y resultados permanecen en `tests/`; las salidas generadas siguen ignoradas.

Cierre autorizado con commit local; no se hace push ni publicación. El ajuste de borradores solo conserva el estado vigente al guardar explícitamente: no cambia el formato ni añade comportamiento de Informes. Su regresión en StrictMode comprueba que una reserva y un evento creados en el mismo lote se conservan al guardar el borrador; las 8 pruebas del store vuelven a pasar en el cierre.
