# Persistencia, privacidad y límites

El proyecto se guarda en `localStorage` bajo `hci-lab-ia-project-v2`; idioma y preferencias usan las claves existentes `hci-language` y `hci-prefs-v2`. Hay una fuente común del proyecto, sin backend, base de datos ni sincronización entre pestañas. No use pestañas simultáneas para editar el mismo proyecto.

Use datos ficticios. Los registros de Usuarios son independientes de las personas de investigación y no conceden acceso ni permisos. Las reservas no se envían a instituciones. Los respaldos y exportaciones contienen los datos y textos escritos en claro: quien obtenga el archivo puede leerlos. Revise su contenido antes de compartirlo. No hay autenticación ni cifrado de respaldos.

Cada origen/navegador conserva su almacenamiento propio. Borrar datos del navegador puede perderlo; pasar de localhost a Pages no los traslada. Gestionar proyecto permite descargar JSON, revisar una recuperación y confirmar el reemplazo. Los respaldos antiguos sin usuarios inicializan esa colección vacía y conservan las otras. Los formatos e identificadores históricos no se reescriben.

Ante fallo de almacenamiento se conserva el estado vigente y se permite reintentar, sin confirmar éxito. Reset elimina el proyecto y restablece preferencias, preservando el idioma; recuperar reemplaza el proyecto y aplica las preferencias/idioma presentes en el respaldo. Ambas operaciones invalidan trabajos pendientes. Restaurar solo preferencias no elimina los datos.

Los clics, scroll y cursor son registros locales; el seguimiento excluye valores de campos y controles generales. Los recorridos F/Gutenberg son simulados. El scroll no demuestra lectura y el cursor no es mirada medida. Cambios de geometría detienen capturas e impiden superponer coordenadas incompatibles, conservando muestras para revisión.

La cámara es opcional y requiere una acción explícita. El adaptador puede descargar WebGazer 3.5.3 desde jsDelivr; los permisos y conexiones externas dependen del navegador. No se afirma una auditoría independiente del proveedor ni validación física de precisión. Micrófono, voz, audio y vibración dependen de soporte/permisos; mantenga las alternativas escritas. La selección de video LSC es local y no acredita validación lingüística.

Las propuestas de IA y chatbots usados por defecto son simulaciones revisables. El adaptador de proxy opcional puede enviar la instrucción al endpoint configurado mediante `VITE_AI_PROXY_URL`; no se configura ni valida un servicio remoto en este cierre. Nunca coloque claves privadas en variables `VITE_*`, porque se incorporan al cliente. No se han añadido credenciales para publicar.

Los chequeos de secretos, axe y mocks tienen alcance limitado; no certifican privacidad integral, conformidad WCAG ni funcionamiento de hardware. Véase el [estado de cierre](cierre-integral.md).
