import {useInterfaceText} from '../../../shared/ui/useInterfaceText';
import { useState } from 'react';
import { useProject } from '../../project/presentation';
export function ConceptActivity({ name, metric, index }: { name: string; metric: string; index: number }) {
  const tx=useInterfaceText();
 const examples = [
 [tx("Se pierde el contexto al cambiar de dispositivo."),tx("Se conserva el resumen y se confirma el resultado."),tx("Realice la tarea en dos formatos y pregunte qué falta."),tx("Prueba de tareas, SUS y entrevista")],
 [tx("Una acción ambigua obliga a repetir pasos."),tx("La acción expresa su resultado y permite cancelar."),tx("Mida éxito, segundos y errores en ambas prácticas."),tx("Prueba de tareas y SEQ")],
 [tx("El estado se comunica únicamente por color."),tx("El estado combina texto, símbolo y color."),tx("Compare filtros de color; pruebe teclado y lector."),tx("axe, WAVE, Lighthouse y prueba manual")],
 [tx("No se informa si el cambio se guardó."),tx("Se informa guardado, ubicación y siguiente paso."),tx("Pida al usuario que explique el estado sin ayuda."),tx("Pregunta de comprensión y registro de errores")],
 [tx("Se presiona al usuario con urgencia ficticia."),tx("Se explica el valor y se ofrece una salida clara."),tx("Observe finalización y abandono; pregunte el motivo."),tx("Observación, entrevista y embudo de tareas")],
 [tx("Un mensaje culpa al usuario y no ofrece salida."),tx("Un mensaje específico permite corregir sin perder datos."),tx("Pregunte confianza antes y después de la tarea."),tx("Autoinforme de emoción y entrevista")],
 [tx("Controles pequeños y cercanos dificultan la precisión."),tx("Controles amplios y separados reducen errores táctiles."),tx("Compare errores y esfuerzo en celular y reloj."),tx("Prueba táctil y observación de postura")],
 [tx("Se exige recordar un código de la pantalla anterior."),tx("La información necesaria permanece visible."),tx("Compare errores de recuerdo y tiempo de decisión."),tx("Prueba de tarea y autoinforme de carga")],
 [tx("Opciones sin nombres claros dificultan localizar una tarea."),tx("Etiquetas por intención ayudan a encontrar la tarea."),tx("Pida encontrar la tarea sin explicar la navegación."),tx("Tree testing y card sorting")],
 [tx("Una tarea depende exclusivamente de un canal."),tx("Texto, teclado y voz ofrecen vías alternativas."),tx("Complete la tarea sin sonido y después sin ratón."),tx("Matriz de contextos y prueba manual")],
 [tx("Se acepta una propuesta IA sin comprobar evidencia."),tx("Se conserva el origen y la persona valida la propuesta."),tx("Compare un hallazgo humano con uno de IA y justifique."),tx("Evaluación humana y trazabilidad de hallazgos")],
];

 const { addFinding } = useProject();
 const [good, setGood] = useState(false);
 const [notes, setNotes] = useState('');
 const [message, setMessage] = useState('');
 const [badExample, goodExample, activity, tools] = examples[index];
 const save = () => {
   setMessage('');
   if (!notes.trim()) { setMessage('Escriba lo que observó antes de guardar.'); return; }
   if(!addFinding({ heuristic: name, severity: 1, problem: notes.trim(), evidence: tx("Actividad de conceptos: {{name}}. Práctica: {{practice}}.",{name,practice:good?tx("buena"):tx("mala")}), recommendation: goodExample, source: 'human', status: 'pending' }))return;
   setNotes(''); setMessage('Observación guardada en Evaluación; requiere validación.');
 };
 return <details><summary>{tx("Demostración y actividad")}</summary><p><strong>{tx("Problema frecuente:")} </strong>{badExample}</p><p><strong>{tx("Buena práctica:")} </strong>{goodExample}</p><button className="secondary" aria-pressed={good} onClick={() => setGood(v => !v)}>{good ? tx("Mostrar mala práctica") : tx("Mostrar buena práctica")}</button><div className="mm-visual-alert">{good ? goodExample : badExample}</div><p><strong>{tx("Cómo medir:")} </strong>{metric}</p><p><strong>{tx("Herramientas:")} </strong>{tools}</p><p><strong>{tx("Actividad:")} </strong>{activity}</p><p className="fine-print">{tx("Cambiar la práctica no es una medición; registre resultados observados.")}</p><label>{tx("Observación de")} {name}<textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}/></label><button onClick={save}>{tx("Guardar observación")}</button><p role="status" data-outcome={message.startsWith("Escriba")?"error":"success"}>{message&&tx(message)}</p></details>;
}
