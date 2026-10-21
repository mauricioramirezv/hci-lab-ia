import type { ProjectState } from '../domain/state';
import { PROJECT_KEY, PREFS_KEY, LANGUAGE_KEY, defaultPrefs } from '../domain/preferences';
import type { Preferences } from '../domain/preferences';
import { emptyProject, parseBackup, isPreferences } from '../domain/backup';
export function readPreferences():Preferences {
  try { const value:unknown=JSON.parse(localStorage.getItem(PREFS_KEY) || 'null'); return isPreferences(value) ? value as Preferences : {...defaultPrefs}; }
  catch { return {...defaultPrefs}; }
}
/** Persist replacements before changing memory. Roll back individual keys on failure. */
export function commitProject(project:ProjectState, settings?:{preferences:Preferences;language?:string}) {
  const entries:[string,string][] = [[PROJECT_KEY,JSON.stringify(project)]];
  if (settings) entries.push([PREFS_KEY,JSON.stringify(settings.preferences)]);
  if (settings?.language) entries.push([LANGUAGE_KEY,settings.language]);
  const previous = entries.map(([key])=>[key,localStorage.getItem(key)] as const);
  try { for (const [key,value] of entries) localStorage.setItem(key,value); }
  catch (error) {
    for (const [key,value] of previous) { try { if (value===null) localStorage.removeItem(key); else localStorage.setItem(key,value); } catch { /* Storage remains unavailable; caller reports failure. */ } }
    throw error;
  }
}


export function readProject(): {state:ProjectState;invalid:boolean} {
 try {const saved=localStorage.getItem(PROJECT_KEY);return {state:saved?parseBackup(JSON.parse(saved)).project:emptyProject(),invalid:false};}
 catch {return {state:emptyProject(),invalid:true};}
}
export function readLanguage() {try{return localStorage.getItem(LANGUAGE_KEY)||'es-CO';}catch{return 'es-CO';}}
export function persistPreferences(prefs:Preferences) {try{localStorage.setItem(PREFS_KEY,JSON.stringify(prefs));return true;}catch{return false;}}
export function persistLanguage(language:string) {try{localStorage.setItem(LANGUAGE_KEY,language);return true;}catch{return false;}}
