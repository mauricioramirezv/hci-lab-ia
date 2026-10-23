export const PROJECT_KEY = 'hci-lab-ia-project-v2';
export const PREFS_KEY = 'hci-prefs-v2';
export const LANGUAGE_KEY = 'hci-language';
export const languages = ['es-CO','en-US','pt-BR','fr-FR','it-IT','ca-ES'] as const;
export const defaultPrefs = { dark:false, contrast:false, font:100, spacing:false, dyslexia:false, motion:false };
export type Preferences = typeof defaultPrefs;
export type BackupSettings = { preferences:Preferences; language:string };

export const textSizeLimits={min:100,max:200,step:25} as const;
export const adjustTextSize=(size:number,direction:number)=>Math.min(textSizeLimits.max,Math.max(textSizeLimits.min,size+direction*textSizeLimits.step));
/** Old records may omit flags, but malformed or unknown settings are not accepted. */
export function parsePreferences(value:unknown):Preferences|undefined {
 if(!value||typeof value!=='object'||Array.isArray(value))return;
 const prototype=Object.getPrototypeOf(value);
 if(prototype===null||Object.getPrototypeOf(prototype)!==null)return;
 const data=value as Record<string,unknown>;
 if(Object.keys(data).some(key=>!Object.hasOwn(defaultPrefs,key)))return;
 for(const [key,item]of Object.entries(data)){
  if(key==='font'){if(typeof item!=='number'||!Number.isFinite(item)||item<100||item>200)return;}
  else if(typeof item!=='boolean')return;
 }
 return {...defaultPrefs,...data} as Preferences;
}
export const samePreferences=(a:Preferences,b:Preferences)=>Object.keys(defaultPrefs).every(key=>a[key as keyof Preferences]===b[key as keyof Preferences]);
