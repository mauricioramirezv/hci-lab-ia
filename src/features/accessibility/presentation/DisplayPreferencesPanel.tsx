import {useEffect,useId,useLayoutEffect,useRef,useState} from 'react';
import {useTranslation} from 'react-i18next';
import {SlidersHorizontal,X} from 'lucide-react';
import {DisplayPreferenceControls} from './DisplayPreferenceControls';
import type {DisplayPreferenceProps} from './DisplayPreferenceControls';
import '../displayPreferences.css';
export function DisplayPreferencesPanel(props:DisplayPreferenceProps){
 const {t}=useTranslation(),id=useId(),button=useRef<HTMLButtonElement>(null),dialog=useRef<HTMLDialogElement>(null),closeButton=useRef<HTMLButtonElement>(null),[open,setOpen]=useState(false);
 const close=()=>setOpen(false);
 useLayoutEffect(()=>{const node=dialog.current;if(!node)return;if(open){if(!node.open)node.showModal();closeButton.current?.focus({preventScroll:true});}else if(node.open){node.close();button.current?.focus({preventScroll:true});}},[open]);
 useEffect(()=>{const shortcut=(event:KeyboardEvent)=>{if(event.altKey&&event.shiftKey&&!event.ctrlKey&&!event.metaKey&&!event.repeat&&event.code==='KeyV'&&!document.querySelector('dialog[open]')){event.preventDefault();button.current?.click();}};document.addEventListener('keydown',shortcut);return()=>document.removeEventListener('keydown',shortcut);},[]);
 useEffect(()=>{const node=dialog.current;if(!node)return;const trapTab=(event:KeyboardEvent)=>{if(event.key!=='Tab'||!node.open)return;const closeControl=closeButton.current,restoreControl=node.querySelector<HTMLButtonElement>('[data-preference-restore]');if(!closeControl||!restoreControl)return;const active=document.activeElement;if(event.shiftKey&&(active===closeControl||!node.contains(active))){event.preventDefault();restoreControl.focus();}else if(!event.shiftKey&&(active===restoreControl||!node.contains(active))){event.preventDefault();closeControl.focus();}};node.addEventListener('keydown',trapTab);return()=>node.removeEventListener('keydown',trapTab);},[]);
 return <div className="display-preferences" data-no-track>
  <button ref={button} type="button" className="icon-button" aria-label={t('displayPreferences.title')} title={t('displayPreferences.title')} aria-keyshortcuts="Alt+Shift+V" aria-haspopup="dialog" onClick={()=>setOpen(true)}><SlidersHorizontal aria-hidden="true"/></button>
  <dialog ref={dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-intro`} onCancel={event=>{event.preventDefault();close();}}>
   <div className="preference-heading"><h2 id={`${id}-title`}>{t('displayPreferences.title')}</h2><button ref={closeButton} type="button" className="icon-button" aria-label={t('displayPreferences.close')} onClick={close}><X aria-hidden="true"/></button></div>
   <p id={`${id}-intro`}>{t('displayPreferences.intro')}</p><p>{t('closure.keyboard')}</p>{open&&<DisplayPreferenceControls {...props} announceErrors/>}
  </dialog>
 </div>;
}
