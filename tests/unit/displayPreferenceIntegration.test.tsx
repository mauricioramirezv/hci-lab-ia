import {act,cleanup,render,fireEvent,screen} from '@testing-library/react';
import {Sensory} from '../../src/features/accessibility/presentation/Sensory';
import '../../src/app/i18n';
import {afterEach,beforeEach,it,expect,vi} from 'vitest';
import {useDisplayPreferences} from '../../src/features/accessibility/presentation';
import {applyDisplayPreferences,DISPLAY_PREFERENCES_EVENT} from '../../src/features/accessibility/infrastructure';
import {defaultPrefs,PREFS_KEY,PROJECT_KEY} from '../../src/features/project/domain';
import {readPreferences} from '../../src/features/project/infrastructure';
import {crudProject} from '../fixtures/crudProject';
let display:ReturnType<typeof useDisplayPreferences>;
function Probe(){display=useDisplayPreferences();return null;}
beforeEach(()=>localStorage.clear());afterEach(()=>{cleanup();vi.useRealTimers();vi.restoreAllMocks();});
it('publishes document flags and uses the same persisted preferences after remount',()=>{
 localStorage.setItem(PREFS_KEY,JSON.stringify({font:125,dark:true}));const first=render(<Probe/>);expect(display.prefs).toEqual({...defaultPrefs,font:125,dark:true});expect(document.documentElement.style.fontSize).toBe('125%');
 act(()=>{expect(display.change(p=>({...p,font:200,contrast:true,spacing:true,dyslexia:true,motion:true}))).toBe(true);});expect(document.documentElement.dataset).toMatchObject({theme:'dark',contrast:'true',spacing:'true',dyslexia:'true',motion:'true',textLarge:'true'});
 const saved={...display.prefs};first.unmount();render(<Probe/>);expect(display.prefs).toEqual(saved);expect(readPreferences()).toEqual(saved);
});
it('does not publish a failed preference write, preserves project data and permits retry',()=>{
 const project=JSON.stringify(crudProject());localStorage.setItem(PROJECT_KEY,project);render(<Probe/>);const before=display.prefs,stored=localStorage.getItem(PREFS_KEY),write=Storage.prototype.setItem;
 const failure=vi.spyOn(Storage.prototype,'setItem').mockImplementation(function(this:Storage,key,value){if(key===PREFS_KEY)throw Error('quota');write.call(this,key,value);});
 act(()=>{expect(display.change(p=>({...p,font:200}))).toBe(false);});expect(display.prefs).toBe(before);expect(display.error).toBe(true);expect(localStorage.getItem(PREFS_KEY)).toBe(stored);expect(localStorage.getItem(PROJECT_KEY)).toBe(project);
 failure.mockRestore();act(()=>{expect(display.change(p=>({...p,font:200}))).toBe(true);});expect(display.prefs.font).toBe(200);expect(display.error).toBe(false);
 act(()=>{expect(display.restore()).toBe(true);});expect(display.prefs).toEqual(defaultPrefs);expect(localStorage.getItem(PROJECT_KEY)).toBe(project);
});
it('notifies capture observers before changing geometry and avoids notifications for unchanged preferences',()=>{
 applyDisplayPreferences(defaultPrefs);const observer=vi.fn(()=>expect(document.documentElement.style.fontSize).toBe('100%'));window.addEventListener(DISPLAY_PREFERENCES_EVENT,observer);
 try{applyDisplayPreferences({...defaultPrefs,font:200},defaultPrefs);expect(observer).toHaveBeenCalledOnce();expect(document.documentElement.style.fontSize).toBe('200%');applyDisplayPreferences({...defaultPrefs,font:200},{...defaultPrefs,font:200});expect(observer).toHaveBeenCalledOnce();}finally{window.removeEventListener(DISPLAY_PREFERENCES_EVENT,observer);}
});
it('pauses the teaching motion timer without changing its selected simulation or visual filter',()=>{
 vi.useFakeTimers();const view=render(<Sensory/>);
 const motor=screen.getByLabelText('Dificultad de precisión: objetivo oscilante'),filter=screen.getByLabelText('Filtro visual');
 fireEvent.change(filter,{target:{value:'blur'}});fireEvent.click(motor);
 const target=screen.getByRole('button',{name:'Confirmar'});expect(target.style.transform).not.toBe('');expect(vi.getTimerCount()).toBe(1);
 act(()=>vi.advanceTimersByTime(200));view.rerender(<Sensory reducedMotion/>);
 expect(target.style.transform).toBe('');expect(vi.getTimerCount()).toBe(0);expect((motor as HTMLInputElement).checked).toBe(true);expect((filter as HTMLSelectElement).value).toBe('blur');
 view.rerender(<Sensory/>);expect(target.style.transform).not.toBe('');expect(vi.getTimerCount()).toBe(1);view.unmount();expect(vi.getTimerCount()).toBe(0);
});
