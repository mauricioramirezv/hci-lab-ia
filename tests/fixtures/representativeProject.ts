import type { ProjectState } from '../../src/domain';
import { sampleProject } from '../../src/domain';
export function representativeProject():ProjectState {
  const createdAt='2026-10-09T15:00:00.000Z';
  const point={x:20,y:30,at:100,weight:1,source:'mouse'};
  const pagePoint={...point,area:'main/button'};
  return {
    ...structuredClone(sampleProject),
    appointments:[{id:'appointment-1',createdAt,service:'Asesoría UX',date:'2026-10-15',time:'10:30',status:'confirmed'}],
    findings:[{id:'finding-1',createdAt,heuristic:'Visibilidad del estado',severity:2,problem:'Estado poco visible',evidence:'Observación P01',recommendation:'Mostrar confirmación',source:'human',status:'validated'}],
    sessions:[{id:'session-1',createdAt,participant:'P01',task:'Reservar',success:true,seconds:30,errors:1,seq:6,emotion:4,sus:75,susResponses:[4,2,4,2,4,2,4,2,4,2],notes:'Sesión UX'}],
    events:[{id:'event-1',at:createdAt,type:'flow-start'},{id:'event-2',at:createdAt,type:'flow-complete',duration:30}],
    evidence:(['concept','experiment','tlx','chatbot','ai','comparison'] as const).map((kind,i)=>({id:`evidence-${i}`,createdAt,kind,participant:'P01',task:`Actividad ${kind}`,condition:'buena',prototype:'v2.4',scores:{seconds:12,score:50},notes:'Evidencia representativa',demo:false})),
    multimodalEvidence:[{id:'mm-1',createdAt,device:'watch',practice:'good',vision:'protanopia',notes:'Símbolo y texto',confidence:4,demoStatus:'Confirmado',channelStatus:'Voz detenida'}],
    trackingSessions:[{id:'tracking-1',createdAt,example:'good',width:800,height:1600,seconds:10,clicks:[point],pointer:[point],gaze:[point],scroll:[{at:100,top:200,depth:50}],wheelEvents:1,maxDepth:50,notes:'Sesión de ejemplo',validation:{medianErrorPx:10,viewportWidth:800,viewportHeight:600,sampleCount:50,at:createdAt},capped:false}],
    pageSessions:[{id:'page-1',createdAt,route:'/quality',participant:'P01',task:'Consultar',prototype:'v2.4',width:800,height:1600,viewportWidth:800,viewportHeight:600,seconds:10,clicks:[pagePoint],pointer:[pagePoint],gaze:[pagePoint],simulation:[{...pagePoint,source:'simulated-F'}],scroll:[{at:100,top:200,depth:50,direction:'abajo'}],maxDepth:50,exposure:{'0-10%':2},validationError:10,capped:false,notes:'Sesión de página'}],
  };
}
