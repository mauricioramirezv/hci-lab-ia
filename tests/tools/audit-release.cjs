const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),zlib=require('node:zlib');
const root=path.resolve(__dirname,'../..');process.chdir(root);
const git=(...args)=>cp.execFileSync('git',args,{encoding:'utf8'}).trim();
const files=[...new Set(git('ls-files','-co','--exclude-standard','-z').split('\0').filter(Boolean))].filter(file=>fs.existsSync(file));
const pending=[...new Set([...git('diff','--name-only','HEAD','-z').split('\0'),...git('ls-files','--others','--exclude-standard','-z').split('\0')].filter(Boolean))];
const privateFiles=pending.filter(file=>/(?:^|\/)\.env(?:\.|$)|\.(?:pem|p12|pfx|key)$/i.test(file)&&!file.endsWith('.example'));
const sensitive=[];for(const file of pending.filter(file=>fs.existsSync(file)&&fs.statSync(file).size<2e6)){
 if(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bAKIA[A-Z0-9]{16}\b|\bgh[pousr]_[A-Za-z0-9]{30,}\b|\bsk-proj-[A-Za-z0-9_-]{30,}\b/.test(fs.readFileSync(file,'utf8')))sensitive.push(file);
}
const misplacedTests=files.filter(file=>/(?:\.test\.|\.spec\.|(?:^|\/)fixtures\/)/.test(file)&&!file.startsWith('tests/')&&!file.startsWith('docs/historico/'));
const outputFiles=files.filter(file=>/^(?:node_modules|dist|tmp|\.tools|coverage|test-results[^/]*|playwright-report|tests\/(?:results|reports|\.tools|\.cache))\//.test(file));
const brokenLinks=[];for(const file of files.filter(file=>file.endsWith('.md')&&(file.startsWith('README')||file.startsWith('docs/'))&&!file.startsWith('docs/historico/'))){
 const body=fs.readFileSync(file,'utf8');for(const match of body.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
  const link=match[1].split('#')[0];if(!link||/^(?:https?:|mailto:|app:|\/|<)/.test(link))continue;
  if(!fs.existsSync(path.resolve(path.dirname(file),decodeURIComponent(link))))brokenLinks.push({file,link});
 }
}
const dist=path.resolve('dist'),walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(item=>item.isDirectory()?walk(path.join(dir,item.name)):[path.join(dir,item.name)]);
const assets=walk(dist).map(file=>({file:path.relative(root,file).replaceAll('\\','/'),bytes:fs.statSync(file).size,gzip:zlib.gzipSync(fs.readFileSync(file)).length}));
const html=fs.readFileSync('dist/index.html','utf8'),initial=[...new Set([...html.matchAll(/(?:src|href)="\/hci-lab-ia\/([^"?]+\.js)"/g)].map(match=>'dist/'+match[1]))];
const scripts=assets.filter(asset=>asset.file.endsWith('.js')),initialScripts=scripts.filter(asset=>initial.includes(asset.file));
const report={version:JSON.parse(fs.readFileSync('package.json')).version,base:'/hci-lab-ia/',pendingFiles:pending.length,privateFiles,sensitive,misplacedTests,outputFiles,brokenLinks,production:{files:assets.length,largestJS:scripts.reduce((a,b)=>a.bytes>b.bytes?a:b),initialJS:{files:initialScripts.length,bytes:initialScripts.reduce((sum,a)=>sum+a.bytes,0),gzip:initialScripts.reduce((sum,a)=>sum+a.gzip,0)},totalJS:{bytes:scripts.reduce((sum,a)=>sum+a.bytes,0),gzip:scripts.reduce((sum,a)=>sum+a.gzip,0)},assets}};
fs.mkdirSync('tests/reports',{recursive:true});fs.writeFileSync('tests/reports/release-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,production:{...report.production,assets:undefined}},null,2));
process.exitCode=privateFiles.length||sensitive.length||misplacedTests.length||outputFiles.length||brokenLinks.length?1:0;
if(process.argv.includes('--e2e')){
 const data=JSON.parse(fs.readFileSync('tests/reports/playwright/results.json','utf8')),cases=new Set(),combinations=[],omissions=[];
 const collect=suite=>{for(const spec of suite.specs||[]){
  const key=`${spec.file||suite.file}:${spec.line}:${spec.title}`;cases.add(key);
  for(const run of spec.tests||[]){const outcome=run.results.at(-1)?.status||'not-run';combinations.push({case:key,project:run.projectName,outcome});if(outcome==='skipped')omissions.push({case:key,project:run.projectName,reasons:(run.annotations||[]).filter(a=>a.type==='skip').map(a=>a.description)});}
 }for(const child of suite.suites||[])collect(child);};data.suites.forEach(collect);
 const counts=rows=>Object.fromEntries([...new Set(rows.map(row=>row.outcome))].map(outcome=>[outcome,rows.filter(row=>row.outcome===outcome).length]));
 const summary={uniqueCases:cases.size,projectCombinations:combinations.length,outcomes:counts(combinations),projects:Object.fromEntries([...new Set(combinations.map(row=>row.project))].map(project=>[project,counts(combinations.filter(row=>row.project===project))])),omissions};
 fs.writeFileSync('tests/reports/release-e2e-summary.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));if(combinations.some(row=>!['passed','skipped'].includes(row.outcome)))process.exitCode=1;
}
if(process.argv.includes('--preview')){
 const http=require('node:http');
 Promise.all(assets.map(asset=>new Promise(resolve=>{
  const url=`http://127.0.0.1:4173/hci-lab-ia/${asset.file.slice(5)}`;
  const request=http.get(url,response=>{let bytes=0;response.on('data',data=>{bytes+=data.length;});response.on('end',()=>{
   const mime=String(response.headers['content-type']||''),expected=asset.file.endsWith('.js')?'javascript':asset.file.endsWith('.css')?'text/css':asset.file.endsWith('.svg')?'image/svg+xml':asset.file.endsWith('.md')?'text/markdown':'text/html';
   resolve({file:asset.file,status:response.statusCode,mime,bytes,ok:response.statusCode===200&&mime.includes(expected)&&bytes===asset.bytes});
  });});request.setTimeout(10000,()=>request.destroy(Error('Preview timeout')));request.on('error',error=>resolve({file:asset.file,ok:false,error:error.message}));
 }))).then(results=>{const failures=results.filter(result=>!result.ok);fs.writeFileSync('tests/reports/preview-audit.json',JSON.stringify({origin:'http://127.0.0.1:4173/hci-lab-ia/',results},null,2));console.log(JSON.stringify({previewResources:results.length,failures},null,2));if(failures.length)process.exitCode=1;});
}
