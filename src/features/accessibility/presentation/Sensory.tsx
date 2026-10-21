import {motorOffset} from '../domain/motor';
import {createSensoryFeedback} from '../infrastructure/sensoryFeedback';
import { useEffect, useRef, useState } from 'react';
export function Sensory() {
  const [vision,setVision]=useState('normal'),[motor,setMotor]=useState(false),[large,setLarge]=useState(true),[sound,setSound]=useState(false),[haptic,setHaptic]=useState(false),[message,setMessage]=useState(''),[hits,setHits]=useState(0),[misses,setMisses]=useState(0),[phase,setPhase]=useState(0);
  const feedbackAdapter=useRef(createSensoryFeedback());
  useEffect(()=>{if(!motor)return;const timer=setInterval(()=>setPhase(p=>p+1),100);return()=>clearInterval(timer);},[motor]);
  useEffect(()=>{const adapter=feedbackAdapter.current;return()=>adapter.dispose();},[]);
  const feedback=()=>{setHits(h=>h+1);setMessage('Acción confirmada con texto.');
    if(sound&&!feedbackAdapter.current.sound())setMessage('Audio no disponible; confirmación textual conservada.');
    if(haptic&&!feedbackAdapter.current.vibrate())setMessage('Acción confirmada; vibración no disponible en este navegador.');
  };
  const speak=()=>{if(!feedbackAdapter.current.speak()){setMessage('Voz no disponible; lea el texto.');return;}setMessage('Lectura TTS solicitada; no sustituye un lector de pantalla.');};
  return <section className="panel section-block" lang="es"><h2>Demostraciones sensoriales y motrices</h2><p>Aproximaciones didácticas, sin diagnóstico ni representación exacta de una condición clínica. El objetivo oscila; no se modifica el cursor real.</p>
    <div className="form-grid"><label>Filtro visual<select value={vision} onChange={e=>setVision(e.target.value)}><option value="normal">Normal</option><option value="blur">Desenfoque y bajo contraste</option><option value="tunnel">Campo visual reducido</option></select></label><label><input type="checkbox" checked={motor} onChange={e=>setMotor(e.target.checked)}/>Dificultad de precisión: objetivo oscilante</label><label><input type="checkbox" checked={large} onChange={e=>setLarge(e.target.checked)}/>Objetivo amplio</label><label><input type="checkbox" checked={sound} onChange={e=>setSound(e.target.checked)}/>Señal sonora opcional</label><label><input type="checkbox" checked={haptic} onChange={e=>setHaptic(e.target.checked)}/>Vibración opcional</label></div>
    <div className="sensory-stage" onClick={()=>setMisses(m=>m+1)}><div style={{filter:vision==='blur'?'blur(2px) contrast(.55)':undefined,clipPath:vision==='tunnel'?'circle(75px at center)':undefined}}><p>Reserva de asesoría · Próximo paso: confirmar</p><button style={{minWidth:large?150:28,minHeight:large?48:28,padding:large?12:0,transform:motor?`translate(${motorOffset(phase).x}px,${motorOffset(phase).y}px)`:undefined}} onClick={e=>{e.stopPropagation();feedback();}}>Confirmar</button></div></div>
    <p>Aciertos: {hits} · Clics fuera del objetivo: {misses}</p><div className="upgrade-actions"><button onClick={speak}>Escuchar nombre y estado (TTS)</button><button onClick={()=>{feedbackAdapter.current.stopSpeech();setMotor(false);setVision('normal');setHits(0);setMisses(0);setMessage('Demostración restablecida.');}}>Restablecer demostración</button></div><p role="status">{message}</p>
  </section>;
}
