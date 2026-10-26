import {useInterfaceText} from '../../../shared/ui/useInterfaceText';
import {motorOffset} from '../domain/motor';
import {createSensoryFeedback} from '../infrastructure/sensoryFeedback';
import { useEffect, useRef, useState } from 'react';
import {useTranslation} from 'react-i18next';
import { ExpandableCard } from '../../../shared/ui/ExpandableCard';
export function Sensory({reducedMotion=false}:{reducedMotion?:boolean}) {
  const tx=useInterfaceText();
  const {t,i18n}=useTranslation();
  const [vision,setVision]=useState('normal'),[motor,setMotor]=useState(false),[large,setLarge]=useState(true),[sound,setSound]=useState(false),[haptic,setHaptic]=useState(false),[message,setMessage]=useState(''),[hits,setHits]=useState(0),[misses,setMisses]=useState(0),[phase,setPhase]=useState(0);
  const feedbackAdapter=useRef(createSensoryFeedback());
  useEffect(()=>{if(!motor||reducedMotion)return;const timer=setInterval(()=>setPhase(p=>p+1),100);return()=>clearInterval(timer);},[motor,reducedMotion]);
  useEffect(()=>{const adapter=feedbackAdapter.current;return()=>adapter.dispose();},[]);
  const feedback=()=>{setHits(h=>h+1);setMessage('Acción confirmada con texto.');
    if(sound&&!feedbackAdapter.current.sound())setMessage('Audio no disponible; confirmación textual conservada.');
    if(haptic&&!feedbackAdapter.current.vibrate())setMessage('Acción confirmada; vibración no disponible en este navegador.');
  };
  const speak=()=>{if(!feedbackAdapter.current.speak(tx("Botón: Confirmar reserva. Estado: acción confirmada."),i18n.language)){setMessage('Voz no disponible; lea el texto.');return;}setMessage('Lectura TTS solicitada; no sustituye un lector de pantalla.');};
  return <ExpandableCard id="accessibility-sensory" title={tx("Demostraciones sensoriales y motrices")} defaultOpen={false} className="section-block"><p>{tx("Aproximaciones didácticas, sin diagnóstico ni representación exacta de una condición clínica. El objetivo oscila; no se modifica el cursor real.")}</p>
    <div className="form-grid"><label>{tx("Filtro visual")}<select value={vision} onChange={e=>setVision(e.target.value)}><option value="normal">{tx("Normal")}</option><option value="blur">{tx("Desenfoque y bajo contraste")}</option><option value="tunnel">{tx("Campo visual reducido")}</option></select></label><label><input type="checkbox" checked={motor} onChange={e=>setMotor(e.target.checked)}/>{tx("Dificultad de precisión: objetivo oscilante")}</label><label><input type="checkbox" checked={large} onChange={e=>setLarge(e.target.checked)}/>{tx("Objetivo amplio")}</label><label><input type="checkbox" checked={sound} onChange={e=>setSound(e.target.checked)}/>{tx("Señal sonora opcional")}</label><label><input type="checkbox" checked={haptic} onChange={e=>setHaptic(e.target.checked)}/>{tx("Vibración opcional")}</label></div>
    {reducedMotion&&<p lang={i18n.language}>{t('displayPreferences.motionPaused')}</p>}
    <div className="sensory-stage" onClick={()=>setMisses(m=>m+1)}><div style={{filter:vision==='blur'?'blur(2px) contrast(.55)':undefined,clipPath:vision==='tunnel'?'circle(75px at center)':undefined}}><p>{tx("Reserva de asesoría · Próximo paso: confirmar")}</p><button style={{minWidth:large?150:28,minHeight:large?48:28,padding:large?12:0,transform:motor&&!reducedMotion?`translate(${motorOffset(phase).x}px,${motorOffset(phase).y}px)`:undefined}} onClick={e=>{e.stopPropagation();feedback();}}>{tx("Confirmar")}</button></div></div>
    <p>{tx("Aciertos:")} {hits}  {tx("· Clics fuera del objetivo:")} {misses}</p><div className="upgrade-actions"><button onClick={speak}>{tx("Escuchar nombre y estado (TTS)")}</button><button onClick={()=>{feedbackAdapter.current.stopSpeech();setMotor(false);setVision('normal');setHits(0);setMisses(0);setMessage('Demostración restablecida.');}}>{tx("Restablecer demostración")}</button></div><p role="status" data-outcome={/^(Audio no|Voz no)/.test(message)?"error":"success"}>{message&&tx(message)}</p>
  </ExpandableCard>;
}
