# Usuarios ficticios del Laboratorio

Abra **Laboratorio → Usuarios** (`/lab/users`), junto a **Reservas**. Son registros para practicar interacción: distintos de las personas de investigación, sin autenticación ni permisos reales. Use nombres ficticios y correos de prueba como `ana@example.test`.

## Comportamiento

- La lista permite buscar por nombre/correo, combinar rol y estado y ordenar por nombre, correo o fecha. Nombre y correo se ordenan de forma ascendente; la fecha permite más recientes o más antiguos.
- Crear y editar abren un formulario independiente. Todos los campos son obligatorios. Los errores aparecen junto al campo, reciben foco y conservan el borrador. Guardar recorta espacios exteriores; los correos duplicados se comparan sin mayúsculas ni esos espacios. Dos usuarios pueden compartir nombre.
- Cancelar o Volver abandona el borrador sin alterar el registro, con aviso si tiene cambios sin guardar. Ver detalle muestra identidad, fecha y campos. Activar/desactivar conserva identidad y fecha.
- Eliminar requiere confirmación con cancelación inicial y Escape. Deshacer restaura el último registro eliminado mientras permanezca en el módulo, salvo que su correo o identificador ya esté ocupado. Otra eliminación sustituye esa opción; salir, recargar, reset o recuperación la descartan. Deshacer no revierte el resto del proyecto.
- Las operaciones persistidas añaden evidencia de tarea al mismo proyecto. Un fallo de almacenamiento conserva los datos anteriores y el borrador; no confirma éxito. Las evidencias previas permanecen después de eliminar un usuario, como registro de las tareas realizadas.
- La comparación didáctica responde al mismo correo con una corrección útil o un mensaje genérico. Es un ejemplo aislado: comprobarlo no crea ni modifica usuarios. Sus controles mantienen etiquetas y acceso por teclado.

## Integración y límites

La colección se guarda dentro de `hci-lab-ia-project-v2`, sin claves nuevas. Reset la vacía; respaldo y recuperación la incluyen. Un respaldo anterior sin usuarios crea una colección vacía y conserva sus demás datos. Los seis idiomas traducen interfaz, errores y estados; los nombres/correos escritos permanecen intactos. Los informes incluyen los usuarios ficticios como datos simulados y las tareas sin métricas inventadas. El seguimiento de página permite observar el recorrido y guardar una sesión separada.

No se incorporan cuentas reales, permisos, servidor, base de datos ni sincronización entre pestañas. Deshacer es temporal, no un historial completo de versiones. La validación de correo comprueba un formato práctico; no comprueba entrega ni existencia del dominio. La instrucción de utilizar datos ficticios no equivale a verificar identidades.

## Verificación automatizada

Desde la raíz:

```sh
npm run lint
npm test
node tests/tools/check-architecture.cjs
npm run build
npm run test:e2e -- tests/e2e/users.spec.ts tests/e2e/reservations-persistence.spec.ts tests/e2e/project-management.spec.ts tests/e2e/reports.spec.ts tests/e2e/accessibility.spec.ts --workers=3
npm run test:e2e -- tests/e2e/users.spec.ts tests/e2e/browser-zoom.spec.ts --workers=3
```

Las reglas y operaciones se prueban sin React en `tests/unit/users.test.ts`; el proveedor real en `tests/unit/usersProject.test.tsx`. `tests/e2e/users.spec.ts` cubre recorridos, persistencia fallida, recuperación, datos antiguos, seguimiento, informes, idiomas, teclado, axe y disposición al 200% en escritorio, tableta y móvil. Las capturas y reportes se generan en las ubicaciones ignoradas de pruebas.

Resultado del 21 de octubre de 2026: lint y compilación correctos; 185 pruebas unitarias/integración en 29 archivos; 96 E2E de usuarios y regresión correctos. Tras ajustar el espaciado, la ejecución final de usuarios y zoom tuvo 22 casos correctos y dos omisiones previstas: el zoom real por extensión se ejecuta en escritorio, no en los perfiles tableta/móvil. Esta última ejecución repite los 21 casos de usuarios, por lo que no se suman como casos nuevos a los 96 anteriores. Axe no detectó infracciones en las vistas comprobadas; los seis idiomas, temas, texto ampliado y zoom real al 200% pasaron. La auditoría de 230 módulos no encontró ciclos ni infracciones de capas. La compilación conserva la advertencia de tamaño de paquete superior a 500 kB. No se ejecutó toda la suite E2E de módulos ajenos al cambio.

## Revisión manual

1. Recorra Laboratorio → Reservas → Usuarios; cree un registro, consulte sus datos y edítelo. Cancele otra edición y compruebe que conserva el original.
2. Pruebe nombre con espacios, correo inválido y duplicado con mayúsculas. Corrija sin reescribir los demás campos. Compruebe que el correo propio es válido al editar.
3. Active/desactive, cancele una eliminación con Escape, elimine y deshaga. Pruebe que reutilizar el correo impide restaurar un duplicado.
4. Combine búsqueda/filtros, cambie ordenamiento y compruebe los estados vacíos. Compare los mensajes del ejemplo aislado y confirme que no cambia la lista.
5. Cambie los seis idiomas, tema y tamaño. Recorra formulario, lista y confirmación solo con teclado. Revise lectura de errores/estado con un lector de pantalla real, foco visible, móvil táctil y zoom real del navegador.
6. Recargue; descargue respaldo, reinicie y recupérelo. Compruebe usuarios, otras colecciones y borrador de informe. Recupere también un respaldo antiguo sin usuarios.
7. Inicie seguimiento de página para una tarea en Usuarios, interactúe, detenga y guarde. Revise esa sesión, los registros ficticios y sus tareas en Informes; genere y exporte el informe.

La comprobación automática con axe y texto al 200% no sustituye la revisión con lector de pantalla, zoom real, dispositivos físicos y personas usuarias.
