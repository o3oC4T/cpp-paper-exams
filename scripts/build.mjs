import { mkdir, rm, cp } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const file of ['index.html', 'favicon.svg', 'src']) await cp(file, `dist/${file}`, { recursive: true });
console.log('Built static site: dist/');
