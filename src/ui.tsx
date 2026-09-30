import type { ReactNode } from 'react';
import { CheckCircle2, Download, Upload } from 'lucide-react';
import { useProject } from './store';
import type { ProjectState } from './domain';

export function PageHead({ eyebrow, title, intro, actions }: { eyebrow: string; title: string; intro: string; actions?: ReactNode }) {
  return <header className="page-head"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div>{actions}</header>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty"><CheckCircle2 aria-hidden="true"/><p>{children}</p></div>;
}

export function ProjectActions() {
  const { state, importProject, log } = useProject();
  const exportProject = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = 'hci-lab-ia-project.json';
    anchor.click();
    URL.revokeObjectURL(anchor.href);
    log({ type: 'export', detail: 'project-json' });
  };
  const onImport = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as ProjectState;
        if (parsed.version !== 2) throw new Error('Version');
        importProject(parsed);
      } catch { window.alert('El archivo no corresponde a un proyecto HCI Lab + IA v2.'); }
    };
    reader.readAsText(file);
  };
  return <div className="project-actions">
    <button className="secondary" onClick={exportProject}><Download/>Exportar proyecto</button>
    <label className="secondary file-control"><Upload/>Importar<input type="file" accept="application/json" onChange={(event) => onImport(event.target.files?.[0])}/></label>
  </div>;
}

export function StatusPill({ tone = 'neutral', children }: { tone?: 'neutral' | 'good' | 'bad' | 'ai'; children: ReactNode }) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}
