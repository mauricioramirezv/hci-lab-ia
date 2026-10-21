export const PROJECT_KEY = 'hci-lab-ia-project-v2';
export const PREFS_KEY = 'hci-prefs-v2';
export const LANGUAGE_KEY = 'hci-language';
export const languages = ['es-CO','en-US','pt-BR','fr-FR','it-IT','ca-ES'] as const;
export const defaultPrefs = { dark:false, contrast:false, font:100, spacing:false, dyslexia:false, motion:false };
export type Preferences = typeof defaultPrefs;
export type BackupSettings = { preferences:Preferences; language:string };
