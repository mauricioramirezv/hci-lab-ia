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
  - generic [ref=f1e5]:
    - banner [ref=f1e6]:
      - button "Abrir menú" [ref=f1e7] [cursor=pointer]
      - strong [ref=f1e10]: HCI Lab + IA
      - complementary [ref=f1e11]:
        - button "Seguimiento de página" [ref=f1e12] [cursor=pointer]
      - generic [ref=f1e13]:
        - button "Gestionar proyecto" [ref=f1e14] [cursor=pointer]
        - dialog [ref=f1e15]:
          - generic [ref=f1e16]:
            - heading "Gestionar proyecto" [level=2] [ref=f1e17]
            - button "Cerrar" [active] [ref=f1e18] [cursor=pointer]: ×
          - paragraph [ref=f1e19]: Respalde sus datos, recupere un archivo guardado o deje el laboratorio vacío.
          - generic [ref=f1e20]:
            - generic [ref=f1e21]:
              - heading "Descargar respaldo JSON" [level=3] [ref=f1e22]
              - paragraph [ref=f1e23]: Incluye todos los registros guardados, las preferencias de accesibilidad y el idioma. Las métricas se recalculan desde esos registros. Las actividades sin guardar no se incluyen.
              - button "Descargar respaldo JSON" [ref=f1e24] [cursor=pointer]
            - generic [ref=f1e25]:
              - heading "Recuperar respaldo" [level=3] [ref=f1e26]
              - paragraph [ref=f1e27]: Seleccione un JSON de proyecto versión 2 (máximo 25 MB). Se validará antes de solicitar confirmación; hasta entonces no se reemplaza nada.
              - generic [ref=f1e28] [cursor=pointer]:
                - text: Archivo JSON del proyecto
                - button "Archivo JSON del proyecto" [ref=f1e29]
            - generic [ref=f1e30]:
              - heading "Restablecer proyecto" [level=3] [ref=f1e31]
              - paragraph [ref=f1e32]: Borra los registros y reinicia las actividades y preferencias. Conserva el idioma seleccionado.
              - button "Restablecer proyecto" [ref=f1e33] [cursor=pointer]
      - generic [ref=f1e34]:
        - generic [ref=f1e39]: Idioma
        - combobox "Idioma" [ref=f1e40]:
          - option "ES" [selected]
          - option "EN"
          - option "PT"
          - option "FR"
          - option "IT"
          - option "CA"
      - button "Oscuro" [ref=f1e41] [cursor=pointer]
    - main [ref=f1e44]:
      - generic [ref=f1e46]:
        - text: EVIDENCIA ACADÉMICA
        - heading "Informes, sesiones y comparación" [level=1] [ref=f1e47]
        - paragraph [ref=f1e48]: Exporte resultados con contexto. Los datos de demostración se identifican y no cuentan como resultados de participantes.
      - generic [ref=f1e49]:
        - button "Exportar informe Markdown" [ref=f1e50] [cursor=pointer]
        - button "Imprimir / guardar PDF" [ref=f1e51] [cursor=pointer]
        - button "Exportar evidencias CSV" [ref=f1e52] [cursor=pointer]
      - generic [ref=f1e53]:
        - text: Filtrar por participante, tarea, versión o tipo
        - textbox "Filtrar por participante, tarea, versión o tipo" [ref=f1e54]
      - generic [ref=f1e55]:
        - heading "Comparación antes/después" [level=2] [ref=f1e56]
        - paragraph [ref=f1e57]: Seleccione registros del mismo participante, tarea y tipo. Justifique equivalencia de condiciones y cambios; no se calcula significancia estadística.
        - generic [ref=f1e58]:
          - text: Antes
          - combobox "Antes" [ref=f1e59]:
            - option "Seleccione evidencia" [selected]
        - generic [ref=f1e60]:
          - text: Después
          - combobox "Después" [ref=f1e61]:
            - option "Seleccione evidencia" [selected]
        - generic [ref=f1e62]:
          - text: Hallazgo, corrección, interpretación y limitaciones
          - textbox "Hallazgo, corrección, interpretación y limitaciones" [ref=f1e63]
        - button "Guardar comparación" [disabled] [ref=f1e64]
        - status
      - generic [ref=f1e65]:
        - heading "Sesiones guardadas · 0" [level=2] [ref=f1e66]
        - paragraph [ref=f1e67]: Todavía no hay sesiones guardadas. Prepare una captura para obtener muestras.
      - heading "Sesiones de página" [level=2] [ref=f1e69]
      - heading "Sesiones del área de ejemplos" [level=2] [ref=f1e71]
      - region [ref=f1e73]:
        - heading "Observaciones de patrones" [level=2] [ref=f1e74]
        - paragraph [ref=f1e75]: Texto escrito por el estudiante; no es una medición automática.
        - paragraph [ref=f1e76]: No hay observaciones de patrones guardadas que coincidan con el filtro.
      - heading "Evidencias guardadas" [level=2] [ref=f1e78]
      - generic [ref=f1e79]:
        - heading "Informe académico" [level=2] [ref=f1e80]
        - generic [ref=f1e81]: "# HCI Lab + IA — Informe académico Generado: 2026-10-10T20:44:49.038Z ## Contexto y alcance Proyecto local de aprendizaje y evaluación. Identifique objetivos, contexto y limitaciones en las evidencias de cada tarea. ## Resumen de registros Personas: 0; escenarios: 0; hallazgos: 0; sesiones UX: 0; evidencias adicionales: 0. SUS medio: 0/100 (no es un porcentaje de conformidad). Tiempo medio de flujos completados: 0 s. Discrepancia humano-IA: sin decisiones. ## Personas y escenarios ## Hallazgos y correcciones ## Pruebas UX y SUS ## Actividades, carga de trabajo y comparaciones ## Telemetría de páginas ## Telemetría del área de ejemplos ## Evidencia multimodal ## Limitaciones Scroll no demuestra lectura; cursor no demuestra mirada. Recorridos simulados no son mediciones humanas. Webcam ofrece estimaciones dependientes de calibración. Las tareas didácticas y cuestionarios no certifican accesibilidad. Raw TLX usa el promedio sin ponderación de seis dimensiones. No se infieren emociones desde la cámara. ## Referencias - WCAG 2.2: https://www.w3.org/TR/WCAG22/ - NASA-TLX: https://www.nasa.gov/human-systems-integration-division/nasa-task-load-index-tlx/ - Microsoft HAI: https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/ - Google PAIR: https://pair.withgoogle.com/guidebook/ - WebGazer: https://webgazer.cs.brown.edu/"
```