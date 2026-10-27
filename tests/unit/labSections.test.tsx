import {cleanup,render,screen} from '@testing-library/react';
import {afterEach,it,expect} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import {LabSections} from '../../src/shared/ui/LabSections';

afterEach(cleanup);

it('synchronizes the expanded laboratory section when the active route changes',()=>{
 const sections=[
  {id:'reservations',title:'Reservas',intro:'Gestionar reservas',href:'/lab'},
  {id:'users',title:'Usuarios',intro:'Gestionar usuarios',href:'/lab/users'},
 ];
 const {rerender}=render(<MemoryRouter><LabSections active="reservations" sections={sections} navigationLabel="Laboratorio">Contenido</LabSections></MemoryRouter>);
 const reservations=screen.getByRole('button',{name:'Reservas'}),users=screen.getByRole('button',{name:'Usuarios'});
 expect(reservations).toHaveAttribute('aria-expanded','true');expect(users).toHaveAttribute('aria-expanded','false');

 rerender(<MemoryRouter><LabSections active="users" sections={sections} navigationLabel="Laboratorio">Contenido</LabSections></MemoryRouter>);
 expect(reservations).toHaveAttribute('aria-expanded','false');expect(users).toHaveAttribute('aria-expanded','true');
});
