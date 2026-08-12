#!/usr/bin/env node
// ローカル確認用の静的サーバ。GitHub Pages と同じく /docs をそのまま配る。
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { DOCS_DIR } from './lib/paths.js';

const PORT = Number(process.env.PORT ?? 4649);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let file = path.join(DOCS_DIR, url === '/' ? 'index.html' : url.replace(/^\/+/, ''));
    if (!file.startsWith(DOCS_DIR)) {
      res.writeHead(403).end('forbidden');
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('404');
      return;
    }
    res.writeHead(200, {
      'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`http://localhost:${PORT}/`));
