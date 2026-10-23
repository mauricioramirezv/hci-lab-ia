import {useEffect,useId,useRef,useState} from 'react';
import {useTranslation} from 'react-i18next';
import {SlidersHorizontal,X} from 'lucide-react';
import {DisplayPreferenceControls} from './DisplayPreferenceControls';
import type {DisplayPreferenceProps} from './DisplayPreferenceControls';
import '../displayPreferences.css';
export function DisplayPreferencesPanel(props:DisplayPreferenceProps){
 const {t}=useTranslation(),id=useId(),button=useRef<HTMLButtonElement>(null),dialog=useRef<HTMLDialogElement>(null),closeButton=useRef<HTMLButtonElement>(null);
 const [open,setOpen]=useState(false);const close=()=>dialog.current?.close();
 useEffect(()=>{if(open)closeButton.current?.focus();},[open]);
 useEffect(()=>{const shortcut=(event:KeyboardEvent)=>{if(event.altKey&&event.shiftKey&&!event.ctrlKey&&!event.metaKey&&!event.repeat&&event.code==='KeyV'&&!document.querySelector('dialog[open]')){event.preventDefault();button.current?.click();}};document.addEventListener('keydown',shortcut);return()=>document.removeEventListener('keydown',shortcut);},[]);
 return <div className="display-preferences" data-no-track>
  <button ref={button} type="button" className="icon-button" aria-label={t('displayPreferences.title')} title={t('displayPreferences.title')} aria-keyshortcuts="Alt+Shift+V" aria-haspopup="dialog" onClick={()=>{setOpen(true);dialog.current?.showModal();}}><SlidersHorizontal aria-hidden="true"/></button>
  <dialog ref={dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-intro`} onKeyDown={event=>{event.stopPropagation();if(event.key!=='Tab')return;const controls=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]')).filter(node=>node.getClientRects().length);const first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}} onClose={()=>{setOpen(false);button.current?.focus();}}>
   <div className="preference-heading"><h2 id={`${id}-title`}>{t('displayPreferences.title')}</h2><button ref={closeButton} type="button" className="icon-button" aria-label={t('displayPreferences.close')} onClick={close}><X aria-hidden="true"/></button></div>
   <p id={`${id}-intro`}>{t('displayPreferences.intro')}</p><p>{t('closure.keyboard')}</p>{open&&<DisplayPreferenceControls {...props} announceErrors/>}
  </dialog>
 </div>;
}
