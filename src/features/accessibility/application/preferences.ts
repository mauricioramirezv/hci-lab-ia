import {defaultPrefs,parsePreferences,samePreferences} from '../../project/domain';
import type {Preferences} from '../../project/domain';
export type PreferenceUpdate=Preferences|((current:Preferences)=>Preferences);
export function createPreferenceOperations(store:{read:()=>Preferences;write:(next:Preferences)=>boolean}){
 const change=(update:PreferenceUpdate)=>{
  const current=store.read(),next=parsePreferences(typeof update==='function'?update(current):update);
  if(!next)return false;
  if(samePreferences(current,next))return true;
  return store.write(next);
 };
 return {change,restore:()=>change({...defaultPrefs})};
}
