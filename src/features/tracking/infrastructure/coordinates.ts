import { contentPoint } from '../domain/geometry';
export function interactionArea(element:Element):string {
 const tagged=element.closest('[data-aoi]');if(tagged)return tagged.getAttribute('data-aoi')||'area';
 const control=element.closest('button,a,input,select,textarea')||element;
 const parts:string[]=[];let node:Element|null=control;
 while(node&&node.id!=='main-content'&&parts.length<5){const tag=node.tagName.toLowerCase();const siblings=node.parentElement?[...node.parentElement.children].filter(e=>e.tagName===node?.tagName):[];parts.unshift(`${tag}:${siblings.indexOf(node)+1}`);node=node.parentElement;}
 return parts.join('/'); // No text, IDs, input values or label contents are collected.
}
export function pointPosition(x:number,y:number,pane:HTMLElement|null,target:'example'|'page'){
 return target==='example'&&pane?contentPoint(x,y,pane.getBoundingClientRect(),pane.scrollLeft,pane.scrollTop,pane.clientLeft,pane.clientTop):{x:x+window.scrollX,y:y+window.scrollY};
}
