import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {readPreferences,persistPreferences} from '../../project/infrastructure';
import type {Preferences} from '../../project/domain';
import {createPreferenceOperations} from '../application';
import {applyDisplayPreferences} from '../infrastructure';
export function useDisplayPreferences(){
 const [prefs,publish]=useState(readPreferences),current=useRef(prefs),initial=useRef(prefs),applied=useRef<Preferences|undefined>(undefined),[error,setError]=useState(false);
 useEffect(()=>{if(current.current===initial.current&&!persistPreferences(initial.current))setError(true);},[]);
 useLayoutEffect(()=>{applyDisplayPreferences(prefs,applied.current);applied.current=prefs;},[prefs]);
 const operations=createPreferenceOperations({read:()=>current.current,write:next=>{
  if(!persistPreferences(next)){setError(true);return false;}
  current.current=next;publish(next);setError(false);return true;
 }});
 const replace=(next:Preferences)=>{current.current={...next};publish(current.current);setError(false);};
 return {prefs,change:operations.change,restore:operations.restore,replace,error};
}
