import { useState } from 'react';
import { CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import { antiPatterns } from './catalog';
import { PageHead, StatusPill } from '../../shared/ui/Page';

export function PracticesPage() {
  const [open, setOpen] = useState(antiPatterns[0].id);
  return <><PageHead eyebrow="PATTERN LIBRARY" title="Buenas prácticas y antipatrones" intro="Compare decisiones equivalentes. La mala práctica es deliberada y sirve como objeto de evaluación, no como plantilla."/><div className="pattern-list">{antiPatterns.map((pattern) => <article key={pattern.id} className="pattern-row"><button className="pattern-heading" aria-expanded={open === pattern.id} onClick={() => setOpen(open === pattern.id ? '' : pattern.id)}><span>{pattern.title}</span><StatusPill>{pattern.principle}</StatusPill><ChevronRight/></button>{open === pattern.id && <div className="pattern-comparison"><div className="good-sample"><CheckCircle2/><div><strong>Buena práctica</strong><p>{pattern.good}</p></div></div><div className="bad-sample"><XCircle/><div><strong>No se debe hacer</strong><p>{pattern.bad}</p></div></div></div>}</article>)}</div></>;
}
