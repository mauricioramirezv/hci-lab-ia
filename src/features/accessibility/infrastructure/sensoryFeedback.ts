export function createSensoryFeedback() {
 let audio:AudioContext|null=null;
 return {
  sound:()=>{try{audio ||= new AudioContext();void audio.resume();const ctx=audio,osc=ctx.createOscillator(),gain=ctx.createGain();osc.frequency.value=660;gain.gain.setValueAtTime(.06,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.15);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.15);return true;}catch{return false;}},
  vibrate:()=>!!navigator.vibrate?.([40,30,40]),
  speak:()=>{if(!('speechSynthesis' in window))return false;window.speechSynthesis.cancel();const text=new SpeechSynthesisUtterance('Botón: Confirmar reserva. Estado: acción confirmada.');text.lang='es-CO';window.speechSynthesis.speak(text);return true;},
  stopSpeech:()=>window.speechSynthesis?.cancel(),
  dispose:()=>{void audio?.close();window.speechSynthesis?.cancel();navigator.vibrate?.(0);},
 };
}
