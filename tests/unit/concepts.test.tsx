import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import i18n from '../../src/app/i18n';
import { Concepts } from '../../src/features/concepts/Concepts';
import { ProjectProvider } from '../../src/features/project/store';
import { conceptResources } from '../../src/features/concepts/locales';
import { conceptGroups,conceptIds } from '../../src/features/concepts/model';
import { createBackup,defaultPrefs,emptyProject,parseBackup } from '../../src/features/project/backup';
import { representativeProject } from '../fixtures/representativeProject';
const app=()=>render(<MemoryRouter><ProjectProvider><Concepts/></ProjectProvider></MemoryRouter>);
const stored=()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!);
beforeEach(()=>{localStorage.clear();void i18n.changeLanguage('es-CO');});
afterEach(()=>{cleanup();vi.useRealTimers();vi.restoreAllMocks();});
it('assigns all eleven concepts exactly once to the four requested topics',()=>{
  expect(conceptGroups).toEqual([[0,1,3,4,5],[2,6,9],[7,8],[10]]);
  expect(conceptGroups.flat().sort((a,b)=>a-b)).toEqual(conceptIds.map((_,i)=>i));
});
it('has complete module dictionaries and eleven distinct activities in all six languages',()=>{
  expect(Object.keys(conceptResources)).toHaveLength(6);
  for(const resource of Object.values(conceptResources)){
    expect(Object.keys(resource.ui).sort()).toEqual(Object.keys(conceptResources['es-CO'].ui).sort());
    expect(resource.groups).toHaveLength(4);expect(resource.concepts).toHaveLength(11);
    expect(new Set(resource.concepts.map(c=>c.instructions)).size).toBe(11);
    for(const concept of resource.concepts){expect(Object.keys(concept).sort()).toEqual(Object.keys(conceptResources['es-CO'].concepts[0]).sort());expect(Object.values(concept).every(s=>s.trim().length>0)).toBe(true);}
    expect(resource.diagnosis.explanations).toHaveLength(3);
  }
});
it('combines topic filtering and accent-insensitive search, and clears both filters',()=>{
  app();expect(screen.getAllByRole('button',{name:/Abrir actividad:/})).toHaveLength(11);
  fireEvent.change(screen.getByLabelText('Temática'),{target:{value:'2'}});
  expect(screen.getAllByRole('button',{name:/Abrir actividad:/})).toHaveLength(2);
  fireEvent.change(screen.getByLabelText('Buscar conceptos'),{target:{value:'COGNICION'}});
  expect(screen.getAllByRole('button',{name:/Abrir actividad:/})).toHaveLength(1);
  fireEvent.change(screen.getByLabelText('Buscar conceptos'),{target:{value:'no-such-concept'}});
  expect(screen.queryByRole('button',{name:/Abrir actividad:/})).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Limpiar filtros'}));expect(screen.getAllByRole('button',{name:/Abrir actividad:/})).toHaveLength(11);
});
it('counts submitted errors and interactions, records elapsed time and allows saving without an alias or invented ratings',()=>{
  app();fireEvent.click(screen.getByRole('button',{name:'Abrir actividad: Emociones'}));
  const clock=vi.spyOn(performance,'now').mockReturnValue(1000);
  fireEvent.click(screen.getByRole('button',{name:'Iniciar prueba'}));
  fireEvent.change(screen.getByLabelText('Código del cupón'),{target:{value:'incorrecto'}});
  fireEvent.click(screen.getByRole('button',{name:'Aplicar código'}));
  expect(screen.getByLabelText('Código del cupón')).toHaveValue('incorrecto');
  fireEvent.change(screen.getByLabelText('Código del cupón'),{target:{value:'CALMA'}});clock.mockReturnValue(2500);
  fireEvent.click(screen.getByRole('button',{name:'Aplicar código'}));
  fireEvent.click(screen.getByRole('button',{name:'Guardar resultados'}));
  expect(stored().evidence[0]).toMatchObject({participant:'',scores:{seconds:1.5,interactions:2,errors:1},concept:{id:'emotions',outcome:'completed',response:{text:'CALMA'}}});
  expect(Object.keys(stored().evidence[0].scores)).toEqual(['seconds','interactions','errors']);
  expect(screen.getByRole('button',{name:'Guardar resultados'})).toBeDisabled();
});
it('preserves free text and cancels a pending operation on condition change',()=>{
  vi.useFakeTimers();app();fireEvent.click(screen.getByRole('button',{name:'Abrir actividad: Awareness'}));
  fireEvent.change(screen.getByLabelText('Observación'),{target:{value:'Mi observación ✍️'}});
  fireEvent.click(screen.getByRole('button',{name:'Iniciar prueba'}));
  fireEvent.change(screen.getByLabelText('Nota del equipo'),{target:{value:'Nota escrita'}});
  fireEvent.click(screen.getByRole('button',{name:'Guardar nota en la actividad'}));
  fireEvent.change(screen.getByLabelText('Condición'),{target:{value:'bad'}});
  act(()=>vi.advanceTimersByTime(1200));
  expect(screen.getByRole('button',{name:'Iniciar prueba'})).toBeInTheDocument();
  expect(screen.queryByText('Nota guardada en la actividad. Puede continuar.')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Observación')).toHaveValue('Mi observación ✍️');
  fireEvent.click(screen.getByRole('button',{name:'Iniciar prueba'}));
  expect(screen.getByLabelText('Nota del equipo')).toHaveValue('Nota escrita');
  fireEvent.click(screen.getByRole('button',{name:'Cancelar prueba'}));
  fireEvent.click(screen.getByRole('button',{name:'Guardar resultados'}));
  expect(stored().evidence[0]).toMatchObject({condition:'bad',scores:{interactions:0,errors:0},concept:{outcome:'cancelled'}});
  fireEvent.click(screen.getByRole('button',{name:'Repetir prueba'}));expect(screen.queryByText(/Tiempo:/)).not.toBeInTheDocument();
});
it('only records emotion and confidence that were explicitly reported',()=>{
  app();fireEvent.click(screen.getByRole('button',{name:'Abrir actividad: Emociones'}));
  fireEvent.change(screen.getByLabelText('Emoción antes de la prueba'),{target:{value:'2'}});
  fireEvent.change(screen.getByLabelText('Confianza antes de la prueba'),{target:{value:'1'}});
  fireEvent.click(screen.getByRole('button',{name:'Iniciar prueba'}));fireEvent.change(screen.getByLabelText('Código del cupón'),{target:{value:'CALMA'}});fireEvent.click(screen.getByRole('button',{name:'Aplicar código'}));
  fireEvent.change(screen.getByLabelText('Emoción después de la prueba'),{target:{value:'4'}});
  fireEvent.click(screen.getByRole('button',{name:'Guardar resultados'}));
  expect(stored().evidence[0].scores).toMatchObject({emotionBefore:2,confidenceBefore:1,emotionAfter:4});expect(stored().evidence[0].scores.confidenceAfter).toBeUndefined();
});
it('checks the diagnosis explicitly, explains the response and correction, and supports retry',()=>{
  app();fireEvent.click(screen.getByRole('button',{name:'Comprobar'}));expect(screen.getByRole('alert')).toHaveTextContent('Elija una respuesta');
  fireEvent.change(screen.getByLabelText('Respuesta al diagnóstico'),{target:{value:'3'}});expect(screen.queryByText('Revise su respuesta')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Comprobar'}));expect(screen.getByText('Revise su respuesta')).toBeInTheDocument();expect(screen.getByText(/Reducir contenido no justifica/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Volver a intentar'}));expect(screen.getByLabelText('Respuesta al diagnóstico')).toHaveFocus();
  fireEvent.change(screen.getByLabelText('Respuesta al diagnóstico'),{target:{value:'1'}});fireEvent.click(screen.getByRole('button',{name:'Comprobar'}));expect(screen.getByText('Respuesta fundamentada')).toBeInTheDocument();
});
it('changes languages without overwriting user text, trial inputs or saved responses',async()=>{
  app();fireEvent.click(screen.getByRole('button',{name:'Abrir actividad: IA responsable'}));
  fireEvent.change(screen.getByLabelText('Observación'),{target:{value:'Observación original en español.'}});fireEvent.click(screen.getByRole('button',{name:'Iniciar prueba'}));
  fireEvent.change(screen.getByLabelText('Decisión registrada'),{target:{value:'editDecision'}});
  fireEvent.change(screen.getByLabelText('Justificación de su decisión'),{target:{value:'Necesitamos menos datos.'}});
  fireEvent.change(screen.getByLabelText('Propuesta editada'),{target:{value:'Solo un correo.'}});
  await act(()=>i18n.changeLanguage('fr-FR'));
  expect(screen.getByLabelText('Observation')).toHaveValue('Observación original en español.');expect(screen.getByLabelText('Proposition modifiée')).toHaveValue('Solo un correo.');
  fireEvent.click(screen.getByRole('button',{name:'Enregistrer la décision humaine'}));fireEvent.click(screen.getByRole('button',{name:'Enregistrer les résultats'}));
  expect(stored().evidence[0]).toMatchObject({notes:'Observación original en español.',concept:{response:{reason:'Necesitamos menos datos.',edit:'Solo un correo.',decision:'editDecision'}}});
});
it('round-trips new concept metadata and rejects incomplete metadata while keeping legacy backups compatible',()=>{
  const project=representativeProject();project.evidence![0].concept={id:'responsibleAI',outcome:'completed',response:{text:'Texto original',reason:'Razón',edit:'Edición',decision:'editDecision'}};
  expect(parseBackup(JSON.parse(JSON.stringify(createBackup(project,defaultPrefs,'es-CO')))).project).toEqual(project);
  const invalid=JSON.parse(JSON.stringify(project));delete invalid.evidence[0].concept.response.reason;expect(()=>parseBackup(invalid)).toThrow();
  const unknownDecision=JSON.parse(JSON.stringify(project));unknownDecision.evidence[0].concept.response.decision='unknown';expect(()=>parseBackup(unknownDecision)).toThrow();
});
it('shows legacy evidence without relabelling historic ratings or inventing missing metrics',async()=>{
  const project=emptyProject();project.evidence=[{id:'legacy',createdAt:'Fecha original',kind:'concept',participant:'Alias anterior',task:'Emociones',condition:'buena',prototype:'conceptos',scores:{seconds:2,clicks:3,emotion:4},notes:'Observación original ✍️'}];
  localStorage.setItem('hci-lab-ia-project-v2',JSON.stringify(project));await i18n.changeLanguage('fr-FR');app();
  const ui=conceptResources['fr-FR'].ui;fireEvent.click(screen.getByRole('button',{name:ui.evidence}));
  expect(screen.getByText(`${ui.legacyRating}: 4/5`)).toBeInTheDocument();expect(screen.getByText('Observación original ✍️')).toBeInTheDocument();expect(screen.getByText(/Fecha original/)).toBeInTheDocument();
  expect(screen.queryByText(/Invalid Date/)).not.toBeInTheDocument();expect(screen.queryByText(/Erreurs:/)).not.toBeInTheDocument();expect(stored().evidence).toEqual(project.evidence);
});
