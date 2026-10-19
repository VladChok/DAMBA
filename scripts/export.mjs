import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = new URL('../', import.meta.url);
const read = file => readFile(new URL(file, root), 'utf8');
let html = await read('index.html');
html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>${await read('styles.css')}</style>`);
html = html.replace('<script type="module" src="app.js"></script>', '');
for (const asset of ['globe.svg', 'strait.svg', 'favicon.svg']) {
  html = html.replaceAll(`assets/${asset}`, `data:image/svg+xml;base64,${Buffer.from(await read(`assets/${asset}`)).toString('base64')}`);
}
html = html.replace('href="research.md"', 'href="https://github.com/VladChok/DAMBA/blob/codex/bering-editorial/research.md"');
const model = (await read('model.js')).replaceAll('export function', 'function');
const app = (await read('app.js')).replace(/^import .*?;\r?\n/, '');
html = html.replace('</body>', `<script type="module">\n${model}\n${app}\n</script>\n</body>`);
const destination = resolve(process.argv[2] || '../bering-1990.html');
await writeFile(destination, html);
console.log(`Standalone HTML exported to ${destination}`);
