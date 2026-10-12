import {createContext,useContext} from 'react';
import type {Capture,TrackingChannel,TrackingMode} from './session';
import type {GazeValidation} from './model';
export type Tracker={session:Capture|null;running:boolean;saved:boolean;message:string;target:'example'|'page';setTarget:(v:'example'|'page')=>void;alias:string;setAlias:(v:string)=>void;task:string;setTask:(v:string)=>void;notes:string;setNotes:(v:string)=>void;condition:'good'|'bad';setCondition:(v:'good'|'bad')=>void;channel:TrackingChannel;setChannel:(v:TrackingChannel)=>void;show:boolean;mapValid:boolean;setShow:(v:boolean)=>void;mode:TrackingMode;setMode:(v:TrackingMode)=>void;moving:boolean;paused:boolean;setMoving:(v:boolean)=>void;stopPath:()=>void;dot:{x:number;y:number}|null;start:()=>void;stop:()=>void;discard:()=>void;save:()=>void;stopSignal:number;prediction:(x:number,y:number)=>void;validation:(v:GazeValidation|undefined)=>void;register:(pane:HTMLElement|null,content:HTMLElement|null)=>void};
export const TrackingContext=createContext<Tracker|null>(null);
export function useTracker(){const value=useContext(TrackingContext);if(!value)throw new Error('TrackingProvider missing');return value;}
