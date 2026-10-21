// @vitest-environment node
import { expect, it } from 'vitest';
import { gazeValidation, createTrackingOperations } from '../../src/features/tracking';
import { voiceCommand, actionState, createMultimodalOperations } from '../../src/features/multimodal';
import { createProjectRepository } from '../../src/features/project/infrastructure';
import {emptyProject} from '../../src/features/project/domain';

it('calculates independent validation without camera, timers or viewport APIs',()=>{
 expect(gazeValidation([[1,2]],100,200,'now')).toBeUndefined();
 expect(gazeValidation([[1,2,3,4,100],[10,11,12,13,100]],100,200,'now')).toEqual({medianErrorPx:8,viewportWidth:100,viewportHeight:200,sampleCount:10,at:'now'});
});
it('matches only supported command prefixes and retains the demonstration states',()=>{
 expect(voiceCommand('  CONFIRMAR reserva ')).toBe('confirm');
 expect(voiceCommand('annuler')).toBe('cancel');expect(voiceCommand('naviguer au musée')).toBe('navigate');
 expect(voiceCommand('confirmation')).toBeUndefined();expect(actionState('message')).toBe('messageReady');expect(actionState('other')).toBe('pending');
});
it('uses one current project for multimodal and tracking operations and rejects stale/failed writes',()=>{
 let state=emptyProject(),active=true,fail=false;
 const repo=createProjectRepository({read:()=>state,isCurrent:()=>active,save:next=>{if(fail)throw Error('quota');state=next;},onStorageError:()=>{}});
 const multimodal=createMultimodalOperations(repo,()=> 'm',()=>new Date('2026-10-20T10:00:00Z'));
 const tracking=createTrackingOperations(repo,()=> 't',()=>new Date('2026-10-20T10:00:00Z'));
 const item={device:'watch' as const,practice:'good' as const,vision:'normal' as const,notes:'RAW',confidence:3,demoStatus:'Confirmed',channelStatus:''};
 expect(multimodal.record(item)).toBe(true);const before=state;fail=true;expect(multimodal.record(item)).toBe(false);expect(state).toBe(before);
 fail=false;active=false;expect(tracking.removePageSession('t')).toBe(false);expect(state).toBe(before);
});
