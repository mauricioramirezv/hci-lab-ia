import {persistPreferences,persistLanguage} from '../features/project/infrastructure';
import { Patterns } from '../features/patterns/presentation';
import { Concepts } from '../features/concepts/presentation';
import { Experiments } from '../features/experiments/presentation';
import { Chatbots } from '../features/chatbots/presentation';
import {ReportsModule as Reports} from '../features/reports/presentation';
import {PageTracker} from '../features/tracking/presentation';
import { ProjectManager } from '../features/project/presentation';
import {readPreferences} from '../features/project/infrastructure';
import type {Preferences} from '../features/project/domain';
import { useProject } from '../features/project/presentation';
import { MultimodalPage } from '../features/multimodal/presentation';
import {TrackingPage} from '../features/tracking/presentation';
import {TrackingProvider} from '../features/tracking/presentation';
import { useEffect, useRef, useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Accessibility, BarChart3, Bot, Brain, CalendarCheck, Eye, FlaskConical, Gauge, Languages, LayoutTemplate, Menu, Monitor, Moon, ShieldCheck, Sun, TestTube2, Users, X } from 'lucide-react';
import { AccessibilityPage } from '../features/accessibility/presentation';
import { AiStudioPage } from '../features/ai/presentation';
import { CoursePage } from '../features/course/CoursePage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { DevicesPage } from '../features/devices/DevicesPage';
import {EvaluationPage} from '../features/evaluation/presentation';
import { LabPage } from '../features/reservations/presentation';
import { MetricsPage } from '../features/metrics/MetricsPage';
import { QualityPage } from '../features/quality/QualityPage';
import { ResearchPage } from '../features/research/presentation';
import {TestingPage} from '../features/evaluation/presentation';

type Prefs = Preferences;

