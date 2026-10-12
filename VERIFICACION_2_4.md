# Verificación 2.4

- Base comprobada: GitHub main, e2e4907, versión 2.2.0.
- Entorno de ejecución: Node 24.19, npm 11, Linux.
- Lint: correcto, sin advertencias.
- Unitarias: 19 aprobadas en 5 archivos.
- E2E: 33 aprobadas, 1 omitida. Chromium de escritorio y emulación Pixel 7.
- Prueba omitida: calibración de cámara con estimador simulado en móvil; se ejecutó en escritorio.
- Cámara: integración comprobada con estimador simulado (entrenamiento, validación independiente y apagado). No se comprobó una webcam física ni la precisión de un usuario real.
- Accesibilidad automática: sin infracciones serious/critical en las rutas comprobadas, incluidas las nuevas. No constituye certificación WCAG.
- Comprobación visual: seguimiento de página en escritorio y móvil.
- Compilación: TypeScript y Vite correctos; dependencias React/i18n separadas en chunks.
- Compatibilidad de datos: pruebas preservan persona y esquema anterior; campos de evidencia y telemetría son opcionales.
- Instalador: validación de hashes y archivos comprobada programáticamente contra base 2.2 y paquete 2.3; ejecución real de PowerShell pendiente en Windows.

La configuración de pruebas temporal usada en este entorno y el Chromium de verificación no forman parte del paquete. El proyecto conserva su configuración Playwright estándar; en Windows use `npx playwright install chromium`.

Pruebas principales: cancelación/restauración global; actividad de concepto con evidencia; separación de clics, scroll y simulación; Raw TLX; decisiones humano-IA; descarga de informe; cancelación y rúbrica de chatbot; ocho intentos experimentales; SUS completo; flujos anteriores de reserva y multimodalidad; cámara simulada y persistencia.
