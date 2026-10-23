import type { EvidenceWriter } from '../../project/application';
import type { Trial } from '../domain/types';
import { experimentScores } from '../domain/measurements';
import {experimentDisplayKey,experimentDisplayScores} from '../domain';
import type {ExperimentDisplayContext} from '../domain';
export function recordExperiment(write:EvidenceWriter,input:{rows:Trial[];kind:'Fitts'|'Hick';condition:string;alias:string;notes:string;size:number;options:number;display?:ExperimentDisplayContext}) {
 const {rows,kind,condition,alias,notes,size,options}=input;
 if(rows.length!==8)return false;
 const display=input.display?experimentDisplayScores(input.display):{};
 if(experimentDisplayKey(display)===null)return false;
 return write({kind:'experiment',participant:alias,task:kind,condition,prototype:'iteration7',scores:{...experimentScores(rows,kind,size,options),...display},notes,experiment:{kind,condition,trials:rows,practiceCount:2}});
}
