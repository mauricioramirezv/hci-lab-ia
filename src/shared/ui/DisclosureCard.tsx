import type { ReactNode, Ref } from 'react';
import { ChevronDown } from 'lucide-react';
import './disclosure.css';

export function DisclosureCard({
  id, title, open, onToggle, children, className = '', triggerRef, headingLevel = 2,
}: {
  id: string;
  title: ReactNode;
  open: boolean;
  onToggle: (nextOpen: boolean) => void;
  children: ReactNode;
  className?: string;
  triggerRef?: Ref<HTMLButtonElement>;
  headingLevel?: 2 | 3;
}) {
  const headingId = `${id}-heading`;
  const panelId = `${id}-panel`;
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  return <section className={`disclosure-card panel ${className}`}>
    <Heading className="disclosure-heading">
      <button ref={triggerRef} type="button" id={headingId} className="disclosure-toggle" aria-expanded={open} aria-controls={panelId} onClick={event => onToggle(event.currentTarget.getAttribute('aria-expanded') !== 'true')}>
        <span>{title}</span><ChevronDown aria-hidden="true" size={20}/>
      </button>
    </Heading>
    <div id={panelId} className="disclosure-content" role="region" aria-labelledby={headingId} hidden={!open}>{children}</div>
  </section>;
}
