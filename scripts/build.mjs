import { mkdir, rm, cp, readFile, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';

// Pages caches each URL separately. Keep the document, styling and application
// together so returning visitors cannot load a mixture of two design releases.
const [template, css, application] = await Promise.all([
  readFile('index.html', 'utf8'),
  readFile('src/style.css', 'utf8'),
  build({ entryPoints: ['src/app.js'], bundle: true, write: false, format: 'iife',
    target: 'es2020', charset: 'utf8', minify: true, legalComments: 'inline' }),
]);
const stylesheet = '<link rel="stylesheet" href="./src/style.css">';
const script = '<script type="module" src="./src/app.js"></script>';
if (!template.includes(stylesheet) || !template.includes(script)) {
  throw new Error('Build entry tags are missing from index.html');
}
const html = template
  .replace(stylesheet, () => `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`)
  .replace(script, () => `<script>${application.outputFiles[0].text.replace(/<\/script/gi, '<\\/script')}</script>`);

await rm('dist', { recursive: true, force: true });
await mkdir('dist');
await writeFile('dist/index.html', html);
await cp('favicon.svg', 'dist/favicon.svg');
// Preserve the old module URLs for browsers that still hold an earlier document.
await cp('src', 'dist/src', { recursive: true });
console.log(`Built self-contained page: dist/index.html (${Buffer.byteLength(html)} bytes)`);
