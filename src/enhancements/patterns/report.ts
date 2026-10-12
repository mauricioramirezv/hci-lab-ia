import type {Evidence} from '../model';
import {patternIds} from './model';
import {patternResource} from './locales';
export function patternObservationMarkdown(record:Evidence,language:string){
  const data=record.pattern;if(!data)return '';
  const resource=patternResource(language),index=patternIds.indexOf(data.id),ui=resource.ui;
  return [`### ${resource.patterns[index].name} — ${ui[record.condition==='good'?'good':'bad']}`,`${ui.alias}: ${record.participant||ui.noAlias}`,ui.recordDate.replace('{{date}}',record.createdAt),`ID: ${record.id}`,ui.recordHelp,`${ui.identified}:\n${data.problem}`,`${ui.principle}:\n${data.principle}`,`${ui.correction}:\n${data.correction}`].join('\n\n');
}
