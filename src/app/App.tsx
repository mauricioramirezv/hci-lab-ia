import {version} from '../../package.json';
import {RouteBoundary,RouteLoading} from './RouteBoundary';
import {persistLanguage} from '../features/project/infrastructure';
import {PageTracker} from '../features/tracking/presentation';
import { ProjectManager } from '../features/project/presentation';
import { useProject } from '../features/project/presentation';
import { MultimodalPage } from '../features/multimodal/presentation';
import {TrackingPage} from '../features/tracking/presentation';
import {TrackingProvider} from '../features/tracking/presentation';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Accessibility, BarChart3, Bot, Brain, CalendarCheck, ChevronDown, Eye, FlaskConical, Gauge, Languages, LayoutTemplate, Menu, Monitor, Moon, ShieldCheck, Sun, TestTube2, UserRound, Users, X } from 'lucide-react';
import {DisplayPreferencesPanel,useDisplayPreferences} from '../features/accessibility/presentation';
import { AccessibilityPage } from '../features/accessibility/presentation';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { LabPage } from '../features/reservations/presentation';



const Patterns=lazy(()=>import('../features/patterns/presentation').then(module=>({default:module.Patterns})));
const Concepts=lazy(()=>import('../features/concepts/presentation').then(module=>({default:module.Concepts})));
const Experiments=lazy(()=>import('../features/experiments/presentation').then(module=>({default:module.Experiments})));
const Chatbots=lazy(()=>import('../features/chatbots/presentation').then(module=>({default:module.Chatbots})));
const Reports=lazy(()=>import('../features/reports/presentation').then(module=>({default:module.ReportsModule})));
const AiStudioPage=lazy(()=>import('../features/ai/presentation').then(module=>({default:module.AiStudioPage})));
const CoursePage=lazy(()=>import('../features/course/CoursePage').then(module=>({default:module.CoursePage})));
const DevicesPage=lazy(()=>import('../features/devices/DevicesPage').then(module=>({default:module.DevicesPage})));
const EvaluationPage=lazy(()=>import('../features/evaluation/presentation').then(module=>({default:module.EvaluationPage})));
const UsersPage=lazy(()=>import('../features/users/presentation').then(module=>({default:module.UsersPage})));
const MetricsPage=lazy(()=>import('../features/metrics/MetricsPage').then(module=>({default:module.MetricsPage})));
const QualityPage=lazy(()=>import('../features/quality/QualityPage').then(module=>({default:module.QualityPage})));
const ResearchPage=lazy(()=>import('../features/research/presentation').then(module=>({default:module.ResearchPage})));
const TestingPage=lazy(()=>import('../features/evaluation/presentation').then(module=>({default:module.TestingPage})));
const IdentityPage=lazy(()=>import('../features/identity/presentation').then(module=>({default:module.IdentityPage})));
const SynchronizationPage=lazy(()=>import('../features/synchronization/presentation').then(module=>({default:module.SynchronizationPage})));
const GroupsPage=lazy(()=>import('../features/community').then(module=>({default:module.GroupsPage})));
const SuggestionsPage=lazy(()=>import('../features/community').then(module=>({default:module.SuggestionsPage})));
const ProgressPage=lazy(()=>import('../features/learning').then(module=>({default:module.ProgressPage})));
const RemoteReportsPage=lazy(()=>import('../features/remoteReports').then(module=>({default:module.RemoteReportsPage})));
const IntegrationEventsPage=lazy(()=>import('../features/integrationEvents').then(module=>({default:module.IntegrationEventsPage})));
const CommunityHubPage=lazy(()=>import('../features/community').then(module=>({default:module.CommunityHubPage})));

