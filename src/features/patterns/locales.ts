import {es} from './es';
import {en} from './en';
import {pt} from './pt';
import {fr} from './fr';
import {it} from './it';
import {ca} from './ca';
import type {PatternText} from './model';
type Resource={ui:Record<keyof typeof es.ui,string>;categories:string[];patterns:PatternText[]};
export const patternResources={'es-CO':es,'en-US':en,'pt-BR':pt,'fr-FR':fr,'it-IT':it,'ca-ES':ca} satisfies Record<string,Resource>;
export function patternResource(language:string){return patternResources[language as keyof typeof patternResources]||es;}
