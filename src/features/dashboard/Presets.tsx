import { useState } from 'react';
import { useProject } from '../project/store';
import { uid } from '../project/domain';
export function Presets() {
  const {addPersona,addScenario,addEvidence}=useProject();const [message,setMessage]=useState('');
  const load=(car:boolean)=>{const name=car?'Conductor de demostración':'Persona mayor de demostración';
    addPersona({id:uid(),name,age:car?'35':'68',context:car?'Vehículo detenido, interacción breve':'Trámite médico con texto ampliado',goal:car?'Consultar una ruta sin distracción':'Solicitar una cita con confirmación clara',barrier:car?'Atención compartida':'Visión reducida y poca experiencia digital',device:car?'Vehículo':'Tableta',empathy:{says:'Necesito claridad',thinks:'Quiero conservar el control',does:'Comprueba el estado',feels:'Solicita confirmación'}});
    addScenario({id:uid(),title:`DEMOSTRACIÓN: ${car?'vehículo':'cita médica'}`,actor:name,context:'Caso precargado, no participante real',task:car?'Consultar ruta con vehículo detenido':'Reservar cita',constraint:car?'Evitar distracciones':'Texto al 150%',success:'Comprende el resultado y puede cancelar'});
    addEvidence({kind:'concept',participant:'DEMO',task:car?'Vehículo':'Cita médica',condition:'preset',prototype:'ejemplo v2.4',scores:{},notes:'Caso de exposición; sin resultados medidos.',demo:true});setMessage('Caso añadido sin reemplazar el proyecto.');};
  return <section className="panel section-block" lang="es"><h2>Modo exposición</h2><p>Añade personas y escenarios de ejemplo. No genera mediciones ficticias.</p><div className="upgrade-actions"><button onClick={()=>load(false)}>Cargar caso: cita médica</button><button onClick={()=>load(true)}>Cargar caso: vehículo</button></div><p role="status">{message}</p></section>;
}
