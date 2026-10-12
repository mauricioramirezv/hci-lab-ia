import { describe, expect, it } from 'vitest';
import { activityLanguages, activityResources } from '../../src/projectActivities/locales';
import { deletePersona, linkedPersona, localDay, sameBooking, savePersona, scheduleError, services, serviceContexts } from '../../src/projectActivities/model';
import { createBackup, defaultPrefs, emptyProject, parseBackup } from '../../src/projectBackup';
import { representativeProject } from '../fixtures/representativeProject';

describe('iteration 5 data and compatibility',()=>{
 it.each(activityLanguages)('provides every translated label in %s',lang=>{
  expect(Object.keys(activityResources[lang]).sort()).toEqual(Object.keys(activityResources['es-CO']).sort());
  expect(Object.values(activityResources[lang]).every(v=>typeof v==='string'&&v.trim().length>0)).toBe(true);
  for(const id of services)expect(activityResources[lang][id==='culture'?'cultureActivity':id]).toBeTruthy();
 });
 it('covers the three contexts without invented availability',()=>expect(new Set(Object.values(serviceContexts))).toEqual(new Set(['university','healthcare','culture'])));
 it.each([
  ['', '10:30','dateRequired'],['2026-02-30','10:30','dateInvalid'],['2026-10-09','10:30','dateInvalid'],
  ['2026-10-10','','timeRequired'],['2026-10-11','25:00','timeRequired'],['2026-10-10','08:00','timePast'],['2026-10-10','14:00',''],['2026-10-11','08:00',''],
 ])('validates %s %s', (date,time,result)=>expect(scheduleError(date,time,new Date(2026,9,10,12,0))).toBe(result));
 it('uses the local calendar day',()=>expect(localDay(new Date(2026,9,10,23,59))).toBe('2026-10-10'));
 it('prevents a duplicate independently of translation or condition; cancelled slots can be reused',()=>{
  const old={id:'a',serviceId:'health' as const,service:'Cita ficticia',date:'2099-10-15',time:'10:30',status:'confirmed' as const,createdAt:'now'};
  expect(sameBooking(old,{...old,service:'Fictional appointment'})).toBe(true);
  expect(sameBooking({...old,status:'cancelled'},old)).toBe(false);
 });
 it('migrates an unambiguous legacy link before renaming without changing student text',()=>{
  const p=representativeProject();const renamed={...p.personas[0],name:'Ana nueva'};const next=savePersona(p,renamed);
  expect(next.scenarios[0].personaId).toBe(renamed.id);expect(next.scenarios[0].actor).toBe('Ana nueva');
  expect(next.scenarios[0].task).toBe(p.scenarios[0].task);expect(next.personas[0].empathy).toEqual(p.personas[0].empathy);
  expect(deletePersona(next,renamed.id)).toBe(next);
  expect(deletePersona({...next,scenarios:[]},renamed.id).personas).toEqual([]);
 });
 it('does not silently resolve ambiguous legacy names or drop orphan data',()=>{
  const p=representativeProject();p.personas.push({...p.personas[0],id:'duplicate'});
  expect(linkedPersona(p.scenarios[0],p.personas)).toBeUndefined();
  const next=savePersona(p,{...p.personas[0],name:'Changed'});expect(next.scenarios[0]).toEqual(p.scenarios[0]);
  expect(next).toBe(p);expect(deletePersona(p,p.personas[0].id)).toBe(p);
 });
 it('round trips new metadata and all existing collections with legacy version 2',()=>{
  const p=representativeProject();p.appointments[0]={...p.appointments[0],serviceId:'advice',condition:'bad'};
  p.personas[0]={...p.personas[0],basis:'mixed',observed:'Texto observado escrito',assumptions:'Supuesto sin validar',emotionSource:'declared'};
  p.scenarios[0]={...p.scenarios[0],personaId:p.personas[0].id,fictional:true};
  expect(parseBackup(createBackup(p,defaultPrefs,'ca-ES')).project).toEqual(p);
  expect(parseBackup(representativeProject()).project).toEqual(representativeProject());
  expect(emptyProject().personas).toEqual([]);
 });
 it.each([
  ['appointments','serviceId','unknown'],['appointments','condition','random'],['personas','basis','camera'],['personas','observed',5],['personas','emotionSource','camera'],['scenarios','personaId',false],['scenarios','fictional','yes'],
 ])('rejects malformed %s.%s without altering the source', (collection,field,value)=>{
  const p=representativeProject();const before=structuredClone(p);const input=structuredClone(p) as unknown as Record<string,Record<string,unknown>[]>;input[collection][0][field]=value;
  expect(()=>parseBackup(input)).toThrow();expect(p).toEqual(before);
 });
});
