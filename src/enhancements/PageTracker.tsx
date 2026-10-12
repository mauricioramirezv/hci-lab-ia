import {useEffect,useState} from 'react';
import {useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useTracker} from '../components/tracking/context';
import {TrackingControls} from '../components/tracking/Controls';
export function PageTracker(){const {pathname}=useLocation(),{t}=useTranslation(),x=useTracker(),[open,setOpen]=useState(false);useEffect(()=>setOpen(false),[pathname]);return <aside className="page-tracker" data-no-track><button className="secondary" aria-expanded={pathname==='/tracking'?undefined:open} onClick={()=>{if(pathname==='/tracking'){document.getElementById('tracking-controls')?.focus();document.getElementById('tracking-controls')?.scrollIntoView({block:'start'});}else{if(!x.session)x.setTarget('page');setOpen(!open);}}}>{t('shell.tracker')}</button>{open&&pathname!=='/tracking'&&<div className="page-tracker-panel"><button className="secondary" onClick={()=>setOpen(false)}>{t('trackingUX.close')}</button><TrackingControls pageOnly/></div>}</aside>;}