function AppShell() {
  const { epoch, storageError } = useProject();
  const { t, i18n } = useTranslation();
  const [menu, setMenu] = useState(false);
  const [managementMessage,setManagementNotice] = useState({key:'',sequence:0});
  const setManagementMessage = (key:string) => setManagementNotice(current=>({key,sequence:current.sequence+1}));
  const { pathname } = useLocation();
  const sidebar = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const previousPath = useRef(pathname);
  const closeMenu = () => { setMenu(false); requestAnimationFrame(() => menuButton.current?.focus()); };
  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      requestAnimationFrame(() => { document.getElementById('main-content')?.focus({ preventScroll:true }); window.scrollTo(0, 0); });
    }
    const heading = document.querySelector('main h1')?.textContent;
    document.title = `${heading || t('common.title')} · HCI Lab + IA`;
    document.querySelectorAll<HTMLElement>('.table-wrap,.mm-table-scroll').forEach(el => { el.tabIndex = 0; });
  }, [pathname, t]);
  useEffect(() => {
    if (!menu) return;
    const panel = sidebar.current;
    const page = document.querySelector<HTMLElement>('.page-shell');
    const tracker = document.querySelector<HTMLElement>('.page-tracker');
    const focusFrame = requestAnimationFrame(() => panel?.querySelector<HTMLButtonElement>('button')?.focus());
    if (page) page.inert = true;
    if (tracker) tracker.inert = true;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setMenu(false); requestAnimationFrame(() => menuButton.current?.focus()); }
      if (event.key !== 'Tab') return;
      const controls = Array.from(panel?.querySelectorAll<HTMLElement>('a,button') || []).filter(el => el.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const media = window.matchMedia('(max-width: 780px)');
    const resize = () => { if (!media.matches) setMenu(false); };
    document.addEventListener('keydown', keydown);
    media.addEventListener('change', resize);
    return () => {
      cancelAnimationFrame(focusFrame);
      if (page) page.inert = false;
      if (tracker) tracker.inert = false;
      document.body.style.overflow = oldOverflow;
      document.removeEventListener('keydown', keydown);
      media.removeEventListener('change', resize);
    };
  }, [menu]);
  const [prefs, setPrefs] = useState<Prefs>(readPreferences);
  useEffect(() => {
    persistPreferences(prefs);
    document.documentElement.lang = i18n.language;
    document.documentElement.dataset.theme = prefs.dark ? 'dark' : 'light';
    document.documentElement.dataset.contrast = String(prefs.contrast);
    document.documentElement.dataset.spacing = String(prefs.spacing);
    document.documentElement.dataset.dyslexia = String(prefs.dyslexia);
    document.documentElement.dataset.motion = String(prefs.motion);
    document.documentElement.style.fontSize = `${prefs.font}%`;
  }, [prefs, i18n.language]);

  const nav = [
    ['/', Gauge, t('nav.dashboard')], ['/lab', FlaskConical, t('nav.lab')], ['/concepts', Brain, t('nav.concepts')],
    ['/research', Users, t('nav.research')], ['/practices', LayoutTemplate, t('nav.practices')], ['/devices', Monitor, t('nav.devices')],
    ['/multimodal', Monitor, t('multimodal.title')], ['/tracking', Eye, t('upgrade.tracking')], ['/experiments', FlaskConical, t('upgrade.experiments')], ['/chatbots', Bot, t('upgrade.chatbots')], ['/reports', BarChart3, t('upgrade.reports')], ['/accessibility', Accessibility, t('nav.accessibility')], ['/evaluation', CalendarCheck, t('nav.evaluation')],
    ['/user-testing', TestTube2, t('nav.userTesting')], ['/metrics', BarChart3, t('nav.metrics')], ['/ai', Bot, t('nav.ai')],
    ['/quality', ShieldCheck, t('nav.quality')], ['/course', CalendarCheck, t('nav.course')],
  ] as const;
  const groups = [
    ['overview', ['/', '/concepts', '/course']],
    ['explore', ['/lab', '/research', '/practices', '/devices', '/multimodal', '/experiments']],
    ['validate', ['/accessibility', '/evaluation', '/user-testing', '/tracking', '/metrics', '/reports']],
    ['tools', ['/chatbots', '/ai', '/quality']],
  ] as const;
  const setLanguage = (language: string) => { void i18n.changeLanguage(language); persistLanguage(language); };

  return <div className="app-shell">
    <a className="skip-link" href="#main-content" onClick={e => { e.preventDefault(); document.getElementById('main-content')?.focus(); }}>{t('shell.skip')}</a>
    <aside ref={sidebar} id="main-navigation" className={`sidebar ${menu ? 'open' : ''}`} aria-label={t('shell.navigation')}>
      <div className="brand"><span className="brand-mark">H+</span><div><strong>{t('common.title')}</strong><small>UX · A11y · AI</small></div><button className="icon-button mobile-only" onClick={closeMenu} aria-label={t('common.close')}><X aria-hidden="true"/></button></div>
      <nav>{groups.map(([group, paths]) => <section className="nav-group" key={group}><h2>{t(`shell.${group}`)}</h2>{nav.filter(([path]) => (paths as readonly string[]).includes(path)).map(([path, Icon, label]) => <NavLink key={path} to={path} end={path === '/'} onClick={() => { setMenu(false); requestAnimationFrame(() => { document.getElementById('main-content')?.focus({preventScroll:true}); window.scrollTo(0,0); }); }} className={({ isActive }) => isActive ? 'active' : ''}><Icon aria-hidden="true"/><span>{label}</span></NavLink>)}</section>)}</nav>
      <div className="sidebar-foot"><ShieldCheck/><span>WCAG · Nielsen · SUS · E2E</span></div>
    </aside>
    {menu && <div className="menu-backdrop" onClick={closeMenu} aria-hidden="true"/>}
    <div className="page-shell">
      <header className="topbar"><button ref={menuButton} className="icon-button mobile-only" onClick={() => setMenu(true)} aria-expanded={menu} aria-controls="main-navigation" aria-label={t('shell.openMenu')}><Menu aria-hidden="true"/></button><div className="top-title"><strong>{t('common.title')}</strong><span>{t('common.subtitle')}</span></div><PageTracker key={epoch}/><ProjectManager prefs={prefs} onSettings={(next,language)=>{setPrefs({...next});if(language)void i18n.changeLanguage(language);}} onNotice={setManagementMessage}/><label className="language"><Languages aria-hidden="true"/><span className="sr-only">{t('common.language')}</span><select value={i18n.language} onChange={(event) => setLanguage(event.target.value)}><option value="es-CO">ES</option><option value="en-US">EN</option><option value="pt-BR">PT</option><option value="fr-FR">FR</option><option value="it-IT">IT</option><option value="ca-ES">CA</option></select></label><button className="icon-button" onClick={() => setPrefs((current) => ({ ...current, dark: !current.dark }))} aria-label={prefs.dark ? t('accessibility.light') : t('accessibility.dark')}>{prefs.dark ? <Sun aria-hidden="true"/> : <Moon aria-hidden="true"/>}</button></header>
      {storageError && <p className="management-notice" role="alert">{storageError}</p>}
      {managementMessage.key && <p key={`management-${managementMessage.sequence}`} className="management-notice" data-management-notice role="status" tabIndex={-1}>{t(managementMessage.key)}</p>}
      <main id="main-content" tabIndex={-1} key={epoch} lang={i18n.language}><Routes><Route path="/experiments" element={<Experiments/>}/><Route path="/chatbots" element={<Chatbots/>}/><Route path="/reports" element={<Reports/>}/><Route path="/tracking" element={<TrackingPage/>}/><Route path="/" element={<DashboardPage/>}/><Route path="/lab" element={<LabPage/>}/><Route path="/concepts" element={<Concepts/>}/><Route path="/research" element={<ResearchPage/>}/><Route path="/practices" element={<Patterns/>}/><Route path="/devices" element={<DevicesPage/>}/><Route path="/multimodal" element={<MultimodalPage/>}/><Route path="/accessibility" element={<AccessibilityPage prefs={prefs} setPrefs={setPrefs}/>}/><Route path="/evaluation" element={<EvaluationPage/>}/><Route path="/user-testing" element={<TestingPage/>}/><Route path="/metrics" element={<MetricsPage/>}/><Route path="/ai" element={<AiStudioPage/>}/><Route path="/quality" element={<QualityPage/>}/><Route path="/course" element={<CoursePage/>}/><Route path="*" element={<DashboardPage/>}/></Routes></main>
    </div>
  </div>;
}

export default function App(){return <TrackingProvider><AppShell/></TrackingProvider>;}

import '../features/evaluation/styles.css';
