# Scripts de paquetes históricos

Los scripts npm de desarrollo, pruebas y compilación permanecen en `package.json`. Las herramientas exclusivas de pruebas están en `tests/tools/`; consulte la [guía de pruebas](pruebas.md).

`scripts/historico/Actualizar.ps1` y `scripts/historico/Aplicar_2_4.ps1` conservan la aplicación de los paquetes originales 2.2 y 2.4. No son pasos de instalación del checkout. Requieren un paquete original completo y un repositorio destino compatible, sin cambios pendientes. Mantienen sus comprobaciones de rama e integridad previas a la copia.

Solo para reproducir una actualización histórica, desde la raíz:

```powershell
powershell -NoProfile -File scripts/historico/Aplicar_2_4.ps1 -Paquete C:\Paquetes\HCI_Lab_IA_V2-4 -Repositorio C:\Repos\hci-lab-ia
```

Los [manifiestos archivados](historico/README.md) conservan las rutas y hashes originales. Los scripts leen el manifiesto del paquete indicado mediante `-Paquete`; el checkout reorganizado no es un paquete original. No aplique esos paquetes sobre trabajo pendiente. Para desarrollar aquí use la [guía vigente](desarrollo.md).
