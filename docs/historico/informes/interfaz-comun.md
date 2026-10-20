# Iteración 1 — interfaz común

Implementada el 9 de octubre de 2026. Sin publicación ni push a GitHub.

## Cambios

- Jerarquía de títulos, márgenes, controles y bordes compartidos en `src/shell.css`, importado después de las hojas existentes.
- Navegación agrupada por propósito, conservando las 18 rutas y sus nombres. Título del navegador actualizado por ruta.
- Menú móvil con enlaces ocultos fuera del recorrido de Tab, foco inicial, cierre con Escape, retorno del foco y bloqueo del contenido de fondo. Al navegar, el foco pasa al contenido sin esconder su título bajo la cabecera.
- Cabecera adaptable y control de seguimiento integrado en ella para evitar tapar contenido. El indicador de captura reserva espacio; no modifica la geometría cuando cambia de estado.
- Campos y enlaces legibles en oscuro y alto contraste; foco visible también en importación y regiones con tablas desplazables.
- Etiquetas de la interfaz común traducidas a español, inglés, portugués, francés, italiano y catalán en `src/shellLocales.ts`.
- El error visual didáctico está limitado a `.appointment-demo.anti-pattern`. Los campos de esa demostración conservan sus estilos propios.
- Ajuste exclusivamente visual de las instrucciones de calibración en tableta para que no se superpongan con los puntos de prueba.

No se cambiaron modelos, claves de almacenamiento, rutas, proveedores ni operaciones de Reset o PageTracker. En PageTracker solo se añadieron traducción del botón, asociación accesible con su panel e indicador visual; Reset conserva su código.

## Archivos

`src/App.tsx`, `src/ui.tsx`, `src/main.tsx`, `src/i18n.ts`, `src/styles.css`, `src/enhancements/PageTracker.tsx`; nuevos `src/shell.css` y `src/shellLocales.ts`.

Verificación: `playwright.config.ts` incorpora tableta; nuevos `tests/e2e/shell.spec.ts`, `tests/e2e/browser-zoom.spec.ts` y la extensión local de prueba en `tests/fixtures/zoom-extension/`. La extensión solo se carga en un perfil temporal de Chromium creado por la prueba de zoom.

## Verificación realizada

| Comprobación | Resultado |
| --- | --- |
| `npm run lint` | Aprobado |
| `npm test` | 19 pruebas aprobadas |
| `npm run build` | TypeScript y Vite aprobados |
| Pruebas funcionales existentes | Verificadas en escritorio, tableta y celular; los fallos visuales encontrados se corrigieron y revalidaron |
| Axe | Cero infracciones WCAG detectadas en el estado inicial de las 18 rutas, en 3 tamaños y 4 combinaciones de tema: 216 análisis |
| Teclado | Menú con Enter, Tab, Shift+Tab y Escape; retorno de foco y foco al cambiar de ruta aprobados |
| Idiomas | Grupos de navegación, enlace de salto, exportación y botón de seguimiento aprobados en los seis idiomas |
| Adaptación | Capturas a 1440×900, 768×1024 y 360×800; texto al 100 % y 200 %, sin desbordamiento horizontal general |
| Zoom real del navegador | Chromium al 200 % mediante `chrome.tabs.setZoom`, comprobado en las 18 rutas |

La última pasada completa encontró un fallo de simulación en celular. Se corrigió compactando la barra, sin cambiar la simulación. La revalidación de captura, idiomas y adaptación terminó con **9/9 aprobadas**. La pasada final de axe, zoom y menú terminó con **16 aprobadas y 2 omisiones previstas**.

Las omisiones previstas son el zoom de escritorio repetido en los proyectos de tableta/celular y la prueba de cámara simulada en celular. La calibración simulada pasó en escritorio y tableta. No se usó una cámara real.

Sin fallos pendientes detectados de esta iteración. La traducción completa del contenido y las correcciones funcionales de Reset/PageTracker quedan para sus iteraciones. Los antipatrones mantienen sus defectos didácticos deliberados.

## Revisión visual

1. Desde la carpeta del proyecto, ejecutar `npm run dev` y abrir `http://localhost:5173/hci-lab-ia/` (o el puerto que indique Vite).
2. Revisar escritorio, tableta y celular. En escritorio, aplicar zoom del navegador al 200 %. En Accesibilidad, probar también texto al 200 %.
3. Alternar claro/oscuro desde la cabecera y alto contraste desde Accesibilidad. Revisar títulos, formularios, botones y tablas.
4. Usar Tab y Enter para navegar; en el menú móvil, probar Shift+Tab, Escape y el foco al abrir un módulo. Abrir Reset y cancelar para revisar su diálogo.
5. Alternar los seis idiomas y abrir/cerrar Seguimiento de página. Revisar que sus controles globales no tapen contenido cuando el panel está cerrado.

Capturas conservadas en [iteracion-1-capturas](../../evidencias/interfaz-comun): escritorio, tableta, celular, texto ampliado, tema oscuro, alto contraste y zoom real.
