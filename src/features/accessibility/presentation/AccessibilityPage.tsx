import { Sensory } from './Sensory';
import { useState } from 'react';
import { Code2, RotateCcw, Upload } from 'lucide-react';
import { a11yChecks } from './checks';
import { useProject } from '../../project/presentation';
import { PageHead } from '../../../shared/ui/Page';

import {defaultPrefs} from '../../project/domain';
import type {Preferences as Prefs} from '../../project/domain';
export type {Preferences as Prefs} from '../../project/domain';
const initialAccessibilityPrefs:Prefs={...defaultPrefs};

export function AccessibilityPage({ prefs, setPrefs }: { prefs: Prefs; setPrefs: React.Dispatch<React.SetStateAction<Prefs>> }) {
  const { state, toggleCheck } = useProject();
  const [announcement, setAnnouncement] = useState('');
  const [video, setVideo] = useState('');
  const set = (key: keyof Prefs, value: boolean | number) => setPrefs((current) => ({ ...current, [key]: value }));
  return <><PageHead eyebrow="WCAG 2.2 + UNIVERSAL DESIGN" title="Centro de accesibilidad" intro="Ajuste la experiencia, verifique criterios básicos y pruebe una muestra multimedia con transcripción. La automatización no sustituye pruebas con personas."/><div className="a11y-layout"><section className="panel form-panel"><h2>Preferencias de lectura</h2>{([['dark', 'Fondo oscuro'], ['contrast', 'Alto contraste'], ['spacing', 'Espaciado de lectura'], ['dyslexia', 'Tipografía y renglón accesibles'], ['motion', 'Reducir movimiento']] as const).map(([key, label]) => <label className="check-row" key={key}><input type="checkbox" checked={Boolean(prefs[key])} onChange={(event) => set(key, event.target.checked)}/><span>{label}</span></label>)}<label>Tamaño del texto: {prefs.font}%<input type="range" min="100" max="200" step="25" value={prefs.font} onChange={(event) => set('font', Number(event.target.value))}/></label><button className="secondary" onClick={() => setPrefs(initialAccessibilityPrefs)}><RotateCcw/>Restablecer preferencias</button><h2>Demostración semántica</h2><p>El botón actualiza una región viva para que el cambio no dependa solo de la vista.</p><button className="primary" onClick={() => setAnnouncement(`Estado actualizado a las ${new Date().toLocaleTimeString()}`)}>Anunciar actualización</button><p className="live-demo" aria-live="polite">{announcement}</p></section><section className="panel"><h2>Verificación manual</h2><div className="checklist">{a11yChecks.map(([id, label]) => <label key={id}><input type="checkbox" checked={Boolean(state.a11yChecks[id])} onChange={() => toggleCheck(id)}/><span>{label}</span></label>)}</div><div className="tool-note"><Code2/><p><strong>Automatizable:</strong> axe-core y Lighthouse detectan parte de los problemas. Teclado, zoom, lector y comprensión requieren revisión manual.</p></div><h2>Muestra en Lengua de Señas Colombiana</h2><p>Se permite una muestra pequeña. El contenido debe ser producido o validado por una persona competente en LSC.</p>{video ? <video controls src={video} className="lsc-video"/> : <label className="file-button"><Upload/>Cargar video local<input type="file" accept="video/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) setVideo(URL.createObjectURL(file)); }}/></label>}<details><summary>Transcripción textual</summary><p>Ejemplo: “Su cita quedó confirmada. Puede modificarla o cancelarla desde Mis citas”.</p></details></section></div><Sensory/></>;
}
