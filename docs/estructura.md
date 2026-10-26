# Estructura del repositorio

## Objetivo y criterios

La organización se basa en funciones y dominios. Las rutas públicas, las claves de traducción y los formatos persistentes se conservan. Los identificadores históricos almacenados en los datos siguen aceptándose; no son nombres de módulos nuevos. Este documento se creó antes de iniciar los movimientos.

```text
src/
  app/                  entrada, navegación, composición, idioma y estilos globales
  features/
    project/            estado, respaldo y gestión del proyecto
    identity/           cuentas reales, sesión con cookie y perfil
    synchronization/    selección explícita, coordinación de envíos y adaptadores HTTP
    reservations/       dominio, operaciones, adaptador y presentación de reservas
    users/              registros ficticios del Laboratorio, separados de investigación
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
  tools/                auditoría PDF y comprobación de arquitectura
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

Solo se crean carpetas con contenido existente. Los archivos que mezclan pantallas se dividen conservando sus cuerpos; las utilidades se distribuyen por los símbolos que usan sus consumidores. Las capas y contratos actuales responden a operaciones concretas; no se añaden dependencias ni alias de importación.

## Comprobaciones al reubicar archivos

1. Registrar el estado recibido y conservar todos los cambios pendientes.
2. Actualizar imports y entradas públicas, comprobar dependencias, lint, pruebas y compilación antes de continuar con otro módulo.
3. Corregir documentación y enlaces; mantener las instrucciones vigentes separadas de los informes históricos.
4. Revisar la integridad de pruebas, traducciones, configuraciones y recursos; ejecutar la regresión E2E y documentar sus límites.

Las salidas y herramientas locales permanecen ignoradas. Los fixtures, ejemplos, traducciones y evidencias académicas seleccionadas se conservan.

## Dependencias prácticas

`app/` compone las rutas, el proveedor de proyecto y el de seguimiento. Cada dominio conserva sus componentes, modelos y traducciones propias. Los recursos de traducción que ya cubrían varios dominios se coordinan desde `app/locales/`, sin cambiar sus claves ni copiar sus textos.

`features/project/` mantiene el estado persistente y los respaldos. Los módulos que producen o consumen evidencias usan esos tipos. `features/evaluation/` conserva instrumentos y presentación de registros que también usan experimentos, IA y chatbots. `shared/` contiene únicamente UI de página/formulario, atributos de validación, estilos de formulario y exportación de archivos compartidos.

Los consumidores de otros módulos usan las entradas públicas de cada capa. Las entradas de formato sin componentes permiten usar exportaciones desde Node sin cargar React ni CSS.

Vite conserva la base `/hci-lab-ia/` y toma `src/app/main.tsx` desde `index.html`. Los comandos npm pasan la configuración de pruebas explícitamente. Pages sigue compilando `dist/` con el mismo workflow.

Reservas, investigación, conceptos, patrones, evaluación, experimentos, IA/chatbots, seguimiento/multimodal, informes y proyecto/accesibilidad separan responsabilidades por capas. Solo se crean las capas necesarias: los módulos que escriben evidencias usan la persistencia común. Los `index.ts` de cada capa son entradas públicas; las entradas de formato sin React se documentan en la [guía de arquitectura](arquitectura.md).
