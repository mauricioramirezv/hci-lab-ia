import {useInterfaceText} from '../../shared/ui/useInterfaceText';
import { useState } from 'react';
import { useProject } from '../project/presentation';
import { uid } from '../project/domain';
import { ExpandableCard } from '../../shared/ui/ExpandableCard';
export function Presets() {
  const tx=useInterfaceText();
  const {addPersona,addScenario,addEvidence}=useProject();const [message,setMessage]=useState('');
  const load=(car:boolean)=>{setMessage('');const name=car?tx("Conductor de demostración"):tx("Persona mayor de demostración");
    if(!addPersona({id:uid(),name,age:car?'35':'68',context:car?tx("Vehículo detenido, interacción breve"):tx("Trámite médico con texto ampliado"),goal:car?tx("Consultar una ruta sin distracción"):tx("Solicitar una cita con confirmación clara"),barrier:car?tx("Atención compartida"):tx("Visión reducida y poca experiencia digital"),device:car?tx("Vehículo"):tx("Tableta"),empathy:{says:tx("Necesito claridad"),thinks:tx("Quiero conservar el control"),does:tx("Comprueba el estado"),feels:tx("Solicita confirmación")}}))return;
    if(!addScenario({id:uid(),title:tx("DEMOSTRACIÓN: {{case}}",{case:car?tx("vehículo"):tx("cita médica")}),actor:name,context:tx("Caso precargado, no participante real"),task:car?tx("Consultar ruta con vehículo detenido"):tx("Reservar cita"),constraint:car?tx("Evitar distracciones"):tx("Texto al 150%"),success:tx("Comprende el resultado y puede cancelar")}))return;
    if(!addEvidence({kind:'concept',participant:'DEMO',task:car?tx("Vehículo"):tx("Cita médica"),condition:'preset',prototype:'ejemplo v2.4',scores:{},notes:tx("Caso de exposición; sin resultados medidos."),demo:true}))return;setMessage('Caso añadido sin reemplazar el proyecto.');};
  return <ExpandableCard id="dashboard-presets" title={tx("Modo exposición")} defaultOpen={false} className="section-block"><p>{tx("Añade personas y escenarios de ejemplo. No genera mediciones ficticias.")}</p><div className="upgrade-actions"><button onClick={()=>load(false)}>{tx("Cargar caso: cita médica")}</button><button onClick={()=>load(true)}>{tx("Cargar caso: vehículo")}</button></div><p role="status" data-outcome="success">{message&&tx(message)}</p></ExpandableCard>;
}
