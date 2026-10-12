# HCI Lab + IA 2.4 — ejecución local y actualización

Esta entrega contiene el proyecto completo, basado en main (e2e4907, versión 2.2), con los módulos de seguimiento 2.3 integrados y las ampliaciones 2.4. No publica ni modifica GitHub automáticamente.

## 1. Probar sin modificar su repositorio

Requisito: Node.js 22.12 o posterior y npm. Descomprima el ZIP en `C:\Users\gramirez\Downloads\HCI_Lab_IA_V2-4`.

Abra PowerShell en esa carpeta y ejecute **cada comando por separado**:

```powershell
cd "$env:USERPROFILE\Downloads\HCI_Lab_IA_V2-4"
npm ci
npm run dev
```

Abra la dirección que indique Vite, normalmente http://localhost:5173/hci-lab-ia/ . Detenga el servidor con Ctrl+C. No abra index.html directamente.

Los proyectos guardados en GitHub Pages no aparecen automáticamente en localhost: exporte allí el JSON e impórtelo en Inicio local si desea conservarlos. El esquema de proyecto sigue siendo versión 2, con campos opcionales nuevos.

## 2. Qué probar

1. **Restablecer proyecto**, en la barra superior: cancelación, confirmación y retorno al ejemplo inicial. Borra los registros guardados y restaura preferencias; no deja el proyecto vacío.
2. **Conceptos**: filtro por tres temáticas, once actividades interactivas, variantes buena/antipatrón, tiempos, errores y evidencia. Expanda “Probar concepto”.
3. **Prácticas**: catálogo filtrable, contexto, problema, solución y actividad relacionada.
4. **Seguimiento UX**: área de ejemplos con clics, scroll, cursor y cámara opcional.
5. **Seguimiento de página**, botón flotante: escriba participante y tarea; seleccione recorrido F, Gutenberg o personalizado; inicie, cierre el panel y use el contenido. Detenga, escriba observación y guarde. Cambiar ruta o dimensiones detiene la captura.
6. **Experimentos**: ocho intentos por condición para Fitts o Hick. Repita con otra condición y orden; guarde ambos resultados.
7. **Chatbots**: ejemplos guionizados A/B, generación progresiva, detener, editar y regenerar; rúbrica guardable.
8. **IA**: explicación de regla local, evidencia humana y aceptar/editar/rechazar con trazabilidad.
9. **Accesibilidad**: filtros visuales aproximados, objetivo oscilante, tamaño del objetivo, lectura TTS, señal sonora y vibración opcional. Conserva preferencias y verificación manual previas.
10. **Pruebas UX**: SUS requiere diez respuestas; conserva las respuestas y puntuación. Raw NASA-TLX requiere seis valores y contexto de tarea.
11. **Informes**: filtro de registros, comparación antes/después, eliminación de sesiones, Markdown, JSON, CSV y PDF mediante imprimir/guardar PDF del navegador.
12. **Inicio**: casos de exposición de cita médica y vehículo, sin resultados inventados.

## 3. Integrar después de revisar localmente

El ZIP incluye `Aplicar_2_4.ps1`, que copia únicamente archivos modificados y nuevos al repositorio. Verifica el contenido base antes de copiar; acepta la versión 2.2 del repositorio o los archivos del paquete 2.3 anterior. No sobreescribe conflictos silenciosamente.

```powershell
cd "$env:USERPROFILE\Downloads\hci-lab-ia-repositorio"
git switch main
git pull --ff-only origin main
git switch -c feature/actualizacion-2-4
powershell -NoProfile -ExecutionPolicy Bypass -File "$env:USERPROFILE\Downloads\HCI_Lab_IA_V2-4\Aplicar_2_4.ps1" -Repositorio "$env:USERPROFILE\Downloads\hci-lab-ia-repositorio"
```

Si ya existe la rama, use `git switch feature/actualizacion-2-4`. Si hay cambios locales pendientes, consérvelos en una rama/commit antes de aplicar; el instalador se detiene. Si falló npm después de copiar, revise el error y ejecute npm ci, npm run lint, npm test y npm run build desde el repositorio; no vuelva a copiar a ciegas.

Después de revisar:

```powershell
git add .
git commit -m "feat: ampliar HCI Lab con seguimiento, conceptos y evidencias v2.4"
git push -u origin feature/actualizacion-2-4
```

Integre mediante Pull Request a main cuando quiera publicar. GitHub Pages se actualiza con el workflow existente después de la integración. Este paquete no hace push ni merge.

## 4. Verificar en su equipo

```powershell
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## 5. Alcance y límites

- Seis idiomas seleccionables. Italiano/catalán cubren navegación, controles comunes, títulos temáticos y el módulo multimodal. **Los textos académicos, las actividades nuevas y los informes mantienen contenido en español**; no se presenta como traducción íntegra de todo el sitio. Las secciones en español declaran su idioma para lectores de pantalla.
- IA y chatbots son simulaciones locales guionizadas; no hay API de LLM ni evaluación automática de un modelo real.
- La captura global registra el contenido principal, excluye controles flotantes y navegación, y nunca registra valores de formularios. El scroll de paneles internos se evalúa en el módulo de ejemplos; la captura de página mide el scroll del documento.
- El mapa PNG exporta la capa de la ventana visible, no una captura completa del sitio. JSON conserva coordenadas de todo el recorrido. CSV de página incluye puntos y registros de scroll.
- Colores normalizados por capa: no comparar colores de distintos mapas como cantidades absolutas. Límite de 5000 registros por canal; se avisa cuando se truncan. Guardar muchos registros puede superar la cuota local; se conserva el estado en memoria y se ofrece exportarlo.
- Tiempo por tramo: exposición del borde superior de la ventana, muestreada cada 200 ms con pestaña visible. No demuestra lectura. Cursor, mirada estimada y simulación son canales separados.
- Cámara: requiere localhost o HTTPS, permiso explícito y acceso a CDN para WebGazer/modelos. Entrenamiento en nueve objetivos y validación en cinco objetivos independientes; se muestra error mediano en píxeles. No se graba ni exporta video. Cámara real y precisión individual requieren comprobación en su equipo.
- No se infieren emociones desde la cámara. Confianza, satisfacción y frustración se registran por autoinforme.
- Raw TLX es promedio sin ponderación, no la versión ponderada original. Rúbrica de chatbots adaptada para enseñanza, no certificación de cumplimiento de HAX/PAIR.
- Filtros visuales y objetivo oscilante son aproximaciones didácticas; TTS no sustituye un lector de pantalla. Audio/vibración dependen del navegador y dispositivo.
- Comparaciones exploran cambios descriptivos. Deben justificarse condiciones equivalentes; no incluyen significancia estadística ni permiten afirmar causalidad.
- PDF se genera desde el diálogo de impresión del navegador. El informe es estructurado, pero el estudiante debe completar su contexto e interpretación con evidencia real.

## 6. Referencias

- WCAG: https://www.w3.org/TR/WCAG22/
- NASA-TLX: https://www.nasa.gov/human-systems-integration-division/nasa-task-load-index-tlx/
- Microsoft HAI: https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/
- Google PAIR: https://pair.withgoogle.com/guidebook/
- WebGazer: https://webgazer.cs.brown.edu/

WebGazer es una dependencia opcional externa, cargada tras consentimiento, con licencia propia GPL-3.0-or-later; no se incluye su código en el ZIP. El código del proyecto conserva su licencia MIT. Revise la licencia de la dependencia antes de redistribuir una integración combinada.
