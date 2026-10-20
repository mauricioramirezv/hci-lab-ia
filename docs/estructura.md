# Estructura del repositorio

## Objetivo y criterios

La organización se basa en funciones y dominios. Las rutas públicas, las claves de traducción y los formatos persistentes se conservan. Los identificadores históricos almacenados en los datos siguen aceptándose; no son nombres de módulos nuevos. Este documento se creó antes de iniciar los movimientos.

```text
src/
  app/                  entrada, navegación, composición, idioma y estilos globales
  features/
    project/            estado, respaldo y gestión del proyecto
    reservations/       flujo de reserva y ejemplos de citas
    research/           personas, empatía y escenarios
    concepts/           catálogo y actividades de conceptos
    patterns/           catálogo y actividades de patrones
    devices/            adaptación por dispositivo
    multimodal/         simuladores y canales de interacción
    tracking/           captura, calibración y mapas
    evaluation/         hallazgos, instrumentos y sesiones de evaluación
    experiments/        medición Fitts y Hick
    ai/                 propuestas y revisión humana
    chatbots/           conversación y rúbricas
    reports/            catálogo, comparación y exportación
    metrics/            indicadores del proyecto
    accessibility/      preferencias y demostraciones accesibles
    dashboard/          estado inicial y ejemplos del proyecto
    course/             contenidos del curso
    quality/            explicación de herramientas de calidad
  shared/               UI y utilidades realmente usadas por varios dominios
tests/
  unit/                 pruebas unitarias y de componentes
  e2e/                  recorridos Playwright y ejemplo Selenium
  fixtures/             proyectos y extensión de zoom usados solo por pruebas
  katalon/              proyecto y recursos de la alternativa Katalon
  tools/                auditoría de los PDF producidos por pruebas
  playwright.config.ts  descubrimiento E2E, servidor y reportes
  vitest.config.ts      entorno unitario y configuración de cobertura
  lighthouserc.json     configuración de la revisión opcional de rendimiento
  results/              resultados y archivos locales ignorados
  reports/              reportes HTML ignorados
docs/
  README.md             índice breve de instrucciones vigentes
  evidencias/           capturas seleccionadas, agrupadas por funcionalidad
  historico/            paquetes antiguos e informes de trabajo separados
scripts/                scripts propios ajenos a pruebas
```

Solo se crean carpetas con contenido existente. Los archivos que mezclan pantallas se dividen conservando sus cuerpos; las utilidades se distribuyen por los símbolos que usan sus consumidores. No se introducen servicios, repositorios, alias de importación ni capas nuevas.

## Etapas verificables

1. Registrar el estado recibido y una copia de los archivos que se van a mover. Centralizar pruebas, recursos y configuraciones; comprobar descubrimiento y pruebas unitarias.
2. Reubicar la aplicación por dominio, separar las pantallas de `pages.tsx` y eliminar agrupaciones cronológicas. Actualizar imports y la entrada de Vite. Comprobar lint, pruebas unitarias y compilación.
3. Consolidar las instrucciones actuales y separar informes históricos. Nombrar evidencias por función, corregir referencias y verificar enlaces.
4. Comprobar integridad contra el estado recibido y ejecutar la regresión E2E. Documentar resultados y límites sin publicar.

Las copias locales y el inventario del estado recibido se conservan fuera del seguimiento. Las bajas de generados que ya estaban en el índice no se deshacen ni se mezclan con nuevos cambios de contenido.

## Dependencias prácticas

`app/` compone las rutas, el proveedor de proyecto y el de seguimiento. Cada dominio conserva sus componentes, modelos y traducciones propias. Los recursos de traducción que ya cubrían varios dominios se coordinan desde `app/locales/`, sin cambiar sus claves ni copiar sus textos.

`features/project/` mantiene el estado persistente y los respaldos. Los módulos que producen o consumen evidencias usan esos tipos. `features/evaluation/` conserva instrumentos y presentación de registros que también usan experimentos, IA y chatbots. `shared/` contiene únicamente UI de página/formulario, atributos de validación, estilos de formulario y exportación de archivos compartidos.

Las pantallas antes reunidas en un único archivo se ubican en su dominio. Se conservan las demostraciones anteriores y se eliminan tres archivos que solo reenviaban exportaciones; sus consumidores importan los componentes concretos con el mismo nombre local.

Vite conserva la base `/hci-lab-ia/` y toma `src/app/main.tsx` desde `index.html`. Los comandos npm pasan la configuración de pruebas explícitamente. Pages sigue compilando `dist/` con el mismo workflow.
