import { responseFrame } from '../domain/response';
export function streamResponse(text:string,progressive:boolean,update:(value:string,complete:boolean)=>void) {
 let count=0;
 const timer=window.setInterval(()=>{const frame=responseFrame(text,++count,progressive);update(frame.text,frame.complete);if(frame.complete)window.clearInterval(timer);},35);
 return ()=>window.clearInterval(timer);
}
