import { es } from './es';
import { en } from './en';
import { pt } from './pt';
import { fr } from './fr';
import { it } from './it';
import { ca } from './ca';
import type { ConceptText } from './domain/model';
type Resource={ui:Record<keyof typeof es.ui,string>;groups:string[];concepts:ConceptText[];diagnosis:{situation:string;question:string;options:string[];explanations:string[];correction:string}};
export const conceptResources = {'es-CO':es,'en-US':en,'pt-BR':pt,'fr-FR':fr,'it-IT':it,'ca-ES':ca} satisfies Record<string,Resource>;
