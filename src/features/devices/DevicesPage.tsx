import {useInterfaceText} from '../../shared/ui/useInterfaceText';
import { useState } from 'react';
import { Check, Clock3, Monitor, MousePointer2, Smartphone, Tablet, Watch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHead } from '../../shared/ui/Page';
import { AppointmentFlow } from '../reservations/presentation';

export type Device = 'desktop' | 'tablet' | 'mobile' | 'watch';

export function DevicesPage() {
  const tx=useInterfaceText();
  const { t } = useTranslation();
  const [device, setDevice] = useState<Device>('desktop');
  const icons = { desktop: Monitor, tablet: Tablet, mobile: Smartphone, watch: Watch };
  const priorities: Record<Device, string[]> = { desktop: [tx("Comparar horarios"), tx("Ver contexto y ayuda"), tx("Administrar citas")], tablet: [tx("Entrada táctil"), tx("Orientación variable"), tx("Continuidad")], mobile: [tx("Una tarea por vista"), tx("Acciones al alcance"), tx("Conectividad variable")], watch: [tx("Estado de un vistazo"), tx("Confirmar o cancelar"), tx("Sin captura extensa")] };
  return <><PageHead eyebrow={tx("MULTIFORMAT")} title={t('devices.title')} intro={tx("La misma tarea cambia jerarquía, densidad, navegación y controles según el contexto; no es solo reducir el ancho.")}/><div className="device-tabs">{(['desktop', 'tablet', 'mobile', 'watch'] as Device[]).map((item) => { const Icon = icons[item]; return <button key={item} onClick={() => setDevice(item)} className={device === item ? 'selected' : ''}><Icon/>{t(`devices.${item}`)}</button>; })}</div><div className="device-layout"><div className={`device-stage ${device}`}><div className="device-frame"><div className="device-bar"><span/><span/><span/></div>{device === 'watch' ? <div className="watch-glance"><Clock3/><strong>10:30</strong><span>{tx("Asesoría UX")}</span><button><Check/>{tx("Confirmar")}</button></div> : <AppointmentFlow compact/>}</div></div><aside className="panel context-panel"><h2>{tx("Prioridades del contexto")}</h2><ul>{priorities[device].map((item) => <li key={item}>{item}</li>)}</ul><div className="ergonomic-note"><MousePointer2/><p><strong>{tx("Ergonomía:")}</strong>  {tx("objetivos táctiles amplios, separación suficiente y acción principal alcanzable.")}</p></div></aside></div></>;
}
