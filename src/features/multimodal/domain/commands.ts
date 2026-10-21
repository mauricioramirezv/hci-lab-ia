export function actionState(value:string) {
 const states:Record<string,string>={confirm:'confirmed',cancel:'cancelled',navigate:'route',call:'calling',message:'messageReady',play:'playing',ticket:'ticketReady'};
 return states[value]||'pending';
}
export function voiceCommand(text:string):'confirm'|'cancel'|'navigate'|undefined {
 const normalized=text.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
 if(/^(confirmar|confirm|confirmer)(\s|$)/.test(normalized))return 'confirm';
 if(/^(cancelar|cancel|annuler)(\s|$)/.test(normalized))return 'cancel';
 if(/^(navegar|navigate|naviguer)(\s|$)/.test(normalized))return 'navigate';
}
