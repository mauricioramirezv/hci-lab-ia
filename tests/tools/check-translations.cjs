const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const root=path.resolve(__dirname,'../..');process.chdir(root);
const languages=['es-CO','en-US','pt-BR','fr-FR','it-IT','ca-ES'];
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const catalogs=walk('src/features').filter(file=>file.endsWith('interfaceText.json'));
const keys=new Set(),issues=[];
for(const file of catalogs)for(const [key,values]of Object.entries(JSON.parse(fs.readFileSync(file,'utf8')))){
 keys.add(key);for(const language of languages)if(!values[language]?.trim())issues.push({file,key,language});
}
// Technical names, literal commands, units and decoration intentionally keep their spelling.
const technical=new Set(['H+','UX · A11y · AI','WCAG · Nielsen · SUS · E2E','ES','EN','PT','FR','IT','CA','HCI + UX','HCI Lab + IA','HCI LAB + IA','HCI Lab','HCI · UX','Nielsen','Nielsen Norman Group','ID','ID:','NASA-TLX','SUS / Raw TLX','SUS','Raw TLX','· SUS','Fitts / Hick','D (px)','s ·','px ·','px','WCAG 1.4.1','WCAG 2.2 · W3C','12 · 45 · 23 · 07 · INFO · MENU · MEDIA','INFO · UX · 23 · 07 · MENU · 12 · 08 · 61','UX · 12 · 08 · 45 · 07 · INFO · 23 · 61','GB','Lint','Unit','Build','E2E','A11y','Pages','npm run lint','npm test','npm run build','npm run test:e2e','npm run test:a11y']);
const sourceFiles=walk('src').filter(file=>file.endsWith('.tsx'));
for(const file of sourceFiles){const ast=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const check=(node,text)=>{text=text.trim();if(/[\p{L}]{2}/u.test(text)&&!technical.has(text)&&!/^\d+ GB$/.test(text))issues.push({file,line:ast.getLineAndCharacterOfPosition(node.getStart(ast)).line+1,text});};
 const visit=node=>{
  if(ts.isJsxText(node))check(node,node.text);
  if(ts.isStringLiteral(node)&&ts.isJsxAttribute(node.parent)&&['title','intro','eyebrow','aria-label','placeholder','alt'].includes(node.parent.name.text))check(node,node.text);
  if(ts.isCallExpression(node)&&ts.isIdentifier(node.expression)&&node.expression.text==='tx'&&ts.isStringLiteral(node.arguments[0])&&!keys.has(node.arguments[0].text))issues.push({file,key:node.arguments[0].text});
  ts.forEachChild(node,visit);
 };visit(ast);
}
console.log(JSON.stringify({catalogs:catalogs.length,staticKeys:keys.size,sourceFiles:sourceFiles.length,issues},null,2));
process.exitCode=issues.length?1:0;
