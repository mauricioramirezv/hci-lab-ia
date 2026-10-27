import {useCallback,useEffect,useRef,useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Confirmation} from './Forms';

let currentPopGuard:((event:PopStateEvent)=>void)|undefined;
// Register before HashRouter: a popstate listener can synchronously unmount a form.
export function installDraftNavigationGuard(){
 const pop=(event:PopStateEvent)=>currentPopGuard?.(event);
 window.addEventListener('popstate',pop,true);
 return ()=>{window.removeEventListener('popstate',pop,true);currentPopGuard=undefined;};
}

// Presentation-only guard, shared by forms; each domain owns its draft and save rules.
export function useDraftGuard(dirty:boolean){
 const {t}=useTranslation(),[open,setOpen]=useState(false),pending=useRef<(()=>void)|null>(null),approved=useRef(false);
 const request=useCallback((action:()=>void)=>{if(!dirty){action();return;}pending.current=action;setOpen(true);},[dirty]);
 useEffect(()=>{
  if(!dirty)return;
  const url=location.href,state=history.state as {idx?:number}|null;let restoring=false;
  const unload=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};
  const click=(event:MouseEvent)=>{
   if(approved.current){approved.current=false;return;}
   if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
   const link=(event.target as Element|null)?.closest<HTMLAnchorElement>('a[href]');
   if(!link||link.download||link.target==='_blank')return;
   const target=new URL(link.href,location.href);
   if(target.origin!==location.origin||target.pathname!==location.pathname||!target.hash.startsWith('#/')||target.hash===location.hash)return;
   event.preventDefault();event.stopPropagation();request(()=>{approved.current=true;link.click();});
  };
  const pop=(event:PopStateEvent)=>{
   if(restoring){restoring=false;event.stopImmediatePropagation();return;}
   if(location.href===url)return;
   if(window.confirm(t('crud.unsavedText'))){if(currentPopGuard===pop)currentPopGuard=undefined;return;}
   event.stopImmediatePropagation();
   const delta=typeof state?.idx==='number'&&typeof event.state?.idx==='number'?state.idx-event.state.idx:0;
   if(delta){restoring=true;history.go(delta);}else history.replaceState(state,'',url);
  };
  currentPopGuard=pop;
  window.addEventListener('beforeunload',unload);document.addEventListener('click',click,true);
  return()=>{window.removeEventListener('beforeunload',unload);document.removeEventListener('click',click,true);if(currentPopGuard===pop)currentPopGuard=undefined;};
 },[dirty,request,t]);
 return {request,dialog:open&&<Confirmation title={t('crud.unsavedTitle')} text={t('crud.unsavedText')} cancelLabel={t('crud.stay')} confirm={t('crud.discard')} onCancel={()=>{pending.current=null;setOpen(false);}} onConfirm={()=>{const action=pending.current;pending.current=null;setOpen(false);action?.();}}/>};
}
