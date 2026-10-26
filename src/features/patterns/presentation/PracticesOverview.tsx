import {useInterfaceText} from '../../../shared/ui/useInterfaceText';
import { useState } from 'react';
import { CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import { antiPatterns } from '../catalog';
import { PageHead, StatusPill } from '../../../shared/ui/Page';

export function PracticesPage() {
  const tx=useInterfaceText();
  const [open, setOpen] = useState('');
  return <><PageHead eyebrow={tx("PATTERN LIBRARY")} title={tx("Buenas prácticas y antipatrones")} intro={tx("Compare decisiones equivalentes. La mala práctica es deliberada y sirve como objeto de evaluación, no como plantilla.")}/><div className="pattern-list">{antiPatterns.map((pattern) => <article key={pattern.id} className="pattern-row"><button className="pattern-heading" aria-expanded={open === pattern.id} onClick={() => setOpen(open === pattern.id ? '' : pattern.id)}><span>{tx(pattern.title)}</span><StatusPill>{tx(pattern.principle)}</StatusPill><ChevronRight/></button>{open === pattern.id && <div className="pattern-comparison"><div className="good-sample"><CheckCircle2/><div><strong>{tx("Buena práctica")}</strong><p>{tx(pattern.good)}</p></div></div><div className="bad-sample"><XCircle/><div><strong>{tx("No se debe hacer")}</strong><p>{tx(pattern.bad)}</p></div></div></div>}</article>)}</div></>;
}
