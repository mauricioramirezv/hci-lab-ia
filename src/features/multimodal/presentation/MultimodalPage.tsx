import {version} from '../../../../package.json';
import { actionState, voiceCommand } from '../domain/commands';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AccessibilityMode, DeviceContext } from '../../project/domain';
import { useProject } from '../../project/presentation';
import { PageHead } from '../../../shared/ui/Page';
import { DisclosureCard } from '../../../shared/ui/DisclosureCard';
import { ColorBlindSimulator } from './ColorBlindSimulator';
import { DeviceComparison } from './DeviceComparison';
import { deviceIds } from '../domain/constants';
import { SmartwatchSimulator } from './SmartwatchSimulator';
import { InfotainmentSimulator } from './InfotainmentSimulator';
import { HapticFeedback } from './HapticFeedback';
import { VoiceInteraction } from './VoiceInteraction';

export function MultimodalPage() {
  const { t } = useTranslation();
  const { state, addMultimodalEvidence } = useProject();
  const [device, setDevice] = useState<DeviceContext>('watch');
  const [practice, setPractice] = useState<'good' | 'bad'>('good');
  const [vision, setVision] = useState<AccessibilityMode>('normal');
  const [moving, setMoving] = useState(false);
  const [light, setLight] = useState(false);
  const [status, setStatus] = useState('pending');
  const [channelStatus, setChannelStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [confidence, setConfidence] = useState(3);
  const [saved, setSaved] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ 'multimodal-controls': true, 'multimodal-demo': true });
  const toggleSection = (id: string) => setExpandedSections(current => ({ ...current, [id]: !current[id] }));
  const good = practice === 'good';
  const action = (value:string) => setStatus(actionState(value));
  const command = (text:string) => {const value=voiceCommand(text);if(value)action(value);else setChannelStatus(t('multimodal.unknown'));};
  const save = () => {
    if (!notes.trim()) { setSaved(t('multimodal.required')); return; }
    if(!addMultimodalEvidence({ device, practice, vision, notes: notes.trim(), confidence, demoStatus: t(`multimodal.${status}`), channelStatus }))return;
    setNotes(''); setSaved(t('multimodal.saved'));
  };
  return <div className="mm-page"><PageHead eyebrow={`HCI · ${t('closure.version',{version})}`} title={t('multimodal.title')} intro={t('multimodal.intro')}/>
    <div className="mm-accordion">
    <DisclosureCard id="multimodal-controls" title={t('multimodal.device')} open={!!expandedSections['multimodal-controls']} onToggle={() => toggleSection('multimodal-controls')}><div className="panel mm-controls"><label>{t('multimodal.device')}<select value={device} onChange={e => { setDevice(e.target.value as DeviceContext); setStatus('pending'); setChannelStatus(''); }}>{deviceIds.map(k => <option value={k} key={k}>{t(`multimodal.${k}`)}</option>)}</select></label><label>{t('multimodal.practice')}<select value={practice} onChange={e => setPractice(e.target.value as 'good' | 'bad')}><option value="good">{t('multimodal.good')}</option><option value="bad">{t('multimodal.bad')}</option></select></label></div></DisclosureCard>
    <DisclosureCard id="multimodal-demo" title={t('multimodal.task')} open={!!expandedSections['multimodal-demo']} onToggle={() => toggleSection('multimodal-demo')}><div className="mm-grid"><section className="panel mm-panel"><h2>{t('multimodal.task')} · {t(`multimodal.${device}`)}</h2><p className="fine-print">{t('multimodal.demo')}</p>
      {device === 'watch' ? <SmartwatchSimulator good={good} onAction={action}/> : device === 'car' ? <InfotainmentSimulator moving={moving} setMoving={setMoving} good={good} onAction={action}/> : <div className={`mm-device mm-${device} ${good ? '' : 'mm-dense'}`}>
        {!good && <p className="mm-clutter">INFO · UX · 23 · 07 · MENU · 12 · 08 · 61</p>}
        {device === 'iot' ? <><h3>{t('multimodal.light')}: {t(light ? 'multimodal.on' : 'multimodal.off')}</h3><button aria-pressed={light} onClick={() => { setLight(v => !v); setStatus(light ? 'off' : 'on'); }}>{t('multimodal.toggle')}</button></> : device === 'tv' ? <><h3>{t('multimodal.program')}</h3><button onClick={() => action('play')}>{t('multimodal.play')}</button></> : device === 'kiosk' ? <><h3>{t('multimodal.ticket')}</h3><button onClick={() => action('ticket')}>{t('multimodal.ticket')}</button></> : <><h3>{t('multimodal.appointment')}</h3><div className="mm-actions"><button onClick={() => action('confirm')}>{good ? t('multimodal.confirm') : 'OK'}</button><button className="secondary" onClick={() => action('cancel')}>{good ? t('multimodal.cancel') : 'X'}</button></div></>}
      </div>}
      <p className="mm-state" role="status" aria-label={t('multimodal.status')}>{t(`multimodal.${status}`)}</p>
    </section><ColorBlindSimulator mode={vision} setMode={setVision} good={good}/></div></DisclosureCard>
    <DisclosureCard id="multimodal-channels" title={t('multimodal.channels')} open={!!expandedSections['multimodal-channels']} onToggle={() => toggleSection('multimodal-channels')}><div className="mm-grid"><VoiceInteraction status={t(`multimodal.${status}`)} onCommand={command} onStatus={setChannelStatus}/><HapticFeedback onStatus={setChannelStatus}/></div><p className="mm-state" role="status" aria-label={t('multimodal.channel')}>{channelStatus}</p></DisclosureCard>
    <DisclosureCard id="multimodal-devices" title={t('multimodal.devices')} open={!!expandedSections['multimodal-devices']} onToggle={() => toggleSection('multimodal-devices')}><DeviceComparison selected={device}/></DisclosureCard>
    <DisclosureCard id="multimodal-evidence" title={t('multimodal.history')} open={!!expandedSections['multimodal-evidence']} onToggle={() => toggleSection('multimodal-evidence')}><section className="panel mm-panel"><h2>{t('multimodal.evidence')}</h2><p>{t('multimodal.notesHelp')}</p><label>{t('multimodal.notes')}<textarea value={notes} onChange={e => { setNotes(e.target.value); setSaved(''); }} rows={3}/></label><label>{t('multimodal.rating')}<select value={confidence} onChange={e => setConfidence(Number(e.target.value))}>{[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}</select></label><button onClick={save}>{t('multimodal.evidence')}</button><p role="status">{saved}</p>
      <h3>{t('multimodal.history')}</h3>{!(state.multimodalEvidence || []).length && <p>{t('multimodal.noEvidence')}</p>}<div className="mm-evidence-list">{(state.multimodalEvidence || []).slice().reverse().map(e => <article key={e.id}><strong>{t(`multimodal.${e.device}`)} · {t(`multimodal.${e.practice}`)} · {t(`multimodal.${e.vision}`)}</strong><p>{e.notes}</p><small>{e.createdAt} · {t('multimodal.rating')}: {e.confidence}/5</small><p>{e.demoStatus}</p>{e.channelStatus && <p>{e.channelStatus}</p>}</article>)}</div>
    </section></DisclosureCard>
    </div></div>;
}
