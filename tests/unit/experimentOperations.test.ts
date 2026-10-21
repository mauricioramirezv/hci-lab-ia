// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { measuredTrial, meanSeconds, experimentScores, recordExperiment } from '../../src/features/experiments';
import type { EvidenceWriter } from '../../src/features/project/application';

it('calculates Fitts geometry without a browser and preserves the first trial without distance',()=>{
 const input={kind:'Fitts' as const,position:{x:3,y:4},previous:null,size:5,seconds:1.25,errors:2,keyboard:false};
 expect(measuredTrial(input)).toEqual({seconds:1.25,errors:2,input:'pointer'});
 expect(measuredTrial({...input,previous:{x:0,y:0},keyboard:true})).toEqual({seconds:1.25,errors:2,input:'keyboard',distance:5,indexDifficulty:1});
 expect(measuredTrial({...input,kind:'Hick',previous:{x:0,y:0}}).distance).toBeUndefined();
});
it('records only eight measurement trials, retains raw values, and propagates write failure',()=>{
 const rows=Array.from({length:8},(_,i)=>({seconds:i+1,errors:i===0?1:0,input:'keyboard'})),write=vi.fn<EvidenceWriter>(()=>false);
 expect(meanSeconds(rows)).toBe(4.5);expect(experimentScores(rows,'Hick',24,12)).toMatchObject({seconds:4.5,errors:1,trials:8,options:12,trial8Seconds:8});
 const input={rows,kind:'Hick' as const,condition:'complex',alias:'',notes:'RAW',size:24,options:12};
 expect(recordExperiment(write,{...input,rows:rows.slice(0,2)})).toBe(false);expect(write).not.toHaveBeenCalled();
 expect(recordExperiment(write,input)).toBe(false);expect(write.mock.calls[0][0].experiment).toEqual({kind:'Hick',condition:'complex',trials:rows,practiceCount:2});
});
