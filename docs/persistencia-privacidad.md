# Persistencia, privacidad y límites

El proyecto se guarda en `localStorage` bajo `hci-lab-ia-project-v2`; idioma y preferencias usan las claves existentes `hci-language` y `hci-prefs-v2`. El laboratorio público usa esta fuente local y no requiere cuenta. Las cuentas activas pueden [enviar explícitamente trabajo compatible a los cuatro servicios](integracion-backend.md). No hay sincronización entre pestañas; no use pestañas simultáneas para editar el mismo proyecto.

Use datos ficticios. Los registros de Usuarios son independientes de las cuentas y de las personas de investigación; no conceden acceso ni permisos. Las reservas no se envían a instituciones; su sincronización explícita crea registros en Comunidad. Los respaldos y exportaciones contienen los datos y textos escritos en claro: quien obtenga el archivo puede leerlos. Revise su contenido antes de compartirlo. Los respaldos no están cifrados ni contienen credenciales de sesión.

Cada origen/navegador conserva su almacenamiento propio. Borrar datos del navegador puede perderlo; pasar de localhost a Pages no los traslada. Gestionar proyecto permite descargar JSON, revisar una recuperación y confirmar el reemplazo. Los respaldos antiguos sin usuarios inicializan esa colección vacía y conservan las otras. Los formatos e identificadores históricos no se reescriben.

Ante fallo de almacenamiento se conserva el estado vigente y se permite reintentar, sin confirmar éxito. Reset elimina el proyecto y restablece preferencias, preservando el idioma; recuperar reemplaza el proyecto y aplica las preferencias/idioma presentes en el respaldo. Ambas operaciones invalidan trabajos pendientes. Restaurar solo preferencias no elimina los datos.

Los clics, scroll y cursor son registros locales; el seguimiento excluye valores de campos y controles generales. El envío de agregados UX requiere consentimiento explícito por separado y no incluye puntos detallados, calibración ni video. Los recorridos F/Gutenberg son simulados. El scroll no demuestra lectura y el cursor no es mirada medida. Cambios de geometría detienen capturas e impiden superponer coordenadas incompatibles, conservando muestras para revisión.

El registro de sincronización, separado del respaldo, conserva solicitudes de trabajo y sus identificadores remotos por cuenta/espacio. La sesión viaja en cookie HttpOnly y el valor anti-CSRF se conserva en memoria; no se guardan tokens de acceso en `localStorage`. Cerrar sesión o reiniciar el proyecto no elimina los registros del servidor ni borra automáticamente el registro de sincronización. Revise el almacenamiento del navegador si comparte el equipo.

La cámara es opcional y requiere una acción explícita. El adaptador puede descargar WebGazer 3.5.3 desde jsDelivr; los permisos y conexiones externas dependen del navegador. No se afirma una auditoría independiente del proveedor ni validación física de precisión. Micrófono, voz, audio y vibración dependen de soporte/permisos; mantenga las alternativas escritas. La selección de video LSC es local y no acredita validación lingüística.

Las propuestas de IA y chatbots usados por defecto son simulaciones revisables. El adaptador de proxy opcional puede enviar la instrucción al endpoint configurado mediante `VITE_AI_PROXY_URL`; no se configura ni valida un servicio remoto en este cierre. Nunca coloque claves privadas en variables `VITE_*`, porque se incorporan al cliente. No se han añadido credenciales para publicar.

Los chequeos de secretos, axe y mocks tienen alcance limitado; no certifican privacidad integral, conformidad WCAG ni funcionamiento de hardware. Véase el [estado de cierre](cierre-integral.md).
