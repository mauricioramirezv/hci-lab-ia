import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProject } from '../../project/presentation';
export function ConceptDemo({name,index}: {name: string;index: number}) {
  const {addEvidence}=useProject(); const {t}=useTranslation();
  const [good,setGood]=useState(true),[running,setRunning]=useState(false),[done,setDone]=useState(false);
  const [status,setStatus]=useState(''),[notes,setNotes]=useState(''),[emotion,setEmotion]=useState(3);
  const [participant,setParticipant]=useState(''),[text,setText]=useState(''),[visible,setVisible]=useState(true);
  const [device,setDevice]=useState('PC'); const [saved,setSaved]=useState(false);
  const clicks=useRef(0),errors=useRef(0),start=useRef(0),elapsed=useRef(0),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  useEffect(()=>()=>{clearTimeout(timer.current);window.speechSynthesis?.cancel();},[]);
  const begin=()=>{clearTimeout(timer.current);clicks.current=0;errors.current=0;start.current=performance.now();setRunning(true);setDone(false);setSaved(false);setStatus('');setText('');setVisible(true);};
  const finish=(message='Tarea completada')=>{elapsed.current=(performance.now()-start.current)/1000;setRunning(false);setDone(true);setStatus(message);};
  const action=(ok=true)=>{if(!running)return;clicks.current++;if(!ok){errors.current++;setStatus(good?'Revise el código; puede corregir sin perder datos.':'ERROR 405: dato inválido.');return;}finish();};
  const instructions=['Cambie de dispositivo y confirme que conserva el contexto.','Seleccione Reservar asesoría.','Identifique y confirme el estado de la reserva.','Guarde el cambio y explique su estado.','Decida si continuar o abandonar libremente.','Ingrese el código UX y observe el mensaje de recuperación.','Seleccione el objetivo.','Recuerde el código UX y escríbalo tras ocultarlo.','Localice la opción para reservar.','Complete la tarea con teclado o voz.','Revise y acepte o rechace una sugerencia simulada.'];
  const reserve=()=>action();
  return <section className="concept-demo" lang="es" data-aoi={`concepto-${index}`}>
    <h3>{t('upgrade.demo')}</h3><label>Variante<select disabled={running} value={good?'good':'bad'} onChange={e=>{setGood(e.target.value==='good');setDone(false);}}><option value="good">{t('upgrade.good')}</option><option value="bad">{t('upgrade.bad')}</option></select></label>
    <p>{instructions[index]}</p><button disabled={running} onClick={begin}>{t('upgrade.start')}</button>
    <div className="demo-stage" onClick={()=>{if(running && index===6)errors.current++;}}>
    {index===0 && <><p>Reserva en {device}: {good?'Asesoría UX, pendiente de confirmar':device==='PC'?'Asesoría UX':'Sin contexto'}</p><button disabled={!running} onClick={()=>{clicks.current++;setDevice(device==='PC'?'Celular':'PC');}}>Cambiar dispositivo</button><button disabled={!running} onClick={reserve}>Confirmar reserva</button></>}
    {index===1 && <div className="upgrade-actions">{(good?['Reservar asesoría','Cancelar']:['Operación X1','Operación X2']).map((x,i)=><button disabled={!running} key={x} onClick={()=>action(i===0)}>{x}</button>)}</div>}
    {index===2 && <><span className="status-pill" style={{background:good?'#d6eee7':'#0b6b5c'}}>{good?'✓ Reserva confirmada':'●'}</span><p>¿Cuál es el estado?</p>{['Confirmada','Pendiente'].map((x,i)=><button key={x} disabled={!running} onClick={()=>action(i===0)}>{x}</button>)}</>}
    {index===3 && <><button disabled={!running} onClick={()=>{clicks.current++;setStatus(good?'Guardando…':'');timer.current=setTimeout(()=>finish(good?'Guardado. Puede continuar.':'La operación terminó sin indicar el resultado.'),1200);}}>Guardar cambio</button><p role="status">{status}</p></>}
    {index===4 && <><p>{good?'Puede continuar cuando lo desee.':'¡Última oportunidad! Solo quedan 5 segundos (urgencia ficticia).'} </p><button disabled={!running} onClick={()=>action()}>Continuar</button><button disabled={!running} onClick={()=>{clicks.current++;finish('Abandono voluntario registrado');}}>Abandonar</button></>}
    {(index===5 || index===7) && <><p>{index===7?(visible || good?'Código necesario: UX':'Recuerde el código de la pantalla anterior'):'Escriba UX; pruebe también un código incorrecto.'}</p>{index===7 && <button disabled={!running} onClick={()=>{setVisible(false);clicks.current++;}}>Ocultar código</button>}<label>Código de prueba<input disabled={!running} value={text} onChange={e=>setText(e.target.value)}/></label><button disabled={!running} onClick={()=>action(text.toUpperCase()==='UX')}>Verificar código</button></>}
    {index===6 && <button style={{minWidth:good?96:24,minHeight:good?48:24,padding:good?12:0}} disabled={!running} onClick={e=>{e.stopPropagation();action();}}>✓<span className="sr-only">Seleccionar objetivo</span></button>}
    {index===8 && <div className="upgrade-actions">{(good?['Reservar','Mis reservas','Ayuda']:['XJ-9','AB-2','ZM-4']).map((x,i)=><button disabled={!running} key={x} onClick={()=>action(i===0)}>{x}</button>)}</div>}
    {index===9 && <><button disabled={!running} onClick={reserve}>{good?'Confirmar (también con Enter)':'✓'}<span className="sr-only">Confirmar</span></button>{good && <button disabled={!running} onClick={()=>{if('speechSynthesis' in window){window.speechSynthesis.speak(new SpeechSynthesisUtterance('Puede confirmar con Enter.'));setStatus('Ayuda de voz solicitada');}else setStatus('Voz no disponible; use el texto.');}}>Escuchar ayuda</button>}<p>Pruebe Tab y Enter; la voz es opcional.</p></>}
    {index===10 && <><p>{good?'Propuesta simulada: añadir una etiqueta visible. Revise la evidencia antes de decidir.':'La IA siempre tiene razón: aplique automáticamente.'}</p><button disabled={!running} onClick={()=>action()}>Aceptar tras revisar</button><button disabled={!running} onClick={()=>{clicks.current++;finish('Propuesta rechazada por decisión humana');}}>Rechazar</button></>}
    </div><p role="status">{index!==3?status:''}</p>
    {done && <p>Tiempo: {elapsed.current.toFixed(2)} s · Clics: {clicks.current} · Errores registrados: {errors.current}</p>}
    <label>{t('upgrade.participant')}<input value={participant} onChange={e=>setParticipant(e.target.value)}/></label><label>Confianza/satisfacción declarada: {emotion}/5<input type="range" min="1" max="5" value={emotion} onChange={e=>setEmotion(Number(e.target.value))}/></label>
    <label>{t('upgrade.notes')}<textarea value={notes} onChange={e=>setNotes(e.target.value)}/></label>
    <button disabled={!done || saved || !notes.trim() || !participant.trim()} onClick={()=>{if(!addEvidence({kind:'concept',participant,task:name,condition:good?'buena':'antipatrón',prototype:'v2.4',scores:{seconds:elapsed.current,clicks:clicks.current,errors:errors.current,emotion},notes}))return;setSaved(true);setStatus('Evidencia guardada en Informes.');}}>{t('upgrade.save')}</button>
    <p className="fine-print">Resultados de esta tarea, sin inferir emociones mediante cámara. Las variantes adversas son ejemplos didácticos.</p>
  </section>;
}
