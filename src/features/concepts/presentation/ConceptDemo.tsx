import {useInterfaceText} from '../../../shared/ui/useInterfaceText';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProject } from '../../project/presentation';
export function ConceptDemo({name,index}: {name: string;index: number}) {
  const tx=useInterfaceText();
  const {addEvidence}=useProject(); const {t,i18n}=useTranslation();
  const [good,setGood]=useState(true),[running,setRunning]=useState(false),[done,setDone]=useState(false);
  const [status,setStatus]=useState(''),[notes,setNotes]=useState(''),[emotion,setEmotion]=useState(3);
  const [participant,setParticipant]=useState(''),[text,setText]=useState(''),[visible,setVisible]=useState(true);
  const [device,setDevice]=useState('PC'); const [saved,setSaved]=useState(false);
  const clicks=useRef(0),errors=useRef(0),start=useRef(0),elapsed=useRef(0),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  useEffect(()=>()=>{clearTimeout(timer.current);window.speechSynthesis?.cancel();},[]);
  const begin=()=>{clearTimeout(timer.current);clicks.current=0;errors.current=0;start.current=performance.now();setRunning(true);setDone(false);setSaved(false);setStatus('');setText('');setVisible(true);};
  const finish=(message="Tarea completada")=>{elapsed.current=(performance.now()-start.current)/1000;setRunning(false);setDone(true);setStatus(message);};
  const action=(ok=true)=>{if(!running)return;clicks.current++;if(!ok){errors.current++;setStatus(good?"Revise el código; puede corregir sin perder datos.":"ERROR 405: dato inválido.");return;}finish();};
  const instructions=[tx("Cambie de dispositivo y confirme que conserva el contexto."),tx("Seleccione Reservar asesoría."),tx("Identifique y confirme el estado de la reserva."),tx("Guarde el cambio y explique su estado."),tx("Decida si continuar o abandonar libremente."),tx("Ingrese el código UX y observe el mensaje de recuperación."),tx("Seleccione el objetivo."),tx("Recuerde el código UX y escríbalo tras ocultarlo."),tx("Localice la opción para reservar."),tx("Complete la tarea con teclado o voz."),tx("Revise y acepte o rechace una sugerencia simulada.")];
  const reserve=()=>action();
  const outcome=['ERROR 405: dato inválido.','Revise el código; puede corregir sin perder datos.','Voz no disponible; use el texto.','La operación terminó sin indicar el resultado.'].includes(status)?'error':['Tarea completada','Guardado. Puede continuar.','Evidencia guardada en Informes.','Abandono voluntario registrado','Propuesta rechazada por decisión humana'].includes(status)?'success':undefined;
  return <section className="concept-demo" data-aoi={`concepto-${index}`}>
    <h3>{t('upgrade.demo')}</h3><label>{tx("Variante")}<select disabled={running} value={good?'good':'bad'} onChange={e=>{setGood(e.target.value==='good');setDone(false);}}><option value="good">{t('upgrade.good')}</option><option value="bad">{t('upgrade.bad')}</option></select></label>
    <p>{instructions[index]}</p><button disabled={running} onClick={begin}>{t('upgrade.start')}</button>
    <div className="demo-stage" onClick={()=>{if(running && index===6)errors.current++;}}>
    {index===0 && <><p>{tx("Reserva en")} {device==='PC'?device:tx("Celular")}: {good?tx("Asesoría UX, pendiente de confirmar"):device==='PC'?tx("Asesoría UX"):tx("Sin contexto")}</p><button disabled={!running} onClick={()=>{clicks.current++;setDevice(device==='PC'?'Celular':'PC');}}>{tx("Cambiar dispositivo")}</button><button disabled={!running} onClick={reserve}>{tx("Confirmar reserva")}</button></>}
    {index===1 && <div className="upgrade-actions">{(good?[tx("Reservar asesoría"),tx("Cancelar")]:[tx("Operación X1"),tx("Operación X2")]).map((x,i)=><button disabled={!running} key={x} onClick={()=>action(i===0)}>{x}</button>)}</div>}
    {index===2 && <><span className="status-pill" style={{background:good?'var(--soft)':'#0b6b5c'}}>{good?tx("✓ Reserva confirmada"):'●'}</span><p>{tx("¿Cuál es el estado?")}</p>{[tx("Confirmada"),tx("Pendiente")].map((x,i)=><button key={x} disabled={!running} onClick={()=>action(i===0)}>{x}</button>)}</>}
    {index===3 && <><button disabled={!running} onClick={()=>{clicks.current++;setStatus(good?"Guardando…":'');timer.current=setTimeout(()=>finish(good?"Guardado. Puede continuar.":"La operación terminó sin indicar el resultado."),1200);}}>{tx("Guardar cambio")}</button><p role="status" data-outcome={outcome}>{status&&tx(status)}</p></>}
    {index===4 && <><p>{good?tx("Puede continuar cuando lo desee."):tx("¡Última oportunidad! Solo quedan 5 segundos (urgencia ficticia).")} </p><button disabled={!running} onClick={()=>action()}>{tx("Continuar")}</button><button disabled={!running} onClick={()=>{clicks.current++;finish("Abandono voluntario registrado");}}>{tx("Abandonar")}</button></>}
    {(index===5 || index===7) && <><p>{index===7?(visible || good?tx("Código necesario: UX"):tx("Recuerde el código de la pantalla anterior")):tx("Escriba UX; pruebe también un código incorrecto.")}</p>{index===7 && <button disabled={!running} onClick={()=>{setVisible(false);clicks.current++;}}>{tx("Ocultar código")}</button>}<label>{tx("Código de prueba")}<input disabled={!running} value={text} onChange={e=>setText(e.target.value)}/></label><button disabled={!running} onClick={()=>action(text.toUpperCase()==='UX')}>{tx("Verificar código")}</button></>}
    {index===6 && <button style={{minWidth:good?96:24,minHeight:good?48:24,padding:good?12:0}} disabled={!running} onClick={e=>{e.stopPropagation();action();}}>✓<span className="sr-only">{tx("Seleccionar objetivo")}</span></button>}
    {index===8 && <div className="upgrade-actions">{(good?[tx("Reservar"),tx("Mis reservas"),tx("Ayuda")]:['XJ-9','AB-2','ZM-4']).map((x,i)=><button disabled={!running} key={x} onClick={()=>action(i===0)}>{x}</button>)}</div>}
    {index===9 && <><button disabled={!running} onClick={reserve}>{good?tx("Confirmar (también con Enter)"):'✓'}<span className="sr-only">{tx("Confirmar")}</span></button>{good && <button disabled={!running} onClick={()=>{if('speechSynthesis' in window){const speech=new SpeechSynthesisUtterance(tx("Puede confirmar con Enter."));speech.lang=i18n.language;window.speechSynthesis.speak(speech);setStatus('Ayuda de voz solicitada');}else setStatus('Voz no disponible; use el texto.');}}>{tx("Escuchar ayuda")}</button>}<p>{tx("Pruebe Tab y Enter; la voz es opcional.")}</p></>}
    {index===10 && <><p>{good?tx("Propuesta simulada: añadir una etiqueta visible. Revise la evidencia antes de decidir."):tx("La IA siempre tiene razón: aplique automáticamente.")}</p><button disabled={!running} onClick={()=>action()}>{tx("Aceptar tras revisar")}</button><button disabled={!running} onClick={()=>{clicks.current++;finish("Propuesta rechazada por decisión humana");}}>{tx("Rechazar")}</button></>}
    </div><p role="status" data-outcome={outcome}>{index!==3&&status?tx(status):''}</p>
    {done && <p>{tx("Tiempo:")} {elapsed.current.toFixed(2)}  {tx("s · Clics:")} {clicks.current}  {tx("· Errores registrados:")} {errors.current}</p>}
    <label>{t('upgrade.participant')}<input value={participant} onChange={e=>setParticipant(e.target.value)}/></label><label>{tx("Confianza/satisfacción declarada:")} {emotion}/5<input type="range" min="1" max="5" value={emotion} onChange={e=>setEmotion(Number(e.target.value))}/></label>
    <label>{t('upgrade.notes')}<textarea value={notes} onChange={e=>setNotes(e.target.value)}/></label>
    <button disabled={!done || saved || !notes.trim() || !participant.trim()} onClick={()=>{if(!addEvidence({kind:'concept',participant,task:name,condition:good?tx("buena"):'antipatrón',prototype:'v2.4',scores:{seconds:elapsed.current,clicks:clicks.current,errors:errors.current,emotion},notes}))return;setSaved(true);setStatus('Evidencia guardada en Informes.');}}>{t('upgrade.save')}</button>
    <p className="fine-print">{tx("Resultados de esta tarea, sin inferir emociones mediante cámara. Las variantes adversas son ejemplos didácticos.")}</p>
  </section>;
}
