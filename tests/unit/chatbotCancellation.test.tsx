import {act,cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {ProjectProvider} from '../../src/features/project/store';
import { Chatbots } from '../../src/features/chatbots/Chatbots';
import i18n from '../../src/app/i18n';

afterEach(()=>{cleanup();vi.useRealTimers();});

it('keeps an editable, focused response when stopped before the first word, including regeneration',async()=>{
  localStorage.clear();await i18n.changeLanguage('es-CO');vi.useFakeTimers();
  render(<MemoryRouter><ProjectProvider><Chatbots/></ProjectProvider></MemoryRouter>);
  const chat=within(screen.getByRole('heading',{name:'Chatbot B: buena práctica'}).closest('section')!);
  fireEvent.change(chat.getByLabelText('Mensaje editable'),{target:{value:'Review keyboard access'}});
  fireEvent.click(chat.getByRole('button',{name:'Enviar mensaje'}));
  fireEvent.click(chat.getByRole('button',{name:'Detener respuesta'}));
  act(()=>vi.advanceTimersByTime(20));
  expect(chat.getByLabelText('Respuesta editable')).toHaveValue('');
  expect(chat.getByLabelText('Respuesta editable')).toBeEnabled();
  expect(chat.getByLabelText('Respuesta editable')).toHaveFocus();
  fireEvent.change(chat.getByLabelText('Respuesta editable'),{target:{value:'Human draft'}});
  fireEvent.click(chat.getByRole('button',{name:'Regenerar'}));
  fireEvent.click(chat.getByRole('button',{name:'Detener respuesta'}));
  act(()=>vi.advanceTimersByTime(20));
  expect(chat.getByLabelText('Respuesta editable')).toHaveValue('');
  expect(chat.getByLabelText('Respuesta editable')).toHaveFocus();
  fireEvent.change(chat.getByLabelText('Respuesta editable'),{target:{value:'Final human review'}});
  for(const name of ['Claridad','Control','Tono','Transparencia'])fireEvent.change(chat.getByLabelText(name,{exact:true}),{target:{value:'4'}});
  fireEvent.change(chat.getByLabelText('Evidencia de la evaluación'),{target:{value:'Stopped before the first word'}});
  fireEvent.click(chat.getByRole('button',{name:'Guardar rúbrica del chatbot'}));
  const state=JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!);
  expect(state.evidence).toHaveLength(1);
  expect(state.evidence[0].chatbot.response).toBe('Final human review');
  act(()=>vi.advanceTimersByTime(1000));
  expect(chat.getByLabelText('Respuesta editable')).toHaveValue('Final human review');
});
