import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '../../src/app/i18n';
import App from '../../src/app/App';
import { ProjectProvider } from '../../src/features/project/store';

const renderApp = (path = '/') => render(<MemoryRouter initialEntries={[path]}><ProjectProvider><App /></ProjectProvider></MemoryRouter>);

describe('HCI Lab + IA', () => {
  it('renders the primary learning lab', () => {
    renderApp();
    expect(screen.getAllByText('HCI Lab + IA').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /HCI Lab \+ IA/i })).toBeInTheDocument();
  });
  it('exposes a language selector', () => {
    renderApp();
    expect(screen.getByRole('combobox', { name: /idioma/i })).toBeInTheDocument();
  });
  it('completes and persists an appointment in the visible list', () => {
    renderApp('/lab');
    fireEvent.change(screen.getByLabelText('Contexto'), { target: { value: 'university' } });
    fireEvent.change(screen.getByLabelText('Servicio'), { target: { value: 'advice' } });
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2099-10-15' } });
    fireEvent.change(screen.getByLabelText('Hora'), { target: { value: '10:30' } });
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirmar reserva/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/reserva confirmada/i);
    expect(screen.getByRole('heading', { name: 'Asesoría universitaria ficticia' })).toBeInTheDocument();
  });
});
