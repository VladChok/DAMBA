import { cp, mkdir, stat } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
await mkdir(new URL('dist/', root), { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'model.js', 'assets', 'research.md']) {
  await cp(new URL(file, root), new URL(`dist/${file}`, root), { recursive: true });
}
const bytes = (await Promise.all(['index.html', 'styles.css', 'app.js', 'model.js'].map(async file => (await stat(new URL(file, root))).size))).reduce((a, b) => a + b, 0);
console.log(`Built dist/ — ${(bytes / 1024).toFixed(1)} KiB HTML/CSS/JS, no runtime dependencies.`);
