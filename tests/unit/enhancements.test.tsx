import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from '@testing-library/react';
import App from '../../src/App';
import { ProjectProvider } from '../../src/store';
import { rawTLX, areaSummary, csvCell } from '../../src/enhancements/model';
import { reportMarkdown } from '../../src/enhancements/reportModel';
import { sampleProject } from '../../src/domain';
import i18n from '../../src/i18n';
beforeEach(()=>{localStorage.clear();void i18n.changeLanguage('es-CO');});
const app=(path='/')=>render(<MemoryRouter initialEntries={[path]}><ProjectProvider><App/></ProjectProvider></MemoryRouter>);
it('calculates raw TLX with six valid dimensions and rejects invalid inputs',()=>{
  expect(rawTLX([10,20,30,40,50,60])).toBe(35);expect(()=>rawTLX([10])).toThrow();expect(()=>rawTLX([0,0,0,0,0,101])).toThrow();
});
it('groups click areas and escapes spreadsheet formula injection',()=>{
  expect(areaSummary([{x:0,y:0,at:0,weight:1,source:'mouse',area:'submit'},{x:1,y:2,at:2,weight:1,source:'keyboard',area:'submit'}])[0]).toMatchObject({count:2,percent:100});
  expect(csvCell('=cmd()')).toBe('"\'=cmd()"');expect(csvCell('a"b')).toBe('"a""b"');
});
it('filters concept topics and saves measured interaction evidence',()=>{
  app('/concepts');fireEvent.change(screen.getByLabelText('Temática'),{target:{value:'0'}});
  expect(screen.queryByRole('heading',{name:'Accesibilidad'})).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Abrir actividad: Usabilidad'}));
  fireEvent.click(screen.getByRole('button',{name:'Iniciar prueba'}));
  fireEvent.click(screen.getByRole('button',{name:'Una visita · 12 €'}));
  fireEvent.change(screen.getByLabelText('Alias opcional'),{target:{value:'P01'}});
  fireEvent.change(screen.getByLabelText('Observación'),{target:{value:'La acción fue clara.'}});
  fireEvent.click(screen.getByRole('button',{name:'Guardar resultados'}));
  const s=JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!);expect(s.evidence[0]).toMatchObject({task:'Usabilidad',scores:{interactions:1,errors:0},concept:{id:'usability',outcome:'completed'}});
});
it('adds Italian and Catalan controls without discarding the project',async()=>{
  localStorage.setItem('hci-lab-ia-project-v2',JSON.stringify(sampleProject));
  app();await act(()=>i18n.changeLanguage('it-IT'));expect(screen.getByRole('button',{name:'Gestisci progetto'})).toBeInTheDocument();
  await act(()=>i18n.changeLanguage('ca-ES'));expect(screen.getByRole('button',{name:'Gestiona el projecte'})).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!).personas[0].name).toBe('Ana');
});
it('includes interpretation limits and legacy records in the academic report',()=>{
  const text=reportMarkdown({...sampleProject,sessions:[{id:'s',createdAt:'now',participant:'P01',task:'Reserva',success:true,seconds:30,errors:0,seq:6,emotion:4,sus:80,notes:'Ejemplo de prueba'}]});
  expect(text).toContain('SUS (0–100) | 80');expect(text).toContain('Scroll no demuestra lectura');expect(text).toContain('Ana');
});
