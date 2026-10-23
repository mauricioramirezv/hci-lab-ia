import type {Preferences} from '../../project/domain';
import {samePreferences} from '../../project/domain';
export const DISPLAY_PREFERENCES_EVENT='display-preferences-change';
export function applyDisplayPreferences(prefs:Preferences,previous?:Preferences){
 // Stop observers before coordinates or experimental appearance can change.
 if(previous&&!samePreferences(previous,prefs))window.dispatchEvent(new Event(DISPLAY_PREFERENCES_EVENT));
 const root=document.documentElement;
 root.dataset.theme=prefs.dark?'dark':'light';root.dataset.contrast=String(prefs.contrast);
 root.dataset.spacing=String(prefs.spacing);root.dataset.dyslexia=String(prefs.dyslexia);root.dataset.motion=String(prefs.motion);
 root.dataset.textLarge=String(prefs.font>=150);
 root.style.fontSize=`${prefs.font}%`;
}
