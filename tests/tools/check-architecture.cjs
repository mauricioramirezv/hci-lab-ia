const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const root = path.resolve(__dirname, '../..');
const sourceRoot = path.join(root, 'src');
const walk = directory => fs.readdirSync(directory, {withFileTypes:true}).flatMap(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : /\.tsx?$/.test(file) ? [file] : [];
});
const files = walk(sourceRoot);
const known = new Set(files);
const graph = new Map();
const violations = [];
const browserReferences = new Map();
const forbiddenImports = new Map();
const relative = file => path.relative(root, file).split(path.sep).join('/');
function resolve(file, specifier) {
  const base = path.resolve(path.dirname(file), specifier);
  return [base, base+'.ts', base+'.tsx', path.join(base,'index.ts'), path.join(base,'index.tsx')].find(candidate => known.has(candidate));
}
for (const file of files) {
  const ast = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const dependencies = new Set();
  const browser = [], forbidden = [];
  const isolated = /src\/features\/[^/]+\/(?:domain|application)\//.test(relative(file));
  const visit = node => {
    let specifier;
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) specifier=node.moduleSpecifier.text;
    if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) specifier=node.argument.literal.text;
    if (ts.isCallExpression(node) && node.expression.kind===ts.SyntaxKind.ImportKeyword && ts.isStringLiteral(node.arguments[0])) specifier=node.arguments[0].text;
    if (specifier) {
      const target = resolve(file, specifier);
      if (target) dependencies.add(target);
      if (/^(react|react-dom|react-router-dom|i18next|react-i18next)(\/|$)/.test(specifier)) forbidden.push(specifier);
      if (specifier.startsWith('.') && !target && !require('node:fs').existsSync(path.resolve(path.dirname(file),specifier))) violations.push({file:relative(file),unresolvedImport:specifier});
      if (isolated && (/^(react|react-dom|react-router-dom|i18next|react-i18next)(\/|$)/.test(specifier) || target && /\/(presentation|infrastructure)\/|\/locales(?:\/|\.)|src\/app\//.test(relative(target)))) violations.push({file:relative(file),import:specifier});
      if (relative(file).includes('/domain/') && target && relative(target).includes('/application/')) violations.push({file:relative(file),import:specifier});
      if (relative(file).startsWith('src/shared/') && target && relative(target).startsWith('src/features/')) violations.push({file:relative(file),import:specifier});
      const sourceFeature=relative(file).match(/^src\/features\/([^/]+)\//)?.[1], targetFeature=target&&relative(target).match(/^src\/features\/([^/]+)\/(domain|application|infrastructure|presentation)\/([^/]+)$/);
      const contract=relative(file)==='src/features/project/domain/state.ts' && target && relative(target)==='src/features/reports/domain/draft.ts';
      if (targetFeature && targetFeature[1]!==sourceFeature && targetFeature[3]!=='index.ts' && !contract) violations.push({file:relative(file),internalImport:relative(target)});
    }
    const propertyName = ts.isIdentifier(node) && node.parent && node.parent.name===node && (ts.isPropertySignature(node.parent)||ts.isPropertyAssignment(node.parent)||ts.isPropertyAccessExpression(node.parent));
    if (ts.isIdentifier(node) && !propertyName && ['window','document','localStorage','sessionStorage','navigator','HTMLElement','Element','MouseEvent','setTimeout','setInterval','requestAnimationFrame','fetch'].includes(node.text)) {
      browser.push(node.text);
      if (isolated) violations.push({file:relative(file),browserAPI:node.text});
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  graph.set(file,[...dependencies]);
  browserReferences.set(file,browser);
  forbiddenImports.set(file,forbidden);
}
for (const file of files.filter(f=>/src\/features\/[^/]+\/(?:domain|application)\//.test(relative(f)))) {
  const checked=new Set(), pending=[file];
  while(pending.length) {
    const dependency=pending.pop();if(checked.has(dependency))continue;checked.add(dependency);
    if (dependency!==file && ((browserReferences.get(dependency)||[]).length || (forbiddenImports.get(dependency)||[]).length || /\/(presentation|infrastructure)\/|\/locales(?:\/|\.)|src\/app\//.test(relative(dependency)))) violations.push({file:relative(file),transitiveDependency:relative(dependency)});
    if (relative(file).includes('/domain/') && relative(dependency).includes('/application/')) violations.push({file:relative(file),applicationDependency:relative(dependency)});
    pending.push(...(graph.get(dependency)||[]));
  }
}
const visiting = new Set(), visited = new Set(), stack = [], cycles = [];
function visit(file) {
  if (visiting.has(file)) { cycles.push([...stack.slice(stack.indexOf(file)),file].map(relative)); return; }
  if (visited.has(file)) return;
  visiting.add(file); stack.push(file);
  for (const target of graph.get(file) || []) visit(target);
  stack.pop(); visiting.delete(file); visited.add(file);
}
files.forEach(visit);
console.log(JSON.stringify({modules:files.length, includesTypeImports:true, cycles, isolatedLayerViolations:violations},null,2));
process.exitCode = cycles.length || violations.length ? 1 : 0;
