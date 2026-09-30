import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../../src/i18n';
import App from '../../src/App';
import { ProjectProvider } from '../../src/store';
import type { ProjectState } from '../../src/domain';
const renderApp = (path = '/multimodal') => render(<MemoryRouter initialEntries={[path]}><ProjectProvider><App/></ProjectProvider></MemoryRouter>);
const readProject = () => JSON.parse(localStorage.getItem('hci-lab-ia-project-v2') || '{}') as ProjectState;
beforeEach(() => { localStorage.clear(); void i18n.changeLanguage('es-CO'); });
afterEach(cleanup);
describe('Multimodal integration', () => {
 it('changes color perception and removes text only in the teaching bad practice', () => {
  renderApp(); fireEvent.change(screen.getByLabelText('Percepción del color'), { target: { value: 'deuteranopia' } });
  expect(document.querySelector('.mm-color-sample')).toHaveAttribute('data-vision','deuteranopia');
  expect(screen.getByText('Error: falta confirmar')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Práctica'), { target: { value: 'bad' } });
  expect(screen.queryByText('Error: falta confirmar')).not.toBeInTheDocument();
 });
 it('blocks visual controls while moving and retains the written voice alternative', () => {
  renderApp(); fireEvent.change(screen.getByLabelText('Dispositivo'), { target: { value: 'car' } });
  fireEvent.click(screen.getByLabelText('Simular vehículo en movimiento'));
  expect(screen.getByRole('button',{name:'Navegar'})).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Comando (confirmar, cancelar, navegar)'), { target: { value:'navegar' } });
  fireEvent.click(screen.getByRole('button',{name:'Ejecutar comando'}));
  expect(screen.getByRole('status',{name:'Estado de la demostración'})).toHaveTextContent('Ruta simulada preparada');
 });
 it('requires a real observation and preserves evidence after remount with legacy project data', () => {
  renderApp(); fireEvent.click(screen.getByRole('button',{name:'Guardar evidencia'}));
  expect(readProject().multimodalEvidence).toBeUndefined();
  fireEvent.change(screen.getByLabelText('Observación, problema y corrección propuesta'), { target: { value:'El texto del reloj permitió entender la confirmación.' } });
  fireEvent.click(screen.getByRole('button',{name:'Confirmar'}));
  fireEvent.click(screen.getByRole('button',{name:'Guardar evidencia'}));
  expect(readProject().multimodalEvidence?.[0]).toMatchObject({device:'watch',practice:'good',confidence:3,notes:'El texto del reloj permitió entender la confirmación.'});
  expect(readProject().personas[0].name).toBe('Ana');
  cleanup(); renderApp(); expect(screen.getByText('El texto del reloj permitió entender la confirmación.')).toBeInTheDocument();
 });
 it('provides truthful fallback for absent vibration and voice recognition', () => {
  renderApp(); fireEvent.click(screen.getByRole('button',{name:'Probar vibración'}));
  expect(screen.getByRole('status',{name:'Respuesta del canal'})).toHaveTextContent('Este canal no está disponible');
  fireEvent.click(screen.getByRole('button',{name:'Activar micrófono'}));
  expect(screen.getByRole('status',{name:'Respuesta del canal'})).toHaveTextContent('Este canal no está disponible');
 });
 it('switches all new module controls to English', async () => {
  renderApp(); await act(async () => { await i18n.changeLanguage('en-US'); });
  expect(screen.getByRole('heading',{name:'Multimodal interaction'})).toBeInTheDocument();
  expect(screen.getByLabelText('Color perception')).toBeInTheDocument();
  expect(screen.getByRole('button',{name:'Save evidence'})).toBeInTheDocument();
 });
 it('stores a concept observation as a pending human finding', () => {
  renderApp('/concepts');
  fireEvent.change(screen.getByLabelText('Observación de Awareness'), { target: {value:'No reconocí si se había guardado.'} });
  const buttons=screen.getAllByRole('button',{name:'Guardar observación',hidden:true});
  fireEvent.click(buttons[3]);
  expect(readProject().findings[0]).toMatchObject({heuristic:'Awareness',source:'human',status:'pending',problem:'No reconocí si se había guardado.'});
 });
});
