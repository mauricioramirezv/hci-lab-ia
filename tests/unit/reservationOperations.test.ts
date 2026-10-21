// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { createReservationOperations } from '../../src/features/reservations/application';
import type { ReservationRepository } from '../../src/features/reservations/application';
import type { Appointment, ReservationDraft } from '../../src/features/reservations/domain';

const now=new Date(2026,9,19,12);
const draft: ReservationDraft={service:'Consulta',serviceId:'health',date:'2099-10-20',time:'10:30',condition:'bad'};
function setup() {
  let records: Appointment[]=[];
  const repository: ReservationRepository={
    read:()=>records,
    transact:change=>{
      const result=change(records);
      if(!result.ok)return result;
      records=result.appointments;
      return {ok:true,appointment:result.appointment};
    },
  };
  let sequence=0;
  const id=vi.fn(()=>`booking-${++sequence}`);
  return {operations:createReservationOperations(repository,{id,now:()=>now}),id};
}

describe('reservation operations independent of React and storage APIs',()=>{
  it('creates and queries records without changing draft text or persisting context',()=>{
    const {operations,id}=setup();const before=structuredClone(draft);
    expect(operations.create(draft,{context:'healthcare'})).toEqual({ok:true,appointment:{...draft,id:'booking-1',status:'confirmed',createdAt:now.toISOString()}});
    expect(operations.get('booking-1')).toEqual(operations.list()[0]);
    expect(operations.get('unknown')).toBeUndefined();expect(draft).toEqual(before);expect(id).toHaveBeenCalledOnce();
    expect(operations.list()[0]).not.toHaveProperty('context');
  });
  it('revalidates duplicates at commit even if an earlier form validation succeeded',()=>{
    const {operations,id}=setup();expect(operations.validate(draft,{context:'healthcare'})).toEqual({});
    expect(operations.create(draft,{context:'healthcare'}).ok).toBe(true);
    expect(operations.create({...draft,service:'Another language'},{context:'healthcare'})).toEqual({ok:false,errors:{time:'duplicate'}});
    expect(operations.list()).toHaveLength(1);expect(id).toHaveBeenCalledOnce();
  });
  it('reschedules without replacing identity, creation time, status or the original condition',()=>{
    const {operations}=setup();operations.create(draft,{context:'healthcare'});
    const original=operations.get('booking-1')!;
    const result=operations.reschedule(original.id,{service:original.service,serviceId:original.serviceId,date:'2099-11-01',time:'14:00'});
    expect(result).toEqual({ok:true,appointment:{...original,date:'2099-11-01',time:'14:00'}});
    expect(operations.get(original.id)).toMatchObject({id:original.id,createdAt:original.createdAt,condition:'bad',status:'confirmed'});
  });
  it('rejects conflicts and past dates without altering either saved booking',()=>{
    const {operations}=setup();operations.create(draft,{context:'healthcare'});operations.create({...draft,time:'14:00'},{context:'healthcare'});
    const before=structuredClone(operations.list());
    expect(operations.reschedule('booking-2',draft)).toEqual({ok:false,errors:{time:'duplicate'}});
    expect(operations.reschedule('booking-2',{...draft,date:'2000-01-01'})).toEqual({ok:false,errors:{date:'dateInvalid'}});
    expect(operations.list()).toEqual(before);
  });
  it('cancels without deleting history, refuses cancelled or missing records, and frees the slot',()=>{
    const {operations}=setup();operations.create(draft,{context:'healthcare'});
    expect(operations.cancel('missing')).toEqual({ok:false,errors:{},reason:'notFound'});
    expect(operations.cancel('booking-1').ok).toBe(true);
    expect(operations.get('booking-1')).toMatchObject({status:'cancelled'});
    expect(operations.cancel('booking-1')).toEqual({ok:false,errors:{},reason:'notConfirmed'});
    expect(operations.reschedule('booking-1',draft)).toEqual({ok:false,errors:{},reason:'notConfirmed'});
    expect(operations.reschedule('missing',draft)).toEqual({ok:false,errors:{},reason:'notFound'});
    expect(operations.create(draft,{context:'healthcare'}).ok).toBe(true);expect(operations.list()).toHaveLength(2);
  });
  it('does not allocate identifiers or write invalid commands and preserves the device example',()=>{
    const {operations,id}=setup();
    expect(operations.create({...draft,service:''},{context:'healthcare'}).ok).toBe(false);expect(id).not.toHaveBeenCalled();
    expect(operations.create({service:'Legacy',date:'2000-01-01',time:'08:00'},{variant:'example'}).ok).toBe(true);
    expect(operations.list()[0]).not.toHaveProperty('serviceId');
    expect(operations.list()[0]).not.toHaveProperty('condition');
  });
});
