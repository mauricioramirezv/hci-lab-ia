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
const relative = file => path.relative(root, file).split(path.sep).join('/');
function resolve(file, specifier) {
  const base = path.resolve(path.dirname(file), specifier);
  return [base, base+'.ts', base+'.tsx', path.join(base,'index.ts'), path.join(base,'index.tsx')].find(candidate => known.has(candidate));
}
for (const file of files) {
  const ast = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const dependencies = new Set();
  const isolated = /src\/features\/reservations\/(?:domain|application)\//.test(relative(file));
  const visit = node => {
    let specifier;
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) specifier=node.moduleSpecifier.text;
    if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) specifier=node.argument.literal.text;
    if (ts.isCallExpression(node) && node.expression.kind===ts.SyntaxKind.ImportKeyword && ts.isStringLiteral(node.arguments[0])) specifier=node.arguments[0].text;
    if (specifier) {
      const target = resolve(file, specifier);
      if (target) dependencies.add(target);
      if (isolated && (!target || !/src\/features\/reservations\/(?:domain|application)\//.test(relative(target)))) violations.push({file:relative(file),import:specifier});
      if (relative(file).includes('/reservations/domain/') && target && !relative(target).includes('/reservations/domain/')) violations.push({file:relative(file),import:specifier});
    }
    if (isolated && ts.isIdentifier(node) && ['window','document','localStorage','sessionStorage','navigator'].includes(node.text)) violations.push({file:relative(file),browserAPI:node.text});
    ts.forEachChild(node, visit);
  };
  visit(ast);
  graph.set(file,[...dependencies]);
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
