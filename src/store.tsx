/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import type { Appointment, Finding, LabEvent, Persona, ProjectState, Scenario, TestSession } from './domain';
import { sampleProject, uid } from './domain';

const STORAGE_KEY = 'hci-lab-ia-project-v2';

type Store = {
  state: ProjectState;
  addAppointment: (item: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;
  addPersona: (item: Persona) => void;
  removePersona: (id: string) => void;
  addScenario: (item: Scenario) => void;
  removeScenario: (id: string) => void;
  addFinding: (item: Omit<Finding, 'id' | 'createdAt'>) => void;
  updateFinding: (id: string, patch: Partial<Finding>) => void;
  removeFinding: (id: string) => void;
  addSession: (item: Omit<TestSession, 'id' | 'createdAt'>) => void;
  log: (event: Omit<LabEvent, 'id' | 'at'>) => void;
  toggleCheck: (id: string) => void;
  importProject: (state: ProjectState) => void;
  reset: () => void;
};

const ProjectContext = createContext<Store | null>(null);

function readProject(): ProjectState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return sampleProject;
    const parsed = JSON.parse(saved) as ProjectState;
    return parsed.version === 2 ? parsed : sampleProject;
  } catch {
    return sampleProject;
  }
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProjectState>(readProject);
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), [state]);
  const update = (fn: (current: ProjectState) => ProjectState) => setState((current) => fn(current));
  const log = (event: Omit<LabEvent, 'id' | 'at'>) => update((current) => ({ ...current, events: [...current.events, { ...event, id: uid(), at: new Date().toISOString() }] }));

  const value: Store = {
    state,
    addAppointment: (item) => update((current) => ({ ...current, appointments: [...current.appointments, { ...item, id: uid(), status: 'confirmed', createdAt: new Date().toISOString() }] })),
    updateAppointment: (id, patch) => update((current) => ({ ...current, appointments: current.appointments.map((item) => item.id === id ? { ...item, ...patch } : item) })),
    addPersona: (item) => update((current) => ({ ...current, personas: [...current.personas, item] })),
    removePersona: (id) => update((current) => ({ ...current, personas: current.personas.filter((item) => item.id !== id) })),
    addScenario: (item) => update((current) => ({ ...current, scenarios: [...current.scenarios, item] })),
    removeScenario: (id) => update((current) => ({ ...current, scenarios: current.scenarios.filter((item) => item.id !== id) })),
    addFinding: (item) => update((current) => ({ ...current, findings: [...current.findings, { ...item, id: uid(), createdAt: new Date().toISOString() }] })),
    updateFinding: (id, patch) => update((current) => ({ ...current, findings: current.findings.map((item) => item.id === id ? { ...item, ...patch } : item) })),
    removeFinding: (id) => update((current) => ({ ...current, findings: current.findings.filter((item) => item.id !== id) })),
    addSession: (item) => update((current) => ({ ...current, sessions: [...current.sessions, { ...item, id: uid(), createdAt: new Date().toISOString() }] })),
    log,
    toggleCheck: (id) => update((current) => ({ ...current, a11yChecks: { ...current.a11yChecks, [id]: !current.a11yChecks[id] } })),
    importProject: (project) => setState(project),
    reset: () => setState(sampleProject),
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const store = useContext(ProjectContext);
  if (!store) throw new Error('useProject must be used inside ProjectProvider');
  return store;
}