function AppShell() {
  const { epoch, storageError } = useProject();
  const { t, i18n } = useTranslation();
  const [menu, setMenu] = useState(false);
  const [openNavGroups, setOpenNavGroups] = useState<Record<string, boolean>>({});
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
      requestAnimationFrame(() => { const active=document.activeElement;if(document.querySelector('dialog[open]')||active?.closest('.display-preferences'))return;document.getElementById('main-content')?.focus({ preventScroll:true }); window.scrollTo(0, 0); });
    }
    const heading = document.querySelector('main h1')?.textContent;
    document.title = `${heading || t('common.title')} · HCI Lab + IA`;
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
  const display=useDisplayPreferences(),prefs=display.prefs;
  useEffect(()=>{document.documentElement.lang=i18n.language;},[i18n.language]);

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
  const activeGroup = groups.find(([, paths]) => (paths as readonly string[]).includes(pathname))?.[0];
  useEffect(() => {
    if (activeGroup) setOpenNavGroups(current => ({ ...current, [activeGroup]: true }));
  }, [activeGroup]);
  const setLanguage = (language: string) => { void i18n.changeLanguage(language); persistLanguage(language); };

  return <div className="app-shell">
    <a className="skip-link" href="#main-content" onClick={e => { e.preventDefault(); document.getElementById('main-content')?.focus(); }}>{t('shell.skip')}</a>
    <aside ref={sidebar} id="main-navigation" className={`sidebar ${menu ? 'open' : ''}`} aria-label={t('shell.navigation')}>
      <div className="brand"><span className="brand-mark">H+</span><div><strong>{t('common.title')}</strong><small>UX · A11y · AI</small></div><button className="icon-button mobile-only" onClick={closeMenu} aria-label={t('common.close')}><X aria-hidden="true"/></button></div>
      <nav>{groups.map(([group, paths]) => {
        const expanded = openNavGroups[group] ?? group === activeGroup;
        const panelId = `nav-group-${group}`;
        return <section className={`nav-group${expanded ? ' expanded' : ''}`} key={group}>
          <h2><button type="button" className="nav-group-toggle" aria-expanded={expanded} aria-controls={panelId} onClick={() => setOpenNavGroups(current => ({ ...current, [group]: !(current[group] ?? group === activeGroup) }))}><span>{t(`shell.${group}`)}</span><ChevronDown aria-hidden="true"/></button></h2>
          <div className="nav-group-links" id={panelId} hidden={!expanded}>{nav.filter(([path]) => (paths as readonly string[]).includes(path)).map(([path, Icon, label]) => <NavLink key={path} to={path} end={path === '/'} onClick={() => { setMenu(false); requestAnimationFrame(() => { document.getElementById('main-content')?.focus({preventScroll:true}); window.scrollTo(0,0); }); }} className={({ isActive }) => isActive ? 'active' : ''}><Icon aria-hidden="true"/><span>{label}</span></NavLink>)}</div>
        </section>;
      })}</nav>
      <div className="sidebar-foot"><ShieldCheck aria-hidden="true"/><span>WCAG · Nielsen · SUS · E2E<br/>{t('closure.version',{version})}</span></div>
    </aside>
    {menu && <div className="menu-backdrop" onClick={closeMenu} aria-hidden="true"/>}
    <div className="page-shell">
      <header className="topbar"><button ref={menuButton} className="icon-button mobile-only" onClick={() => setMenu(true)} aria-expanded={menu} aria-controls="main-navigation" aria-label={t('shell.openMenu')}><Menu aria-hidden="true"/></button><div className="top-title"><strong>{t('common.title')}</strong><span>{t('common.subtitle')}</span></div><ProjectManager prefs={prefs} onSettings={(next,language)=>{display.replace(next);if(language)void i18n.changeLanguage(language);}} onNotice={setManagementMessage}/><NavLink to="/comunidad" className={({isActive})=>`topbar-account${isActive?' active':''}`}><Users aria-hidden="true"/><span>{t('community.hubNav')}</span></NavLink><NavLink to="/cuenta" className={({isActive})=>`topbar-account${isActive?' active':''}`}><UserRound aria-hidden="true"/><span>{t('identity.accountNav')}</span></NavLink><PageTracker key={epoch}/><details className="keyboard-help"><summary aria-label={t('shellHelp.keyboardHelp')} title={t('shellHelp.keyboardHelp')}><span aria-hidden="true">?</span></summary><section aria-label={t('shellHelp.keyboardHelp')}><h2>{t('shellHelp.keyboardHelp')}</h2><p>{t('shellHelp.shortcutIntro')}</p><ul><li><kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> — {t('shellHelp.keyMove')}</li><li><kbd>Enter</kbd> — {t('shellHelp.keyActivate')}</li><li><kbd>Space</kbd> — {t('shellHelp.keyToggle')}</li><li><kbd>Esc</kbd> — {t('shellHelp.keyClose')}</li></ul></section></details><label className="language"><Languages aria-hidden="true"/><span className="sr-only">{t('common.language')}</span><select value={i18n.language} onChange={(event) => setLanguage(event.target.value)}><option value="es-CO">ES</option><option value="en-US">EN</option><option value="pt-BR">PT</option><option value="fr-FR">FR</option><option value="it-IT">IT</option><option value="ca-ES">CA</option></select></label><div className="visualization-actions"><button className="icon-button" onClick={() => display.change((current) => ({ ...current, dark: !current.dark }))} aria-label={prefs.dark ? t('accessibility.light') : t('accessibility.dark')}>{prefs.dark ? <Sun aria-hidden="true"/> : <Moon aria-hidden="true"/>}</button><DisplayPreferencesPanel prefs={prefs} onChange={display.change} error={display.error}/></div></header>
      {display.error&&<p className="management-notice" role="alert">{t('displayPreferences.failed')}</p>}
      {storageError && <p className="management-notice" role="alert">{storageError}</p>}
      {managementMessage.key && <p key={`management-${managementMessage.sequence}`} className="management-notice" data-management-notice data-outcome="success" role="status" tabIndex={-1}>{t(managementMessage.key)}</p>}
      <main id="main-content" tabIndex={-1} key={epoch} lang={i18n.language}><RouteBoundary key={`${pathname}-${epoch}`}><Suspense fallback={<RouteLoading/>}><Routes><Route path="/comunidad" element={<CommunityHubPage/>}/><Route path="/sync" element={<SynchronizationPage/>}/><Route path="/cuenta" element={<IdentityPage/>}/><Route path="/grupos" element={<GroupsPage/>}/><Route path="/sugerencias" element={<SuggestionsPage/>}/><Route path="/seguimiento" element={<ProgressPage/>}/><Route path="/informes" element={<RemoteReportsPage/>}/><Route path="/eventos" element={<IntegrationEventsPage/>}/><Route path="/lab/users" element={<UsersPage/>}/><Route path="/experiments" element={<Experiments/>}/><Route path="/chatbots" element={<Chatbots/>}/><Route path="/reports" element={<Reports/>}/><Route path="/tracking" element={<TrackingPage/>}/><Route path="/" element={<DashboardPage/>}/><Route path="/lab" element={<LabPage/>}/><Route path="/concepts" element={<Concepts/>}/><Route path="/research" element={<ResearchPage/>}/><Route path="/practices" element={<Patterns/>}/><Route path="/devices" element={<DevicesPage/>}/><Route path="/multimodal" element={<MultimodalPage/>}/><Route path="/accessibility" element={<AccessibilityPage prefs={prefs} onChange={display.change} error={display.error}/>}/><Route path="/evaluation" element={<EvaluationPage/>}/><Route path="/user-testing" element={<TestingPage/>}/><Route path="/metrics" element={<MetricsPage/>}/><Route path="/ai" element={<AiStudioPage/>}/><Route path="/quality" element={<QualityPage/>}/><Route path="/course" element={<CoursePage/>}/><Route path="*" element={<DashboardPage/>}/></Routes></Suspense></RouteBoundary></main>
    </div>
  </div>;
}

export default function App(){return <TrackingProvider><AppShell/></TrackingProvider>;}

import '../features/evaluation/styles.css';
