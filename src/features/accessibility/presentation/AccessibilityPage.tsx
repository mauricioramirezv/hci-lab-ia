import {useInterfaceText} from '../../../shared/ui/useInterfaceText';
import {useTranslation} from 'react-i18next';
import {DisplayPreferenceControls} from './DisplayPreferenceControls';
import type {DisplayPreferenceProps} from './DisplayPreferenceControls';
import { Sensory } from './Sensory';
import { useState } from 'react';
import { Code2, Upload } from 'lucide-react';
import { a11yChecks } from './checks';
import { useProject } from '../../project/presentation';
import { PageHead } from '../../../shared/ui/Page';

export function AccessibilityPage({prefs,onChange,error}:DisplayPreferenceProps) {
  const tx=useInterfaceText();
  const {t,i18n}=useTranslation();
  const { state, toggleCheck } = useProject();
  const [announcement, setAnnouncement] = useState<number>();
  const [video, setVideo] = useState('');
  return <><PageHead eyebrow={tx("WCAG 2.2 + UNIVERSAL DESIGN")} title={t('accessibility.title')} intro={t('displayPreferences.accessIntro')}/><div className="a11y-layout"><section className="panel form-panel"><h2>{t('displayPreferences.title')}</h2><DisplayPreferenceControls prefs={prefs} onChange={onChange} error={error}/><h2>{tx("Demostración semántica")}</h2><p>{tx("El botón actualiza una región viva para que el cambio no dependa solo de la vista.")}</p><button className="primary" onClick={() => setAnnouncement(Date.now())}>{tx("Anunciar actualización")}</button><p className="live-demo" data-outcome="success" aria-live="polite">{announcement&&tx("Estado actualizado a las {{time}}",{time:new Date(announcement).toLocaleTimeString(i18n.language)})}</p></section><section className="panel"><h2>{tx("Verificación manual")}</h2><div className="checklist">{a11yChecks.map(([id, label]) => <label key={id}><input type="checkbox" checked={Boolean(state.a11yChecks[id])} onChange={() => toggleCheck(id)}/><span>{tx(label)}</span></label>)}</div><div className="tool-note"><Code2/><p><strong>{tx("Automatizable:")}</strong>  {tx("axe-core y Lighthouse detectan parte de los problemas. Teclado, zoom, lector y comprensión requieren revisión manual.")}</p></div><h2>{tx("Muestra en Lengua de Señas Colombiana")}</h2><p>{tx("Se permite una muestra pequeña. El contenido debe ser producido o validado por una persona competente en LSC.")}</p>{video ? <video controls src={video} className="lsc-video"/> : <label className="file-button"><Upload/>{tx("Cargar video local")}<input type="file" accept="video/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) setVideo(URL.createObjectURL(file)); }}/></label>}<details><summary>{tx("Transcripción textual")}</summary><p>{tx("Ejemplo: “Su cita quedó confirmada. Puede modificarla o cancelarla desde Mis citas”.")}</p></details></section></div><p className="activity-help">{t('displayPreferences.simulatorsHelp')}</p><Sensory reducedMotion={prefs.motion}/></>;
}
