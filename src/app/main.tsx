import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './i18n';
import './styles.css';
import './activities.css';
import './shell.css';
import App from './App';
import { ProjectProvider } from '../features/project/store';

createRoot(document.getElementById('root')!).render(<StrictMode><HashRouter><ProjectProvider><App /></ProjectProvider></HashRouter></StrictMode>);
