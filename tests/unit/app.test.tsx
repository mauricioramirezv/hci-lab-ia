import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '../../src/i18n';
import App from '../../src/App';
import { ProjectProvider } from '../../src/store';

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
    fireEvent.change(screen.getByLabelText('Servicio'), { target: { value: 'Orientación UX' } });
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2026-10-15' } });
    fireEvent.change(screen.getByLabelText('Hora'), { target: { value: '10:30' } });
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirmar cita/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/cita confirmada/i);
    expect(screen.getByRole('cell', { name: 'Orientación UX' })).toBeInTheDocument();
  });
});
