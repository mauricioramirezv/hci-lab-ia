import type { ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function PageHead({ eyebrow, title, intro, actions }: { eyebrow: string; title: string; intro: string; actions?: ReactNode }) {
  return <header className="page-head"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div>{actions}</header>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty"><CheckCircle2 aria-hidden="true"/><p>{children}</p></div>;
}

export function StatusPill({ tone = 'neutral', children }: { tone?: 'neutral' | 'good' | 'bad' | 'ai'; children: ReactNode }) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}
