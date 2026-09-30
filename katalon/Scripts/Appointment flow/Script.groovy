import static com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('http://127.0.0.1:4173/hci-lab-ia/')
WebUI.verifyTextPresent('Flujo de reserva de citas', false)
WebUI.closeBrowser()
