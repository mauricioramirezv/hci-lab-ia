import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup,within,act} from '@testing-library/react';
import i18n from '../../src/app/i18n';
import {interfaceResources} from '../../src/app/locales/interface';
import {ProjectProvider} from '../../src/features/project/presentation';
import {emptyProject,PROJECT_KEY} from '../../src/features/project/domain';
import {ConceptDemo,ConceptsPage} from '../../src/features/concepts/presentation';
import {PracticesPage} from '../../src/features/patterns/presentation';
import {Sensory} from '../../src/features/accessibility/presentation/Sensory';

afterEach(()=>{cleanup();localStorage.clear();vi.restoreAllMocks();});
for(const language of ['es-CO','en-US','pt-BR','fr-FR','it-IT','ca-ES'])it(`legacy examples preserve authored text and translate statuses in ${language}`,async()=>{
 await i18n.changeLanguage(language);localStorage.setItem(PROJECT_KEY,JSON.stringify(emptyProject()));const tx=(key:string)=>interfaceResources[language][key];
 const first=render(<ProjectProvider><ConceptsPage/><PracticesPage/></ProjectProvider>);
 expect(screen.getByRole('heading',{name:tx('Mapa integral de conceptos')})).toBeVisible();expect(screen.getByRole('heading',{name:tx('Buenas prácticas y antipatrones')})).toBeVisible();
 const activity=screen.getAllByText(tx('Demostración y actividad'))[0].closest('details')!;fireEvent.click(activity.querySelector('summary')!);const note=within(activity).getByRole('textbox');fireEvent.change(note,{target:{value:'Texto del usuario: ñ · keep my words'}});fireEvent.click(within(activity).getByRole('button',{name:tx('Guardar observación')}));expect(JSON.parse(localStorage.getItem(PROJECT_KEY)!).findings[0].problem).toBe('Texto del usuario: ñ · keep my words');first.unmount();
 const demo=render(<ProjectProvider><ConceptDemo name="Alias task untouched" index={5}/></ProjectProvider>);
 fireEvent.click(screen.getByRole('button',{name:i18n.t('upgrade.start')}));fireEvent.change(screen.getByLabelText(tx('Código de prueba')),{target:{value:'wrong'}});fireEvent.click(screen.getByRole('button',{name:tx('Verificar código')}));expect(screen.getAllByRole('status').some(el=>el.textContent===tx('Revise el código; puede corregir sin perder datos.'))).toBe(true);
 fireEvent.change(screen.getByLabelText(tx('Código de prueba')),{target:{value:'UX'}});fireEvent.click(screen.getByRole('button',{name:tx('Verificar código')}));fireEvent.change(screen.getByLabelText(i18n.t('upgrade.participant')),{target:{value:'Alias ñ unchanged'}});fireEvent.change(screen.getByLabelText(i18n.t('upgrade.notes')),{target:{value:'Notas intactas 你好'}});fireEvent.click(screen.getByRole('button',{name:i18n.t('upgrade.save')}));const record=JSON.parse(localStorage.getItem(PROJECT_KEY)!).evidence[0];expect(record).toMatchObject({participant:'Alias ñ unchanged',notes:'Notas intactas 你好',task:'Alias task untouched'});expect(screen.getAllByRole('status').some(el=>el.textContent===tx('Evidencia guardada en Informes.'))).toBe(true);demo.unmount();
 render(<Sensory/>);fireEvent.click(screen.getByRole('button',{name:tx('Confirmar')}));expect(screen.getByRole('status')).toHaveTextContent(tx('Acción confirmada con texto.'));
 await act(async()=>{await i18n.changeLanguage('en-US');});expect(screen.getByRole('status')).toHaveTextContent(interfaceResources['en-US']['Acción confirmada con texto.']);
});
