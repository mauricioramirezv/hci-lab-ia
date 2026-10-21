export type ReportBlock={kind:'heading';level:1|2|3;text:string}|{kind:'text';text:string}|{kind:'table';headers:string[];rows:string[][]};
const mdEscape=(s:string)=>s.replaceAll('\\','\\\\').replace(/[|*_`<>#[\]]/g,c=>`\\${c}`).replaceAll('\n','<br>');
export function blocksMarkdown(blocks:ReportBlock[]){return blocks.map(b=>b.kind==='heading'?`${'#'.repeat(b.level)} ${mdEscape(b.text)}`:b.kind==='text'?b.text:b.headers.map(mdEscape).join(' | ')+'\n'+b.headers.map(()=>'---').join(' | ')+'\n'+b.rows.map(row=>row.map(mdEscape).join(' | ')).join('\n')).join('\n\n');}
