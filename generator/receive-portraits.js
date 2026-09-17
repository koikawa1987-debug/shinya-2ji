#!/usr/bin/env node
// 似顔絵の受け口。生成ページから画像を直接受け取り、
// Downloads\shinya_<id>.jpg として置く（あとは place-named.ps1 が拾う）。
//
//   node generator/receive-portraits.js
//
// ブラウザのダウンロード機能を経由しないための仕掛け。生成ページ側で
// 画像を縮めて base64 にし、このアドレスへ移動するだけで保存できる。
// 127.0.0.1 にしか開かず、受け付けるのは id が h000 形式で中身が JPEG のものだけ。

import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PORT = Number(process.env.PORT ?? 4650);
const OUT = path.join(os.homedir(), 'Downloads');

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? '/', `http://127.0.0.1:${PORT}`);
    if (url.pathname !== '/save') {
      res.writeHead(404).end('not found');
      return;
    }
    const id = url.searchParams.get('id') ?? '';
    const d = (url.searchParams.get('d') ?? '').replace(/^data:image\/jpeg;base64,/, '');
    if (!/^h\d{3}$/.test(id)) {
      res.writeHead(400).end('bad id');
      return;
    }
    const buf = Buffer.from(d, 'base64');
    // JPEG の頭（FF D8）と尻（FF D9）を確かめる。途中で切れた送信を置かない
    if (buf.length < 2000 || buf[0] !== 0xff || buf[1] !== 0xd8 || buf.at(-2) !== 0xff || buf.at(-1) !== 0xd9) {
      res.writeHead(400).end(`bad image (${buf.length} bytes)`);
      return;
    }
    const file = path.join(OUT, `shinya_${id}.jpg`);
    fs.writeFileSync(file, buf);
    console.log(`${new Date().toISOString()} saved ${id} ${buf.length} bytes`);
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(`<title>saved ${id}</title><p id="ok">saved ${id} ${buf.length}</p>`);
  })
  .listen(PORT, '127.0.0.1', () => console.log(`receiver on http://127.0.0.1:${PORT}/save`));
