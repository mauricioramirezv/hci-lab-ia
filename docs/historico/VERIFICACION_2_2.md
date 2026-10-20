# Verificación de entrega 2.2.0

Fecha: 2026-09-30. Base: los dos ZIP entregados tienen los mismos archivos al normalizar saltos de línea; ambos declaran versión 2.0.0. La actualización entregada declara 2.2.0.

| Comprobación | Resultado |
|---|---|
| npm ci | Dependencias instaladas |
| npm run lint | Aprobado, sin advertencias ESLint |
| npm test | 10/10 pruebas aprobadas |
| npm run build | TypeScript y Vite aprobados |
| Playwright escritorio y Pixel 7 emulado | 12/12 pruebas aprobadas |
| axe en laboratorio y módulo multimodal | Sin infracciones serias/críticas en los estados probados |

Las E2E se ejecutaron en Linux con Chromium 153 headless, mediante un ejecutable temporal del entorno; el proyecto conserva la configuración estándar de Playwright para CI y Windows. Se verificaron reserva, idioma, filtros, evidencia tras recarga, descarga JSON, bloqueo visual en vehículo, comandos escritos, acciones de los ocho dispositivos y ausencia de desbordamiento horizontal en los estados probados.

Las pruebas unitarias comprueban compatibilidad con datos anteriores, persistencia, observaciones humanas y respuestas honestas ante APIs no disponibles. La exportación utiliza el estado completo que incluye multimodalEvidence. La revisión visual de la nueva página se hizo en escritorio.

No se comprobó respuesta física de vibración, permisos reales de micrófono, un servicio real de reconocimiento de voz ni sonido perceptible por una persona. No hay certificación integral WCAG: axe cubre solo reglas automáticas y estados probados. Las simulaciones no controlan hardware externo. Las actividades de Conceptos y algunas páginas previas permanecen en español.

GitHub no se ha modificado desde este entorno. La guía y el script aplican archivos localmente; el usuario ejecuta commit, merge y push para actualizar main.
