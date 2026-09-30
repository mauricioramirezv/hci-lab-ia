# HCI Lab + IA

[Español](README.es.md) · [English](README.en.md) · [Português](README.pt-BR.md) · [Français](README.fr.md)

Laboratorio front-end, multiformato y multilenguaje para enseñar, aplicar y evaluar Interacción Humano–Computador, UX, accesibilidad e inteligencia artificial.

## Funcionalidades

- Sistema funcional de reserva de citas: crear, reprogramar y cancelar.
- Proyecto persistente con importación/exportación JSON y datos versionados.
- Constructor de personas, mapa de empatía y escenarios de uso.
- Modos de buena práctica, mala práctica y comparación.
- Vistas para computador, tableta, celular y reloj.
- Español, inglés, portugués y francés en tiempo de ejecución.
- Centro de accesibilidad: temas claro/oscuro, alto contraste, texto 100–200 %, espaciado, lectura accesible y reducción de movimiento.
- Demostración de lector de pantalla y componente para un video breve validado en LSC.
- Once áreas de IHC: UX, usabilidad, accesibilidad, awareness, engagement, emociones, ergonomía, cognición, arquitectura, inclusión e IA responsable.
- Evaluación de las diez heurísticas de Nielsen: evidencia, severidad 0–4, recomendación, fuente y estado.
- Comparación humano–IA con validación o rechazo de propuestas.
- Instrumentos SUS, SEQ, éxito, tiempo, errores y emoción por participante.
- Métricas calculadas desde eventos y evidencias; exportación CSV.
- AI Studio con proveedor local, contrato extensible y conexión opcional mediante proxy seguro.
- Pruebas con Vitest, Testing Library, Playwright, Selenium, axe-core y guía de Katalon.
- Despliegue automático en GitHub Pages.

## Requisitos

- Node.js 22 o superior.
- npm 10 o superior.

## Instalación

```bash
git clone https://github.com/mauricioramirezv/hci-lab-ia.git
cd hci-lab-ia
npm install
npm run dev
```

## Verificación

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Rutas

| Ruta | Propósito |
|---|---|
| `#/` | Panel del proyecto y progreso |
| `#/lab` | Flujo funcional, comparación y gestión de citas |
| `#/concepts` | Mapa de conceptos de IHC y UX |
| `#/research` | Personas, empatía y escenarios |
| `#/practices` | Biblioteca comparativa de patrones |
| `#/devices` | Laboratorio multiformato |
| `#/accessibility` | Preferencias y demostraciones accesibles |
| `#/evaluation` | Heurísticas humanas y con IA |
| `#/user-testing` | Sesiones, SUS, SEQ, emoción y desempeño |
| `#/metrics` | Métricas y exportación |
| `#/ai` | Generación simulada con IA |
| `#/quality` | Estrategia y automatización de calidad |
| `#/course` | Evolución de las ocho clases |

## GitHub Pages

En GitHub, abra **Settings → Pages → Source → GitHub Actions**. Cada actualización de `main` compilará y publicará la aplicación.

## Seguridad e IA

No guarde claves en el front-end. Copie `.env.example` y configure únicamente la URL de un proxy seguro; la clave permanece en el servidor. Toda salida de IA requiere revisión humana.

## Datos locales

El proyecto se conserva en el navegador. Use **Exportar proyecto** antes de borrar datos del sitio o cambiar de equipo. El archivo JSON puede importarse nuevamente. No use datos personales reales en actividades de clase.

## Accesibilidad

La meta educativa es WCAG 2.2 AA. Las pruebas automatizadas se complementan con teclado, ampliación, lector de pantalla y evaluación con personas.

## Licencia

MIT.
