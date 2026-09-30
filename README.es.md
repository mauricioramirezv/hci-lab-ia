# HCI Lab + IA — 2.2.0

Laboratorio educativo React + TypeScript para estudiar UX, usabilidad, accesibilidad, awareness, engagement ético, emociones, cognición, ergonomía, diseño universal e IA responsable.

## Inicio rápido

Requiere Node.js 22 y npm.

```powershell
npm ci
npm run dev
```

Abra la URL que muestre Vite. La nueva página está en `#/multimodal`.

## Módulos

| Ruta | Propósito |
|---|---|
| `#/` | Inicio y estado del proyecto |
| `#/lab` | Reserva de citas y comparación de prácticas |
| `#/concepts` | Once conceptos, ejemplos, correcciones, herramientas y actividades |
| `#/research` | Personas y escenarios |
| `#/practices` | Buenas y malas prácticas |
| `#/devices` | Laboratorio multiformato original |
| `#/multimodal` | Ocho contextos de dispositivo, color, voz, sonido, vibración y evidencia |
| `#/accessibility` | Preferencias de lectura, contraste y asistencia |
| `#/evaluation` | Hallazgos humanos y propuestas IA pendientes de validación |
| `#/user-testing` | Sesiones de prueba y cuestionario SUS |
| `#/metrics` | Métricas a partir de registros del proyecto |
| `#/ai` | Proveedor IA simulado y revisable |
| `#/quality` | Calidad y automatización |
| `#/course` | Evolución por clases |

## Ecosistema multimodal

- PC, tableta y celular: confirmación y cancelación de una cita en marcos de distinto tamaño.
- Smartwatch: acción breve, estado y comparación de densidad visual.
- Vehículo: navegación y llamada simuladas; en buena práctica se bloquean controles visuales durante movimiento simulado. Permanece la alternativa escrita a los comandos de voz. No es un sistema automotriz ni una validación de seguridad vial.
- TV: reproducción simulada; controles HTML utilizables con teclado. No emula un sistema de control remoto nativo.
- Kiosco: solicitud de turno simulada.
- IoT: luz virtual con estado explícito. No conecta dispositivos físicos.
- Tabla comparativa: atención, entrada, ergonomía, riesgo y adaptación accesible por contexto.

Los filtros de protanopia, deuteranopia, tritanopia y acromatopsia afectan una muestra de estados. Son aproximaciones RGB educativas; no reproducen la percepción individual, no modifican toda la aplicación y no certifican accesibilidad. Compare mala práctica (color solo) y buena práctica (color + texto + símbolo).

Voz: síntesis de estado y reconocimiento opcional, más comando escrito. El micrófono se activa únicamente al pulsar su botón. El navegador puede procesar audio mediante un servicio externo: consulte el aviso previo. Vibración y sonido se activan por botones separados y conservan una respuesta visual. La API puede estar disponible sin que exista respuesta física perceptible; el usuario debe verificarlo.

## Evidencia y continuidad

En Multimodal seleccione contexto, práctica y filtro, pruebe la tarea y canales, escriba una observación y registre confianza autoinformada de 1 a 5. Las evidencias se guardan dentro de `multimodalEvidence` en el mismo proyecto, con fecha y respuestas observadas. Se conservan al recargar y en exportación/importación JSON. Los proyectos anteriores sin ese campo siguen funcionando; se mantiene la versión 2 del esquema para no perder datos.

En Conceptos, expanda cada actividad, compare las prácticas y registre una observación. Se guarda como hallazgo humano pendiente en Evaluación. Las herramientas indicadas son recursos para realizar la evaluación, no integraciones automáticas. Seleccionar buena práctica no genera una puntuación ni demuestra mejora.

## Idiomas

El nuevo módulo Multimodal y su tabla tienen textos en español, inglés, portugués y francés. Las actividades educativas de Conceptos y algunas páginas heredadas permanecen en español; el selector global no implica traducción completa del contenido educativo.

## Verificación

```powershell
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Las pruebas E2E usan escritorio Chromium y emulación Pixel 7. La emulación no valida voz ni vibración en hardware real. Los controles de APIs ausentes se verifican en pruebas unitarias; sonido, voz y vibración deben comprobarse también en el dispositivo de destino.

## Publicar en GitHub

Siga [ACTUALIZAR_WINDOWS.md](ACTUALIZAR_WINDOWS.md). La copia no publica cambios; primero pruebe, haga commit e integre la rama en `main`. El workflow existente despliega GitHub Pages al recibir el push de `main`.

## Referencias

- [WCAG 1.4.1: uso del color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color)
- [MDN: Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)
- [MDN: SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
- [MDN: SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)

## Arquitectura y contribución

El código nuevo está en `src/components/multimodal/`; usa el contexto del proyecto en `src/store.tsx` y tipos aditivos en `src/domain.ts`. Consulte [docs/arquitectura.md](docs/arquitectura.md), [CONTRIBUTING.md](CONTRIBUTING.md) y [ACCESSIBILITY.md](ACCESSIBILITY.md).
