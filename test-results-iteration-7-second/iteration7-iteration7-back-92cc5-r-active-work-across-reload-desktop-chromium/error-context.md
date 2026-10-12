# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: iteration7.spec.ts >> iteration7: backup recovery, reports and reset clear active work across reload
- Location: tests\e2e\iteration7.spec.ts:13:1

# Error details

```
Error: locator.setInputFiles: InvalidCharacterError: Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.
    at <anonymous>:7579:37
    at Array.map (<anonymous>)
    at InjectedScript.setInputFiles (<anonymous>:7578:28)
    at eval (eval at evaluate (:311:30), <anonymous>:1:39)
    at UtilityScript.evaluate (<anonymous>:313:16)
    at UtilityScript.<anonymous> (<anonymous>:1:44)
Call log:
  - waiting for locator('dialog input[type=file]')
    - locator resolved to <input type="file" accept=".json,application/json"/>

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - link "Saltar al contenido" [ref=f1e4] [cursor=pointer]:
    - /url: "#main-content"
  - complementary "Navegación principal" [ref=f1e5]:
    - generic [ref=f1e6]:
      - generic [ref=f1e7]: H+
      - generic [ref=f1e8]:
        - strong [ref=f1e9]: HCI Lab + IA
        - generic [ref=f1e10]: UX · A11y · AI
    - navigation [ref=f1e11]:
      - generic [ref=f1e12]:
        - heading "Inicio y aprendizaje" [level=2] [ref=f1e13]
        - link "Inicio" [ref=f1e14] [cursor=pointer]:
          - /url: "#/"
        - link "Conceptos" [ref=f1e19] [cursor=pointer]:
          - /url: "#/concepts"
        - link "Curso" [ref=f1e31] [cursor=pointer]:
          - /url: "#/course"
      - generic [ref=f1e36]:
        - heading "Diseñar y explorar" [level=2] [ref=f1e37]
        - link "Laboratorio" [ref=f1e38] [cursor=pointer]:
          - /url: "#/lab"
        - link "Personas" [ref=f1e42] [cursor=pointer]:
          - /url: "#/research"
        - link "Prácticas" [ref=f1e49] [cursor=pointer]:
          - /url: "#/practices"
        - link "Dispositivos" [ref=f1e55] [cursor=pointer]:
          - /url: "#/devices"
        - link "Interacción multimodal" [ref=f1e59] [cursor=pointer]:
          - /url: "#/multimodal"
        - link "Experimentos" [ref=f1e63] [cursor=pointer]:
          - /url: "#/experiments"
      - generic [ref=f1e67]:
        - heading "Evaluar y medir" [level=2] [ref=f1e68]
        - link "Seguimiento UX" [ref=f1e69] [cursor=pointer]:
          - /url: "#/tracking"
        - link "Informes y evidencias" [ref=f1e74] [cursor=pointer]:
          - /url: "#/reports"
        - link "Accesibilidad" [ref=f1e78] [cursor=pointer]:
          - /url: "#/accessibility"
        - link "Evaluación" [ref=f1e86] [cursor=pointer]:
          - /url: "#/evaluation"
        - link "Pruebas UX" [ref=f1e91] [cursor=pointer]:
          - /url: "#/user-testing"
        - link "Métricas" [ref=f1e96] [cursor=pointer]:
          - /url: "#/metrics"
      - generic [ref=f1e100]:
        - heading "Herramientas y calidad" [level=2] [ref=f1e101]
        - link "Evaluación de chatbots" [ref=f1e102] [cursor=pointer]:
          - /url: "#/chatbots"
        - link "IA" [ref=f1e107] [cursor=pointer]:
          - /url: "#/ai"
        - link "Calidad" [ref=f1e112] [cursor=pointer]:
          - /url: "#/quality"
    - generic [ref=f1e117]: WCAG · Nielsen · SUS · E2E
  - generic [ref=f1e122]:
    - banner [ref=f1e123]:
      - generic [ref=f1e124]:
        - strong [ref=f1e125]: HCI Lab + IA
        - generic [ref=f1e126]: Laboratorio evolutivo de interacción humano-computador
      - complementary [ref=f1e127]:
        - button "Seguimiento de página" [ref=f1e128] [cursor=pointer]
      - generic [ref=f1e129]:
        - button "Gestionar proyecto" [ref=f1e130] [cursor=pointer]
        - dialog [ref=f1e131]:
          - generic [ref=f1e132]:
            - heading "Gestionar proyecto" [level=2] [ref=f1e133]
            - button "Cerrar" [active] [ref=f1e134] [cursor=pointer]: ×
          - paragraph [ref=f1e135]: Respalde sus datos, recupere un archivo guardado o deje el laboratorio vacío.
          - generic [ref=f1e136]:
            - generic [ref=f1e137]:
              - heading "Descargar respaldo JSON" [level=3] [ref=f1e138]
              - paragraph [ref=f1e139]: Incluye todos los registros guardados, las preferencias de accesibilidad y el idioma. Las métricas se recalculan desde esos registros. Las actividades sin guardar no se incluyen.
              - button "Descargar respaldo JSON" [ref=f1e140] [cursor=pointer]
            - generic [ref=f1e141]:
              - heading "Recuperar respaldo" [level=3] [ref=f1e142]
              - paragraph [ref=f1e143]: Seleccione un JSON de proyecto versión 2 (máximo 25 MB). Se validará antes de solicitar confirmación; hasta entonces no se reemplaza nada.
              - generic [ref=f1e144] [cursor=pointer]:
                - text: Archivo JSON del proyecto
                - button "Archivo JSON del proyecto" [ref=f1e145]
            - generic [ref=f1e146]:
              - heading "Restablecer proyecto" [level=3] [ref=f1e147]
              - paragraph [ref=f1e148]: Borra los registros y reinicia las actividades y preferencias. Conserva el idioma seleccionado.
              - button "Restablecer proyecto" [ref=f1e149] [cursor=pointer]
      - generic [ref=f1e150]:
        - generic [ref=f1e155]: Idioma
        - combobox "Idioma" [ref=f1e156]:
          - option "ES" [selected]
          - option "EN"
          - option "PT"
          - option "FR"
          - option "IT"
          - option "CA"
      - button "Oscuro" [ref=f1e157] [cursor=pointer]
    - main [ref=f1e160]:
      - generic [ref=f1e162]:
        - text: EVIDENCIA ACADÉMICA
        - heading "Informes, sesiones y comparación" [level=1] [ref=f1e163]
        - paragraph [ref=f1e164]: Exporte resultados con contexto. Los datos de demostración se identifican y no cuentan como resultados de participantes.
      - generic [ref=f1e165]:
        - button "Exportar informe Markdown" [ref=f1e166] [cursor=pointer]
        - button "Imprimir / guardar PDF" [ref=f1e167] [cursor=pointer]
        - button "Exportar evidencias CSV" [ref=f1e168] [cursor=pointer]
      - generic [ref=f1e169]:
        - text: Filtrar por participante, tarea, versión o tipo
        - textbox "Filtrar por participante, tarea, versión o tipo" [ref=f1e170]
      - generic [ref=f1e171]:
        - heading "Comparación antes/después" [level=2] [ref=f1e172]
        - paragraph [ref=f1e173]: Seleccione registros del mismo participante, tarea y tipo. Justifique equivalencia de condiciones y cambios; no se calcula significancia estadística.
        - generic [ref=f1e174]:
          - text: Antes
          - combobox "Antes" [ref=f1e175]:
            - option "Seleccione evidencia" [selected]
        - generic [ref=f1e176]:
          - text: Después
          - combobox "Después" [ref=f1e177]:
            - option "Seleccione evidencia" [selected]
        - generic [ref=f1e178]:
          - text: Hallazgo, corrección, interpretación y limitaciones
          - textbox "Hallazgo, corrección, interpretación y limitaciones" [ref=f1e179]
        - button "Guardar comparación" [disabled] [ref=f1e180]
        - status
      - generic [ref=f1e181]:
        - heading "Sesiones guardadas · 0" [level=2] [ref=f1e182]
        - paragraph [ref=f1e183]: Todavía no hay sesiones guardadas. Prepare una captura para obtener muestras.
      - heading "Sesiones de página" [level=2] [ref=f1e185]
      - heading "Sesiones del área de ejemplos" [level=2] [ref=f1e187]
      - region [ref=f1e189]:
        - heading "Observaciones de patrones" [level=2] [ref=f1e190]
        - paragraph [ref=f1e191]: Texto escrito por el estudiante; no es una medición automática.
        - paragraph [ref=f1e192]: No hay observaciones de patrones guardadas que coincidan con el filtro.
      - heading "Evidencias guardadas" [level=2] [ref=f1e194]
      - generic [ref=f1e195]:
        - heading "Informe académico" [level=2] [ref=f1e196]
        - generic [ref=f1e197]: "# HCI Lab + IA — Informe académico Generado: 2026-10-10T20:43:59.777Z ## Contexto y alcance Proyecto local de aprendizaje y evaluación. Identifique objetivos, contexto y limitaciones en las evidencias de cada tarea. ## Resumen de registros Personas: 0; escenarios: 0; hallazgos: 0; sesiones UX: 0; evidencias adicionales: 0. SUS medio: 0/100 (no es un porcentaje de conformidad). Tiempo medio de flujos completados: 0 s. Discrepancia humano-IA: sin decisiones. ## Personas y escenarios ## Hallazgos y correcciones ## Pruebas UX y SUS ## Actividades, carga de trabajo y comparaciones ## Telemetría de páginas ## Telemetría del área de ejemplos ## Evidencia multimodal ## Limitaciones Scroll no demuestra lectura; cursor no demuestra mirada. Recorridos simulados no son mediciones humanas. Webcam ofrece estimaciones dependientes de calibración. Las tareas didácticas y cuestionarios no certifican accesibilidad. Raw TLX usa el promedio sin ponderación de seis dimensiones. No se infieren emociones desde la cámara. ## Referencias - WCAG 2.2: https://www.w3.org/TR/WCAG22/ - NASA-TLX: https://www.nasa.gov/human-systems-integration-division/nasa-task-load-index-tlx/ - Microsoft HAI: https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/ - Google PAIR: https://pair.withgoogle.com/guidebook/ - WebGazer: https://webgazer.cs.brown.edu/"
```