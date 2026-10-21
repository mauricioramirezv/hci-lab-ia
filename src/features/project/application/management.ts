import type { ProjectState } from '../domain/state';
import type { BackupSettings } from '../domain/preferences';
import { defaultPrefs } from '../domain/preferences';
import { parseBackup, emptyProject } from '../domain/backup';
export function createManagementOperations(replace:(project:ProjectState,settings?:{preferences:BackupSettings['preferences'];language?:string})=>boolean,now:()=>Date) {
 return {
  importProject:(project:ProjectState,settings?:BackupSettings)=>{const parsed=parseBackup({...project,...(settings?{backup:{format:'hci-lab-ia-backup',version:1,exportedAt:now().toISOString(),...settings}}:{})});return replace(parsed.project,parsed.settings);},
  reset:()=>replace(emptyProject(),{preferences:{...defaultPrefs}}),
 };
}
