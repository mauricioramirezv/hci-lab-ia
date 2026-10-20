import { ConceptActivity } from '../multimodal/ConceptActivity';
import { Accessibility, Activity, BarChart3, Brain, Eye, Gauge, Heart, LayoutGrid, MousePointer2, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { concepts } from './catalog';
import { PageHead } from '../../shared/ui/Page';

const conceptIcons = [Heart, Gauge, Accessibility, Eye, Activity, Sparkles, MousePointer2, Brain, LayoutGrid, Users, ShieldCheck];

export function ConceptsPage() {
  return <><PageHead eyebrow="HCI + UX" title="Mapa integral de conceptos" intro="Cada dimensión se conecta con una decisión observable y una forma de medirla."/><div className="concept-grid">{concepts.map(([name, description, metric, example], index) => { const Icon = conceptIcons[index]; return <article className="concept-card" key={name}><div className="concept-icon"><Icon/></div><h2>{name}</h2><p>{description}</p><div className="example-note"><strong>En el laboratorio</strong><span>{example}</span></div><small><BarChart3/> {metric}</small><ConceptActivity name={name} metric={metric} index={index}/></article>; })}</div></>;
}
