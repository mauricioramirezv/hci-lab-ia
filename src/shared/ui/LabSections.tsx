import { useEffect, useState, type ReactNode } from 'react';
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
  const [open, setOpen] = useState<Record<string, boolean>>({ [active]: true });
  useEffect(() => { setOpen({ [active]: true }); }, [active]);
  return <div className="lab-sections">
    {sections.map(section => <DisclosureCard
      key={section.id} id={`lab-section-${section.id}`} title={section.title}
      open={!!open[section.id]} onToggle={nextOpen => setOpen(value => ({ ...value, [section.id]: nextOpen }))}
    >
      {active === section.id ? children : <nav className="lab-navigation" aria-label={navigationLabel}>
        <p>{section.intro}</p>
        <NavLink className="secondary" to={section.href}>{section.title}</NavLink>
      </nav>}
    </DisclosureCard>)}
  </div>;
}
