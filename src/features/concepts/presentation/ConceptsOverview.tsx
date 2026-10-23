import {useInterfaceText} from '../../../shared/ui/useInterfaceText';
import { ConceptActivity } from '../../multimodal/presentation';
import { Accessibility, Activity, BarChart3, Brain, Eye, Gauge, Heart, LayoutGrid, MousePointer2, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { concepts } from '../catalog';
import { PageHead } from '../../../shared/ui/Page';

const conceptIcons = [Heart, Gauge, Accessibility, Eye, Activity, Sparkles, MousePointer2, Brain, LayoutGrid, Users, ShieldCheck];

export function ConceptsPage() {
  const tx=useInterfaceText();
  return <><PageHead eyebrow="HCI + UX" title={tx("Mapa integral de conceptos")} intro={tx("Cada dimensión se conecta con una decisión observable y una forma de medirla.")}/><div className="concept-grid">{concepts.map(([name, description, metric, example], index) => { const Icon = conceptIcons[index]; return <article className="concept-card" key={name}><div className="concept-icon"><Icon/></div><h2>{tx(name)}</h2><p>{tx(description)}</p><div className="example-note"><strong>{tx("En el laboratorio")}</strong><span>{tx(example)}</span></div><small><BarChart3/> {tx(metric)}</small><ConceptActivity name={tx(name)} metric={tx(metric)} index={index}/></article>; })}</div></>;
}
