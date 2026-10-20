import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export function Field({name,label,error,children,help}:{name:string;label:string;error?:string;children:ReactNode;help?:string}) {
  return <div data-field={name}><label htmlFor={name}>{label}</label>{children}{help&&<p id={`${name}-help`}>{help}</p>}{error&&<p className="activity-error" id={`${name}-error`}>{error}</p>}</div>;
}
export function Confirmation({title,text,confirm,onConfirm,onCancel,children}:{title:string;text:string;confirm:string;onConfirm:()=>void;onCancel:()=>void;children?:ReactNode}) {
  const {t}=useTranslation();const id=useId();const dialog=useRef<HTMLDialogElement>(null);const cancel=useRef<HTMLButtonElement>(null);
  useEffect(()=>{const opener=document.activeElement as HTMLElement;dialog.current?.showModal();cancel.current?.focus();return()=>{if(opener?.isConnected)opener.focus();};},[]);
  return <dialog className="project-activity-dialog" ref={dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`} onCancel={e=>{e.preventDefault();onCancel();}}><h2 id={`${id}-title`}>{title}</h2><p id={`${id}-desc`}>{text}</p>{children}<div className="activity-actions"><button ref={cancel} className="secondary" onClick={onCancel}>{t('projectActivities.cancel')}</button><button className="primary" onClick={onConfirm}>{confirm}</button></div></dialog>;
}
