import type {ExperimentDisplayContext} from '../domain';
export function readExperimentDisplay():ExperimentDisplayContext {
 const root=document.documentElement;
 return {font:parseFloat(root.style.fontSize)||100,dark:root.dataset.theme==='dark',contrast:root.dataset.contrast==='true',spacing:root.dataset.spacing==='true',alternativeFont:root.dataset.dyslexia==='true',motion:root.dataset.motion==='true',width:window.innerWidth,height:window.innerHeight,pixelRatio:window.devicePixelRatio||1};
}
