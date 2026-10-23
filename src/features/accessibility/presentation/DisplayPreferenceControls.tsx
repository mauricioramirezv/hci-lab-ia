import {useId,useState} from 'react';
import {useTranslation} from 'react-i18next';
import {adjustTextSize,defaultPrefs,textSizeLimits} from '../../project/domain';
import type {Preferences} from '../../project/domain';
import type {PreferenceUpdate} from '../application';
export type DisplayPreferenceProps={prefs:Preferences;onChange:(update:PreferenceUpdate)=>boolean;error:boolean};
export function DisplayPreferenceControls({prefs,onChange,error,announceErrors=false}:DisplayPreferenceProps&{announceErrors?:boolean}){
 const {t}=useTranslation(),tr=(key:string)=>t(`displayPreferences.${key}`),id=useId();
 const [notice,setNotice]=useState({key:'',sequence:0});
 const restore=(fontOnly=false)=>{if(onChange(current=>fontOnly?{...current,font:100}:{...defaultPrefs}))setNotice(old=>({key:fontOnly?'sizeRestored':'restored',sequence:old.sequence+1}));};
 const change=(update:PreferenceUpdate)=>{setNotice(old=>({...old,key:''}));onChange(update);};
 return <div className="display-preference-controls" data-no-track>
  <fieldset><legend>{tr('size')}</legend><p id={`${id}-size`}>{t('displayPreferences.current',{percent:prefs.font})}</p><p id={`${id}-size-help`}>{tr('sizeHelp')}</p><div className="preference-actions">
   <button type="button" className="secondary" aria-describedby={`${id}-size`} disabled={prefs.font<=textSizeLimits.min} onClick={()=>change(current=>({...current,font:adjustTextSize(current.font,-1)}))}>{tr('decrease')}</button>
   <button type="button" className="secondary" aria-describedby={`${id}-size`} disabled={prefs.font>=textSizeLimits.max} onClick={()=>change(current=>({...current,font:adjustTextSize(current.font,1)}))}>{tr('increase')}</button>
   <button type="button" className="secondary" onClick={()=>restore(true)}>{tr('sizeReset')}</button>
  </div></fieldset>
  <fieldset><legend>{tr('appearance')}</legend>{(['dark','contrast','spacing','dyslexia','motion'] as const).map(key=><label className="preference-check" key={key}><input type="checkbox" checked={prefs[key]} aria-describedby={key==='dyslexia'?`${id}-font-help`:undefined} onChange={event=>{const checked=event.target.checked;change(current=>({...current,[key]:checked}));}}/><span>{tr(key==='dyslexia'?'font':key)}</span></label>)}<p id={`${id}-font-help`}>{tr('fontHelp')}</p></fieldset>
  <button type="button" className="secondary" onClick={()=>restore()}>{tr('restore')}</button>
  {error?<p role={announceErrors?'alert':undefined}>{tr('failed')}</p>:<p role="status" data-outcome="success" aria-atomic="true">{notice.key&&<span key={notice.sequence}>{tr(notice.key)}</span>}</p>}
 </div>;
}
