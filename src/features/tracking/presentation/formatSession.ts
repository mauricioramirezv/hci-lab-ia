import type { PageSession } from '../domain/pageSession';
import { trackingResources } from '../locales';
export function trackingMarkdown(s:PageSession,language:string){
 const r=trackingResources[language as keyof typeof trackingResources]||trackingResources['es-CO'];
 return [`### ${r.records}: ${s.task}`,`${r.alias}: ${s.participant||r.noAlias}`,`${r.target}: ${r[s.target||'page']} · ${s.route}`,`${r.duration}: ${s.seconds.toFixed(1)}`,`${r.clicks}: ${s.clickCount??s.clicks.length}`,`${r.wheel}: ${s.wheelEvents??0}`,`${r.scroll}: ${Math.max(0,s.scroll.length-1)}`,`${r.depth}: ${s.maxDepth.toFixed(1)}%`,`${r.mode}: ${(s.modeChanges||[]).map(m=>`${r[m.mode]} (${(m.at/1000).toFixed(1)} s)`).join(' → ')}`,`${r.pointer}: ${s.pointer.length} · ${r.simulation}: ${s.simulation.length} · ${r.gaze}: ${s.gaze.length}`,...(s.validation?[`${r.error}: ${s.validation.medianErrorPx}px · ${r.predictions}: ${s.validation.sampleCount}`]:[]),`${r.notes}: ${s.notes}`,r.scrollWarning,...(s.capped?[r.cap]:[])].join('\n');
}
