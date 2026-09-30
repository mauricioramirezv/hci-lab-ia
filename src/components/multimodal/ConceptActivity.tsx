import { useState } from 'react';
import { useProject } from '../../store';
const examples = [
 ['Se pierde el contexto al cambiar de dispositivo.','Se conserva el resumen y se confirma el resultado.','Realice la tarea en dos formatos y pregunte qué falta.','Prueba de tareas, SUS y entrevista'],
 ['Una acción ambigua obliga a repetir pasos.','La acción expresa su resultado y permite cancelar.','Mida éxito, segundos y errores en ambas prácticas.','Prueba de tareas y SEQ'],
 ['El estado se comunica únicamente por color.','El estado combina texto, símbolo y color.','Compare filtros de color; pruebe teclado y lector.','axe, WAVE, Lighthouse y prueba manual'],
 ['No se informa si el cambio se guardó.','Se informa guardado, ubicación y siguiente paso.','Pida al usuario que explique el estado sin ayuda.','Pregunta de comprensión y registro de errores'],
 ['Se presiona al usuario con urgencia ficticia.','Se explica el valor y se ofrece una salida clara.','Observe finalización y abandono; pregunte el motivo.','Observación, entrevista y embudo de tareas'],
 ['Un mensaje culpa al usuario y no ofrece salida.','Un mensaje específico permite corregir sin perder datos.','Pregunte confianza antes y después de la tarea.','Autoinforme de emoción y entrevista'],
 ['Controles pequeños y cercanos dificultan la precisión.','Controles amplios y separados reducen errores táctiles.','Compare errores y esfuerzo en celular y reloj.','Prueba táctil y observación de postura'],
 ['Se exige recordar un código de la pantalla anterior.','La información necesaria permanece visible.','Compare errores de recuerdo y tiempo de decisión.','Prueba de tarea y autoinforme de carga'],
 ['Opciones sin nombres claros dificultan localizar una tarea.','Etiquetas por intención ayudan a encontrar la tarea.','Pida encontrar la tarea sin explicar la navegación.','Tree testing y card sorting'],
 ['Una tarea depende exclusivamente de un canal.','Texto, teclado y voz ofrecen vías alternativas.','Complete la tarea sin sonido y después sin ratón.','Matriz de contextos y prueba manual'],
 ['Se acepta una propuesta IA sin comprobar evidencia.','Se conserva el origen y la persona valida la propuesta.','Compare un hallazgo humano con uno de IA y justifique.','Evaluación humana y trazabilidad de hallazgos'],
];
export function ConceptActivity({ name, metric, index }: { name: string; metric: string; index: number }) {
 const { addFinding } = useProject();
 const [good, setGood] = useState(false);
 const [notes, setNotes] = useState('');
 const [message, setMessage] = useState('');
 const [badExample, goodExample, activity, tools] = examples[index];
 const save = () => {
   if (!notes.trim()) { setMessage('Escriba lo que observó antes de guardar.'); return; }
   addFinding({ heuristic: name, severity: 1, problem: notes.trim(), evidence: `Actividad de conceptos: ${name}. Práctica: ${good ? 'buena' : 'mala'}.`, recommendation: goodExample, source: 'human', status: 'pending' });
   setNotes(''); setMessage('Observación guardada en Evaluación; requiere validación.');
 };
 return <details><summary>Demostración y actividad</summary><p><strong>Problema frecuente: </strong>{badExample}</p><p><strong>Buena práctica: </strong>{goodExample}</p><button className="secondary" aria-pressed={good} onClick={() => setGood(v => !v)}>{good ? 'Mostrar mala práctica' : 'Mostrar buena práctica'}</button><div className="mm-visual-alert">{good ? goodExample : badExample}</div><p><strong>Cómo medir: </strong>{metric}</p><p><strong>Herramientas: </strong>{tools}</p><p><strong>Actividad: </strong>{activity}</p><p className="fine-print">Cambiar la práctica no es una medición; registre resultados observados.</p><label>Observación de {name}<textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}/></label><button onClick={save}>Guardar observación</button><p role="status">{message}</p></details>;
}
