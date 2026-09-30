# HCI Lab + IA — estado de la versión 2

## Implementado

- Aplicación React + TypeScript responsive, instalable como repositorio GitHub.
- Proyecto persistente en el navegador, importación/exportación JSON.
- CRUD de citas y comparación ejecutable de buena/mala práctica.
- Personas, mapas de empatía y escenarios editables.
- Biblioteca de patrones y simulador para computador, tableta, celular y reloj.
- Temas claro, oscuro y alto contraste; texto 100–200 %, espaciado, reducción de movimiento y foco visible.
- Lista manual de accesibilidad, región viva y muestra local opcional de video LSC con transcripción.
- Evaluación de Nielsen humana + IA simulada, severidad 0–4 y validación/rechazo.
- Sesiones UX con éxito, tiempo, errores, SEQ, emoción y SUS.
- Métricas derivadas de eventos y evidencias; exportación CSV.
- Contrato para integrar IA mediante proxy seguro.
- Cuatro idiomas en navegación, controles globales y flujo principal; cuatro README localizados.
- Vitest, Testing Library, Playwright, Selenium, axe-core, Lighthouse CI y ejemplo Katalon.
- GitHub Actions para calidad, E2E/accesibilidad y despliegue en Pages.

## Verificación realizada

- `npm run lint`: aprobado sin advertencias.
- `npm test`: 4 pruebas aprobadas.
- `npm run build`: compilación de producción aprobada.
- Playwright/axe: casos configurados; requieren `npx playwright install chromium` en una máquina con acceso a la descarga. GitHub Actions realiza este paso.

## Límites deliberados

- No hay backend ni autenticación: es un laboratorio front-end educativo.
- El proveedor IA predeterminado es local. Una IA real requiere proxy seguro y revisión humana.
- La lista automatizada de accesibilidad no demuestra conformidad WCAG; se complementa con pruebas manuales y con personas.
- La aplicación no crea señas. El video LSC debe ser producido o validado por una persona competente.
