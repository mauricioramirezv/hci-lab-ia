import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProject } from './store';
import { createBackup, defaultPrefs, parseBackup } from './backup';
import type { Preferences } from './backup';
import { download } from '../../shared/files';

type Props = { prefs:Preferences; onSettings:(prefs:Preferences,language?:string)=>void; onNotice:(key:string)=>void };
export function ProjectManager({prefs,onSettings,onNotice}:Props) {
  const {state,reset,importProject} = useProject();
  const {t,i18n} = useTranslation();
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const operation = useRef(0);
  const [view,setView] = useState<'menu'|'reset'|'recover'>('menu');
  const [pending,setPending] = useState<ReturnType<typeof parseBackup>>();
  const [message,setMessage] = useState('');
  const [busy,setBusy] = useState(false);
  const isError = ['invalid','tooLarge','readFailed','storageFailed'].includes(message);
  useEffect(()=>{ if (view!=='menu') cancel.current?.focus(); },[view]);
  const close = () => { operation.current++; dialog.current?.close(); setPending(undefined); setBusy(false); };
  const open = () => { operation.current++; setView('menu'); setMessage(''); setPending(undefined); setBusy(false); dialog.current?.showModal(); };
  const backup = () => {
    try { download('hci-lab-ia-project.json',JSON.stringify(createBackup(state,prefs,i18n.language),null,2),'application/json'); setMessage('backupDone'); }
    catch { setMessage('invalid'); }
  };
  const read = async (file?:File) => {
    if (!file) return;
    const op = ++operation.current;
    setPending(undefined); setMessage('');
    if (file.size>25*1024*1024) { setMessage('tooLarge'); return; }
    setBusy(true);
    let content:string;
    try { content=await file.text(); }
    catch { if (op===operation.current) { setMessage('readFailed'); setBusy(false); } return; }
    if (op!==operation.current || !dialog.current?.open) return;
    try { setPending(parseBackup(JSON.parse(content))); setView('recover'); }
    catch { setMessage('invalid'); }
    setBusy(false);
  };
  const finish = (key:string) => { close(); onNotice(`manage.${key}`); requestAnimationFrame(()=>document.querySelector<HTMLElement>('[data-management-notice]')?.focus()); };
  const confirmReset = () => {
    if (!reset()) { setMessage('storageFailed'); return; }
    onSettings({...defaultPrefs}); finish('resetDone');
  };
  const recover = () => {
    if (!pending) return;
    try {
      if (!importProject(pending.project,pending.settings)) { setMessage('storageFailed'); return; }
      if (pending.settings) onSettings(pending.settings.preferences,pending.settings.language);
      finish('recoverDone');
    } catch { setMessage('invalid'); }
  };
  const project = pending?.project;
  return <div className="reset-control project-management" data-no-track="true">
    <button className="secondary" aria-haspopup="dialog" onClick={open}>{t('manage.title')}</button>
    <dialog ref={dialog} aria-labelledby={view==='menu' ? 'manage-title' : 'manage-confirmation-title'} aria-describedby={view==='menu' ? 'manage-intro' : 'manage-confirmation-warning'} onKeyDown={event=>event.stopPropagation()} onCancel={()=>{operation.current++;setPending(undefined);setBusy(false);}} onClose={()=>{operation.current++;setPending(undefined);setBusy(false);}}>
      <div className="management-heading"><h2 id="manage-title">{t('manage.title')}</h2><button className="icon-button" autoFocus aria-label={t('manage.close')} onClick={close}>×</button></div>
      <p id="manage-intro">{t('manage.intro')}</p>
      {view==='menu' ? <div className="manage-options">
        <section><h3>{t('manage.backup')}</h3><p>{t('manage.backupHelp')}</p><button className="secondary" onClick={backup}>{t('manage.backup')}</button></section>
        <section><h3>{t('manage.recover')}</h3><p>{t('manage.recoverHelp')}</p><label className="secondary file-control">{t('manage.file')}<input type="file" accept=".json,application/json" onChange={e=>{void read(e.target.files?.[0]);e.target.value='';}}/></label></section>
        <section><h3>{t('manage.reset')}</h3><p>{t('manage.resetHelp')}</p><button className="secondary" disabled={busy} onClick={()=>{setMessage('');setView('reset');}}>{t('manage.reset')}</button></section>
      </div> : <section>
        <h3 id="manage-confirmation-title">{t(view==='reset' ? 'manage.resetTitle' : 'manage.recoverTitle')}</h3>
        <p id="manage-confirmation-warning">{t(view==='reset' ? 'manage.resetWarning' : 'manage.recoverWarning')}</p>
        {view==='recover' && project && <><p>{t(pending.settings ? 'manage.fullInfo' : 'manage.legacyInfo')}</p><p>{t('manage.summary',{appointments:project.appointments.length,personas:project.personas.length,scenarios:project.scenarios.length,findings:project.findings.length,sessions:project.sessions.length,evidence:(project.evidence?.length || 0)+(project.multimodalEvidence?.length || 0),tracking:(project.trackingSessions?.length || 0)+(project.pageSessions?.length || 0)})}</p></>}
        <div className="upgrade-actions"><button ref={cancel} className="secondary" onClick={close}>{t('manage.cancel')}</button><button className="primary" onClick={view==='reset' ? confirmReset : recover}>{t(view==='reset' ? 'manage.confirmReset' : 'manage.confirmRecover')}</button></div>
      </section>}
      {(message || busy) && <p role={isError ? 'alert' : 'status'} className="management-message">{t(`manage.${busy ? 'reading' : message}`)}</p>}
    </dialog>
  </div>;
}
