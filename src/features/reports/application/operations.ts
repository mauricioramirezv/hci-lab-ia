import type { ProjectRepository } from '../../project/application';
import type { ReportDraft } from '../domain/draft';
export function createReportOperations(repository:ProjectRepository) {
 return {saveDraft:(draft:ReportDraft)=>repository.transact(current=>({...current,reportDraft:draft}))};
}
export function exportReport(input:{kind:'md'|'csv'|'json';preview:boolean;selectedCount:number},render:(kind:'md'|'csv'|'json')=>string,write:(name:string,body:string,mime:string)=>void) {
 const {kind,preview,selectedCount}=input;
 if(!preview||!selectedCount)return false;
 try {write(kind==='md'?'hci-informe.md':`hci-evidencias.${kind}`,render(kind),kind==='md'?'text/markdown;charset=utf-8':kind==='csv'?'text/csv;charset=utf-8':'application/json;charset=utf-8');return true;}
 catch {return false;}
}
