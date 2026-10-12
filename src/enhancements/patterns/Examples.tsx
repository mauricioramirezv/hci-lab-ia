import {useEffect,useRef,useState} from 'react';
import {useTranslation} from 'react-i18next';
import {patternSearch} from './model';
import type {PatternDraft,PatternId} from './model';

type Props={id:PatternId;good:boolean;draft:PatternDraft;onDraft:(draft:PatternDraft)=>void};
export function PatternExample({id,good,draft,onDraft}:Props){
  const {t}=useTranslation();const tr=(key:string,values?:Record<string,unknown>)=>t(`patternLab.ui.${key}`,values);
  const heading=useRef<HTMLHeadingElement>(null),navHeading=useRef<HTMLHeadingElement>(null),emailInput=useRef<HTMLInputElement>(null),requestInput=useRef<HTMLTextAreaElement>(null),documentInput=useRef<HTMLInputElement>(null);
  const [error,setError]=useState(''),[done,setDone]=useState(''),[nav,setNav]=useState('help'),[location,setLocation]=useState(''),[progress,setProgress]=useState(0),[running,setRunning]=useState(false),[brief,setBrief]=useState(false);
  const [plan,setPlan]=useState(good?'':'advanced'),[comparing,setComparing]=useState(good),[found,setFound]=useState(''),[deadline,setDeadline]=useState(''),[analytics,setAnalytics]=useState(!good),[photos,setPhotos]=useState(!good),[permissions,setPermissions]=useState<{analytics:boolean;photos:boolean}>();
  const generation=useRef(0),timers=useRef<ReturnType<typeof setTimeout>[]>([]);
  const previousNav=useRef(nav);
  useEffect(()=>{heading.current?.focus();const pending=timers.current,token=generation;return()=>{token.current++;pending.forEach(clearTimeout);};},[]);
  useEffect(()=>{if(id==='navigation'&&previousNav.current!==nav)navHeading.current?.focus();previousNav.current=nav;},[id,nav]);
  const update=(key:keyof PatternDraft,value:string)=>{onDraft({...draft,[key]:value});setError('');setDone('');};
  const clear=()=>{generation.current++;timers.current.forEach(clearTimeout);timers.current.length=0;setRunning(false);setProgress(0);setBrief(false);setError('');setDone('');};
  const prepare=()=>{
    if(!draft.document.trim()){setError('documentError');documentInput.current?.focus();return;}
    clear();setRunning(true);const token=generation.current;
    for(let stage=1;stage<=3;stage++)timers.current.push(setTimeout(()=>{
      if(token!==generation.current)return;
      setProgress(stage);
      if(stage===3){setRunning(false);setDone('feedbackLabDone');setBrief(true);timers.current.push(setTimeout(()=>{if(token===generation.current)setBrief(false);},500));}
    },stage*400));
  };
  const move=(next:string)=>{setNav(next);setLocation('');setDone('');setError('');};
  const sectionKeys=['returns','shipping','support'] as const;
  const button=(key:string,action:()=>void,disabled=false)=><button type="button" className="secondary" disabled={disabled} onClick={action}>{tr(key)}</button>;
  const resultText=done==='locationDone'?tr(done,{name:tr(nav)}):done==='choiceDone'?tr(done,{name:tr(plan)}):done==='found'?tr(done,{name:tr(found)}):tr(done);
  return <div className="pattern-example" data-pattern={id} data-aoi={`patron-${id}`}>
    <h3 id="pattern-example-title" ref={heading} tabIndex={-1} className="pattern-focus">{tr('example')}</h3>
    <p className="fine-print">{tr('simulation')}</p>
    {id==='form'&&<><p>{tr('formHelp')}</p><form noValidate onSubmit={e=>{e.preventDefault();setDone('');if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(draft.email.trim())){setError('emailError');emailInput.current?.focus();return;}if(!draft.request.trim()){setError('requestError');requestInput.current?.focus();return;}setError('');setDone('formLabDone');}}>
      <div className="pattern-specimen" data-condition={good?'good':'bad'}>
        <label><span className={!good?'pattern-sr-only':undefined}>{tr('email')}</span><input ref={emailInput} type="email" autoComplete="off" placeholder={!good?tr('email'):undefined} value={draft.email} onChange={e=>update('email',e.target.value)} aria-invalid={error==='emailError'||undefined} aria-describedby={error==='emailError'?'pattern-example-error':undefined}/></label>
        <label><span className={!good?'pattern-sr-only':undefined}>{tr('request')}</span><textarea ref={requestInput} placeholder={!good?tr('request'):undefined} value={draft.request} onChange={e=>update('request',e.target.value)} aria-invalid={error==='requestError'||undefined} aria-describedby={error==='requestError'?'pattern-example-error':undefined}/></label>
        {error&&<p className="pattern-sample-message">{tr(good?error:'formBadError')}</p>}{done&&<p>{tr(good?'formGoodDone':'formBadDone')}</p>}
      </div><div className="pattern-actions"><button className="primary" type="submit">{tr('send')}</button></div>
    </form></>}
    {id==='navigation'&&<><p>{tr('navIntro')}</p><div className="pattern-specimen" data-condition={good?'good':'bad'}>
      {good&&<nav aria-label={tr('breadcrumb')}><ol className="pattern-breadcrumb">{['help',...(nav!=='help'?['billing']:[]),...(nav==='invoices'?['invoices']:[])].map(key=><li key={key}>{key===nav?<span aria-current="page">{tr(key)}</span>:<button className="secondary" onClick={()=>move(key)}>{tr(key)}</button>}</li>)}</ol></nav>}
      <h4 ref={navHeading} tabIndex={-1} className="pattern-focus">{tr(good?nav:nav==='help'?'help':nav==='billing'?'areaOne':'areaTwo')}</h4>
      {nav!=='help'&&<p>{tr(nav==='billing'?'billingBody':'invoiceBody')}</p>}
      <div className="pattern-actions">{nav==='help'?<button className="secondary" aria-label={tr('openBilling')} onClick={()=>move('billing')}>{good?tr('openBilling'):'→'}</button>:nav==='billing'?<><button className="secondary" aria-label={tr('openInvoices')} onClick={()=>move('invoices')}>{good?tr('openInvoices'):'↗'}</button>{!good&&<button className="secondary" aria-label={tr('duplicateInvoices')} onClick={()=>move('invoices')}>→</button>}</>:null}</div>
    </div><label>{tr('where')}<select value={location} onChange={e=>{setLocation(e.target.value);setError('');setDone('');}}><option value="">{tr('choose')}</option>{['help','billing','invoices'].map(key=><option key={key} value={key}>{tr(key)}</option>)}</select></label><div className="pattern-actions">{button('checkLocation',()=>{if(location!==nav){setError('locationError');setDone('');}else{setError('');setDone('locationDone');}})}{button('previous',()=>move(nav==='invoices'?'billing':'help'),nav==='help')}</div></>}
    {id==='feedback'&&<><p>{tr('progressHelp')}</p><label>{tr('document')}<input ref={documentInput} value={draft.document} onChange={e=>update('document',e.target.value)} aria-invalid={error==='documentError'||undefined} aria-describedby={error==='documentError'?'pattern-example-error':undefined}/></label>
      <div className="pattern-specimen" data-condition={good?'good':'bad'}>{good?<><progress value={progress} max={3} aria-label={tr('progress')}/><p role="status">{tr(progress===0?'idle':progress===1?'stepOne':progress===2?'stepTwo':'stepThree')}</p>{progress===3&&<p>{tr('feedbackDone')}</p>}</>:<><p>{tr('silent')}</p>{brief&&<p>{tr('briefDone')}</p>}</>}</div>
      <div className="pattern-actions">{button('prepare',prepare,running)}{button('cancel',()=>{clear();setDone('cancelled');},!running)}</div></>}
    {id==='choice'&&<><p>{tr('choiceGoal')}</p><div className="pattern-specimen" data-condition={good?'good':'bad'}>
      {!good&&<p>{tr('pressure')}</p>}{comparing&&<><div className="pattern-table-wrap pattern-focus" tabIndex={0} role="region" aria-label={tr('compare')}><table><caption>{tr('compare')}</caption><thead><tr><th scope="col">{tr('choosePlan')}</th><th scope="col">{tr('capacity')}</th><th scope="col">{tr('monthly')}</th><th scope="col">{tr('yearly')}</th></tr></thead><tbody><tr><th scope="row">{tr('basic')}</th><td>5 GB</td><td>0</td><td>0</td></tr><tr><th scope="row">{tr('advanced')}</th><td>50 GB</td><td>12</td><td>144</td></tr></tbody></table></div><p>{tr('choiceAdvice')}</p></>}
      <fieldset><legend>{tr('choosePlan')}</legend>{['basic','advanced'].map(key=><label className="pattern-check" key={key}><input type="radio" name="pattern-plan" checked={plan===key} onChange={()=>{setPlan(key);setDone('');setError('');}}/>{tr(key)}</label>)}</fieldset>{!good&&<p className="fine-print">{tr('hiddenCancel')}</p>}
    </div><div className="pattern-actions">{button('compare',()=>setComparing(true))}{button('continue',()=>{if(!plan){setError('choiceError');return;}setError('');setDone('choiceDone');})}{button('cancel',()=>{setPlan('');setError('');setDone('cancelled');})}</div></>}
    {id==='content'&&<><p>{tr('contentGoal')}</p><div className="pattern-specimen" data-condition={good?'good':'bad'}>{good?sectionKeys.map(key=><section className={found===key?'pattern-highlight':undefined} key={key}><h4>{tr(key)}</h4><p>{tr(`${key}Body`)}</p></section>):<p className="pattern-dense">{sectionKeys.map(key=>tr(`${key}Body`)).join(' ')}</p>}</div>
      <form onSubmit={e=>{e.preventDefault();if(!draft.contentQuery.trim()){setError('findEmpty');setDone('');return;}const key=sectionKeys.find(key=>patternSearch(`${tr(key)} ${tr(`${key}Body`)}`).includes(patternSearch(draft.contentQuery)));if(!key){setError('notFound');setDone('');return;}setError('');setFound(key);setDone('found');}}><label>{tr('findLabel')}<input type="search" value={draft.contentQuery} onChange={e=>update('contentQuery',e.target.value)}/></label><button className="secondary" type="submit">{tr('find')}</button></form>
      <label>{tr('deadline')}<select value={deadline} onChange={e=>{setDeadline(e.target.value);setError('');setDone('');}}><option value="">{tr('choose')}</option>{[14,30].map(n=><option key={n} value={n}>{tr('days',{count:n})}</option>)}</select></label><div className="pattern-actions">{button('checkContent',()=>{if(deadline!=='14'){setError('contentError');setDone('');}else{setError('');setDone('contentDone');}})}</div></>}
    {id==='privacy'&&<><p>{tr('privacyGoal')}</p><div className="pattern-specimen" data-condition={good?'good':'bad'}><p>{tr(good?'necessary':'bundled')}</p><p>{tr('purpose')}</p><fieldset><legend>{tr('choose')}</legend><label className="pattern-check"><input type="checkbox" checked={analytics} onChange={e=>{setAnalytics(e.target.checked);setDone('');setPermissions(undefined);}}/>{tr('analytics')}</label><label className="pattern-check"><input type="checkbox" checked={photos} onChange={e=>{setPhotos(e.target.checked);setDone('');setPermissions(undefined);}}/>{tr('photos')}</label></fieldset></div>
      <div className="pattern-actions">{button('accept',()=>{setPermissions({analytics,photos});setDone('privacyDone');})}{button('reject',()=>{setAnalytics(false);setPhotos(false);setPermissions({analytics:false,photos:false});setDone('privacyDone');})}</div></>}
    <div className="pattern-runtime" aria-labelledby="pattern-state-title"><h4 id="pattern-state-title">{tr('labState')}</h4>{error?<p id="pattern-example-error" role="alert">{tr(error)}</p>:<p role="status">{done?resultText:running?tr(progress===0?'stepOne':progress===1?'stepOne':'stepTwo'):tr('idle')}</p>}{permissions&&<ul><li>{tr('analytics')}: {tr(permissions.analytics?'yes':'no')}</li><li>{tr('photos')}: {tr(permissions.photos?'yes':'no')}</li></ul>}</div>
  </div>;
}

