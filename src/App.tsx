import { useEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Accessibility, BarChart3, Bot, Brain, CalendarCheck, FlaskConical, Gauge, Languages, LayoutTemplate, Menu, Monitor, Moon, ShieldCheck, Sun, TestTube2, Users, X } from 'lucide-react';
import { AccessibilityPage, AiStudioPage, ConceptsPage, CoursePage, DashboardPage, DevicesPage, EvaluationPage, LabPage, MetricsPage, PracticesPage, QualityPage, ResearchPage, TestingPage } from './pages';

const defaultPrefs = { dark: false, contrast: false, font: 100, spacing: false, dyslexia: false, motion: false };
type Prefs = typeof defaultPrefs;

function App() {
  const { t, i18n } = useTranslation();
  const [menu, setMenu] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(() => {
    try { return JSON.parse(localStorage.getItem('hci-prefs-v2') || '') as Prefs; } catch { return defaultPrefs; }
  });
  useEffect(() => {
    localStorage.setItem('hci-prefs-v2', JSON.stringify(prefs));
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
    ['/accessibility', Accessibility, t('nav.accessibility')], ['/evaluation', CalendarCheck, t('nav.evaluation')],
    ['/user-testing', TestTube2, t('nav.userTesting')], ['/metrics', BarChart3, t('nav.metrics')], ['/ai', Bot, t('nav.ai')],
    ['/quality', ShieldCheck, t('nav.quality')], ['/course', CalendarCheck, t('nav.course')],
  ] as const;
  const setLanguage = (language: string) => { void i18n.changeLanguage(language); localStorage.setItem('hci-language', language); };

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Saltar al contenido</a>
    <aside className={`sidebar ${menu ? 'open' : ''}`} aria-label="Navegación principal">
      <div className="brand"><span className="brand-mark">H+</span><div><strong>{t('common.title')}</strong><small>UX · A11y · AI</small></div><button className="icon-button mobile-only" onClick={() => setMenu(false)} aria-label={t('common.close')}><X/></button></div>
      <nav>{nav.map(([path, Icon, label]) => <NavLink key={path} to={path} end={path === '/'} onClick={() => setMenu(false)} className={({ isActive }) => isActive ? 'active' : ''}><Icon/><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-foot"><ShieldCheck/><span>WCAG · Nielsen · SUS · E2E</span></div>
    </aside>
    <div className="page-shell">
      <header className="topbar"><button className="icon-button mobile-only" onClick={() => setMenu(true)} aria-label="Abrir menú"><Menu/></button><div className="top-title"><strong>{t('common.title')}</strong><span>{t('common.subtitle')}</span></div><label className="language"><Languages/><span className="sr-only">{t('common.language')}</span><select value={i18n.language} onChange={(event) => setLanguage(event.target.value)}><option value="es-CO">ES</option><option value="en-US">EN</option><option value="pt-BR">PT</option><option value="fr-FR">FR</option></select></label><button className="icon-button" onClick={() => setPrefs((current) => ({ ...current, dark: !current.dark }))} aria-label={prefs.dark ? t('accessibility.light') : t('accessibility.dark')}>{prefs.dark ? <Sun/> : <Moon/>}</button></header>
      <main id="main-content"><Routes><Route path="/" element={<DashboardPage/>}/><Route path="/lab" element={<LabPage/>}/><Route path="/concepts" element={<ConceptsPage/>}/><Route path="/research" element={<ResearchPage/>}/><Route path="/practices" element={<PracticesPage/>}/><Route path="/devices" element={<DevicesPage/>}/><Route path="/accessibility" element={<AccessibilityPage prefs={prefs} setPrefs={setPrefs}/>}/><Route path="/evaluation" element={<EvaluationPage/>}/><Route path="/user-testing" element={<TestingPage/>}/><Route path="/metrics" element={<MetricsPage/>}/><Route path="/ai" element={<AiStudioPage/>}/><Route path="/quality" element={<QualityPage/>}/><Route path="/course" element={<CoursePage/>}/><Route path="*" element={<DashboardPage/>}/></Routes></main>
    </div>
  </div>;
}

export default App;
