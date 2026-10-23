import type { ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {useEffect,useId} from 'react';

export function PageHead({ eyebrow, title, intro, actions }: { eyebrow: string; title: string; intro: string; actions?: ReactNode }) {
  const id=useId();useEffect(()=>{document.title=`${title} · HCI Lab + IA`;},[title]);
  return <header className="page-head"><div><span className="eyebrow">{eyebrow}</span><h1 aria-describedby={`${id}-description`}>{title}</h1><p id={`${id}-description`}>{intro}</p></div>{actions}</header>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty"><CheckCircle2 aria-hidden="true"/><p>{children}</p></div>;
}

export function StatusPill({ tone = 'neutral', children }: { tone?: 'neutral' | 'good' | 'bad' | 'ai'; children: ReactNode }) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}
