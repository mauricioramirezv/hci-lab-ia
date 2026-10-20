# Arquitectura

HCI Lab + IA usa React, TypeScript y Vite. Es una aplicación front-end sin base de datos: conserva el proyecto académico en `localStorage`, permite importar/exportar JSON y se publica mediante GitHub Pages.

## Capas

La [estructura del repositorio](estructura.md) asigna entrada y composición a `src/app/`, funcionalidades a `src/features/` y UI/utilidades compartidas a `src/shared/`. Las responsabilidades siguientes describen el funcionamiento existente; no requieren capas adicionales de carpetas.

1. **Dominio:** citas, personas, escenarios, hallazgos, sesiones y eventos tipados.
2. **Estado:** `ProjectProvider` aplica CRUD y persistencia local versionada.
3. **Experiencia:** flujo real, patrones, dispositivos, accesibilidad e instrumentos UX.
4. **Evaluación:** heurísticas humanas y propuestas de IA con validación o rechazo.
5. **Evidencia:** métricas derivadas, JSON del proyecto y CSV de indicadores.
6. **IA:** contrato `AiProvider`, proveedor local y adaptador para proxy seguro.
7. **Calidad:** Vitest, Testing Library, Playwright, Selenium, axe, Lighthouse y Katalon.

El proveedor de IA es simulado para evitar exponer claves. Un proveedor real debe implementar el contrato `AiProvider` mediante un servicio seguro y configurarse con `VITE_AI_PROXY_URL`. La clave permanece exclusivamente en el servidor.

## Flujo de datos

`Interacción → acción del store → localStorage → cálculo de métricas → exportación`.

Los videos LSC nunca se suben ni se conservan: la URL temporal existe solo durante la sesión. La muestra debe ser validada por una persona competente en Lengua de Señas Colombiana.


## Multimodal

`src/app/App.tsx` registra la ruta; `src/features/multimodal/MultimodalPage.tsx` coordina selección, demostraciones y evidencias. Componentes separados implementan color, comparación, smartwatch, vehículo, voz y respuestas hápticas/sonoras. `ConceptActivity.tsx` registra observaciones humanas como hallazgos. Los recursos JSON se añaden a i18next.

`ProjectState.multimodalEvidence` es opcional para mantener compatibilidad con JSON de v2. El store añade evidencias mediante actualizaciones funcionales, conserva los datos anteriores y utiliza el almacenamiento/exportación ya existente.

El modelo, el store y los respaldos se encuentran en `src/features/project/`. `src/app/i18n.ts` registra los recursos de los seis idiomas sin cambiar sus claves. Las [pruebas y sus recursos](pruebas.md) están centralizados en `tests/`.
