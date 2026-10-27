import { useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { DisclosureCard } from './DisclosureCard';
import './lab-sections.css';

type LabSection = { id: string; title: string; intro: string; href: string };

/** Local exercises remain inside their own navigation cards. */
export function LabSections({ active, sections, navigationLabel, children }: {
  active: string;
  sections: LabSection[];
  navigationLabel: string;
  children: ReactNode;
}) {
  const [expansion, setExpansion] = useState<{ active: string; sections: Record<string, boolean> }>(() => ({
    active,
    sections: { [active]: true },
  }));
  // Derive the initial expanded card from the current route in this render.
  // An effect leaves one committed render with the previous route's state.
  const open = expansion.active === active ? expansion.sections : { [active]: true };
  return <div className="lab-sections">
    {sections.map(section => <DisclosureCard
      key={section.id} id={`lab-section-${section.id}`} title={section.title}
      open={!!open[section.id]} onToggle={nextOpen => setExpansion({
        active,
        sections: { ...open, [section.id]: nextOpen },
      })}
    >
      {active === section.id ? children : <nav className="lab-navigation" aria-label={navigationLabel}>
        <p>{section.intro}</p>
        <NavLink className="secondary" to={section.href}>{section.title}</NavLink>
      </nav>}
    </DisclosureCard>)}
  </div>;
}
