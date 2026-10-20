import { expect, test } from '@playwright/test';

test('reservations: device example keeps its minimal date policy and original record shape in the project and reports',async({page})=>{
  await page.goto('/hci-lab-ia/#/devices');
  await page.getByLabel('Servicio',{exact:true}).selectOption('Orientación UX');
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await page.getByLabel('Fecha',{exact:true}).fill('2000-10-15');
  await page.getByRole('combobox',{name:'Hora',exact:true}).selectOption('08:00');
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await page.getByRole('button',{name:'Confirmar cita',exact:true}).click();
  const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!).appointments[0]);
  expect(Object.keys(record).sort()).toEqual(['createdAt','date','id','service','status','time']);
  expect(record).toMatchObject({service:'Orientación UX',date:'2000-10-15',time:'08:00',status:'confirmed'});
  await page.goto('/hci-lab-ia/#/lab');await expect(page.locator('[data-booking]')).toHaveCount(1);
  await expect(page.locator('[data-booking]')).toContainText('Orientación UX');
  await page.goto('/hci-lab-ia/#/reports');await page.getByLabel('Tipo',{exact:true}).selectOption('appointment');
  await expect(page.locator('.r8-record')).toHaveCount(1);await expect(page.locator('.r8-record')).toContainText('Orientación UX');
});

test('reservations: storage failure never confirms a write; creation and cancellation can be retried',async({page})=>{
  await page.addInitScript(()=>{
    const original=Storage.prototype.setItem;
    Storage.prototype.setItem=function(key:string,value:string){
      if(key==='hci-lab-ia-project-v2' && (window as Window & {failReservations?:boolean}).failReservations)throw new DOMException('quota','QuotaExceededError');
      original.call(this,key,value);
    };
  });
  const fail=async(value:boolean)=>page.evaluate(flag=>{(window as Window & {failReservations?:boolean}).failReservations=flag;},value);
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!));
  await page.goto('/hci-lab-ia/#/lab');
  await page.locator('#context').selectOption('healthcare');await page.locator('#service').selectOption('health');
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await page.locator('#date').fill('2099-10-20');await page.locator('#time').selectOption('10:30');
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await fail(true);await page.getByRole('button',{name:'Confirmar reserva',exact:true}).click();
  await expect(page.locator('[data-booking]')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Confirmar reserva',exact:true})).toBeVisible();
  await expect(page.locator('.management-notice[role=alert]')).toBeVisible();expect((await read()).appointments).toEqual([]);
  await fail(false);await page.getByRole('button',{name:'Confirmar reserva',exact:true}).click();
  await expect(page.locator('[data-booking]')).toHaveCount(1);
  const original=(await read()).appointments[0];
  await fail(true);await page.locator('[data-booking]').getByRole('button',{name:'Cancelar reserva',exact:true}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Cancelar reserva',exact:true}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);expect((await read()).appointments[0]).toEqual(original);
  await expect(page.getByRole('status')).not.toContainText('Reserva cancelada.');
  await fail(false);await page.locator('[data-booking]').getByRole('button',{name:'Cancelar reserva',exact:true}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Cancelar reserva',exact:true}).click();
  await page.reload();expect((await read()).appointments[0]).toEqual({...original,status:'cancelled'});
  await expect(page.locator('[data-booking]')).toHaveCount(1);
});
