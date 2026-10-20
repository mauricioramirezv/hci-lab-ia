import type { Evidence } from './evidence';
import type { PageSession } from '../tracking/pageSession';
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Appointment, MultimodalEvidence, Finding, LabEvent, Persona, ProjectState, Scenario, TestSession, ReportDraft } from './domain';
import { uid } from './domain';
import { commitProject, defaultPrefs, emptyProject, parseBackup, PROJECT_KEY } from './backup';
import type { BackupSettings } from './backup';
import { useTranslation } from 'react-i18next';
import { shutdownGazer, getGazer } from '../tracking/webgazer';
import type { TrackingSession } from '../tracking/model';
import { savePersona, deletePersona } from '../research/model';
import { createReservationOperations } from '../reservations/application/operations';
import type { ReservationOperations } from '../reservations/application/operations';
import { createProjectReservationRepository } from '../reservations/infrastructure/projectReservationRepository';

const STORAGE_KEY = PROJECT_KEY;

type Store = {
  reservations: ReservationOperations;
  saveReportDraft: (draft:ReportDraft) => boolean;
  epoch: number;
  addEvidence: (item: Omit<Evidence, 'id' | 'createdAt'>) => void;
  removeEvidence: (id: string) => void;
  addPageSession: (item: Omit<PageSession, 'id' | 'createdAt'>) => void;
  removePageSession: (id: string) => void;
  state: ProjectState;
  storageError: string;
  addAppointment: (item: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;
  addPersona: (item: Persona) => void;
  savePersona: (item: Persona) => void;
  removePersona: (id: string) => void;
  addScenario: (item: Scenario) => void;
  saveScenario: (item: Scenario) => void;
  removeScenario: (id: string) => void;
  addFinding: (item: Omit<Finding, 'id' | 'createdAt'>) => void;
  updateFinding: (id: string, patch: Partial<Finding>) => void;
  removeFinding: (id: string) => void;
  addSession: (item: Omit<TestSession, 'id' | 'createdAt'>) => void;
  log: (event: Omit<LabEvent, 'id' | 'at'>) => void;
  addMultimodalEvidence: (item: Omit<MultimodalEvidence, 'id' | 'createdAt'>) => void;
  addTrackingSession: (item: Omit<TrackingSession, 'id' | 'createdAt'>) => void;
  removeTrackingSession: (id: string) => void;
  toggleCheck: (id: string) => void;
  importProject: (state: ProjectState, settings?:BackupSettings) => boolean;
  reset: () => boolean;
};

const ProjectContext = createContext<Store | null>(null);

function readProject(): {state:ProjectState;invalid:boolean} {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {state:emptyProject(),invalid:false};
    return {state:parseBackup(JSON.parse(saved)).project,invalid:false};
  } catch {
    return {state:emptyProject(),invalid:true};
  }
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [epoch, setEpoch] = useState(0);
  const generation = useRef(0);
  const revision = generation.current;
  const { t } = useTranslation();
  const [initial] = useState(readProject);
  const [state, setState] = useState<ProjectState>(initial.state);
  // One project object: the ref makes commands atomic before React publishes its view.
  const currentProject = useRef(state);
  const [errorKey, setErrorKey] = useState(initial.invalid ? 'manage.storedInvalid' : '');
  const storageError = errorKey ? t(errorKey) : '';
  useEffect(() => {
    if (initial.invalid && state===initial.state) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); setErrorKey(''); }
    catch { setErrorKey('manage.storageFailed'); }
  }, [state,initial]);
  const replace = (project:ProjectState, settings?:{preferences:BackupSettings['preferences'];language?:string}) => {
    try { commitProject(project,settings); }
    catch { setErrorKey('manage.storageFailed'); return false; }
    generation.current++;
    try { shutdownGazer(); void getGazer()?.clearData().catch(()=>{}); } catch { /* Component cleanup also releases camera. */ }
    try { window.speechSynthesis?.cancel(); navigator.vibrate?.(0); } catch { /* Optional browser APIs. */ }
    currentProject.current=project; setState(project); setEpoch(v=>v+1); setErrorKey('');
    return true;
  };
  const update = (fn: (current: ProjectState) => ProjectState) => {
    if (generation.current!==revision) return;
    const next=fn(currentProject.current);
    currentProject.current=next; setState(next);
  };
  const log = (event: Omit<LabEvent, 'id' | 'at'>) => update((current) => ({ ...current, events: [...current.events, { ...event, id: uid(), at: new Date().toISOString() }] }));
  const reservations = createReservationOperations(createProjectReservationRepository({
    read: () => currentProject.current,
    isCurrent: () => generation.current===revision,
    save: project => {
      if (initial.invalid && currentProject.current===initial.state) throw new Error('Invalid stored project requires recovery');
      commitProject(project);
      currentProject.current=project; setState(project); setErrorKey('');
    },
    onStorageError: () => setErrorKey('manage.storageFailed'),
  }), {id:uid, now:() => new Date()});

  const value: Store = {
    saveReportDraft: draft => {if(generation.current!==revision)return false;try {commitProject({...currentProject.current,reportDraft:draft});update(current=>({...current,reportDraft:draft}));setErrorKey('');return true;}catch{setErrorKey('manage.storageFailed');return false;}},
    reservations,
    state, epoch,
    addEvidence: (item) => update(current => ({...current, evidence: [...(current.evidence || []), {...item, id: uid(), createdAt: new Date().toISOString()}]})),
    removeEvidence: (id) => update(current => ({...current, evidence: (current.evidence || []).filter(e => e.id !== id)})),
    addPageSession: (item) => update(current => ({...current, pageSessions: [...(current.pageSessions || []), {...item, id: uid(), createdAt: new Date().toISOString()}]})),
    removePageSession: (id) => update(current => ({...current, pageSessions: (current.pageSessions || []).filter(e => e.id !== id)})),
    storageError,
    // Compatibility for existing project callers; the legacy example keeps its date policy.
    addAppointment: item => { reservations.create(item,{variant:'example'}); },
    updateAppointment: (id, patch) => {
      if (patch.status==='cancelled') { reservations.cancel(id); return; }
      const previous=reservations.get(id);
      if (previous) reservations.reschedule(id,{...previous,...patch},'example');
    },
    addPersona: (item) => update((current) => ({ ...current, personas: [...current.personas, item] })),
    savePersona: (item) => update(current=>savePersona(current,item)),
    removePersona: (id) => update(current=>deletePersona(current,id)),
    addScenario: (item) => update((current) => ({ ...current, scenarios: [...current.scenarios, item] })),
    saveScenario: (item) => update(current=>current.personas.some(p=>p.id===item.personaId) ? {...current,scenarios:current.scenarios.some(s=>s.id===item.id)?current.scenarios.map(s=>s.id===item.id?item:s):[...current.scenarios,item]} : current),
    removeScenario: (id) => update((current) => ({ ...current, scenarios: current.scenarios.filter((item) => item.id !== id) })),
    addFinding: (item) => update((current) => ({ ...current, findings: [...current.findings, { ...item, id: uid(), createdAt: new Date().toISOString() }] })),
    updateFinding: (id, patch) => update((current) => ({ ...current, findings: current.findings.map((item) => item.id === id ? { ...item, ...patch } : item) })),
    removeFinding: (id) => update((current) => ({ ...current, findings: current.findings.filter((item) => item.id !== id) })),
    addSession: (item) => update((current) => ({ ...current, sessions: [...current.sessions, { ...item, id: uid(), createdAt: new Date().toISOString() }] })),
    log,
    addMultimodalEvidence: (item) => update((current) => ({ ...current, multimodalEvidence: [...(current.multimodalEvidence || []), { ...item, id: uid(), createdAt: new Date().toISOString() }] })),
    addTrackingSession: (item) => update((current) => ({ ...current, trackingSessions: [...(current.trackingSessions || []), { ...item, id: uid(), createdAt: new Date().toISOString() }] })),
    removeTrackingSession: (id) => update((current) => ({ ...current, trackingSessions: (current.trackingSessions || []).filter(item => item.id !== id) })),
    toggleCheck: (id) => update((current) => ({ ...current, a11yChecks: { ...current.a11yChecks, [id]: !current.a11yChecks[id] } })),
    importProject: (project, settings) => { const parsed=parseBackup({...project,...(settings ? {backup:{format:'hci-lab-ia-backup',version:1,exportedAt:new Date().toISOString(),...settings}} : {})}); return replace(parsed.project,parsed.settings); },
    reset: () => replace(emptyProject(),{preferences:{...defaultPrefs}}),
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const store = useContext(ProjectContext);
  if (!store) throw new Error('useProject must be used inside ProjectProvider');
  return store;
}
