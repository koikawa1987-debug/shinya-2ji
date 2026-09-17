#!/usr/bin/env node
// portraits/incoming/<id>.b64 を画像に戻して docs/portraits に置く。
//
//   node generator/decode-portrait.js h039
//
// ブラウザのダウンロードが使えない環境用の経路。生成ページで縮めて
// base64 にした画像を、そのまま文字列として受け取って戻す。

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, DOCS_DIR, syncDocsData } from './lib/paths.js';

const id = process.argv[2];
if (!/^h\d{3}$/.test(id ?? '')) {
  console.error('使い方: node generator/decode-portrait.js h039');
  process.exit(1);
}

const src = path.join(ROOT, 'portraits', 'incoming', `${id}.b64`);
if (!fs.existsSync(src)) {
  console.error(`NG ${id}: ${path.relative(ROOT, src)} がありません`);
  process.exit(2);
}

const raw = fs.readFileSync(src, 'utf8').trim();
const m = /^data:image\/(webp|jpeg|png);base64,([\s\S]+)$/.exec(raw);
const 拡張 = m ? { webp: 'webp', jpeg: 'jpg', png: 'png' }[m[1]] : 'webp';
const buf = Buffer.from(m ? m[2].replace(/\s+/g, '') : raw.replace(/\s+/g, ''), 'base64');

// 頭の数バイトで形式を確かめる。切れた文字列を画像として置かないため
const ok =
  (拡張 === 'webp' && buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') ||
  (拡張 === 'jpg' && buf[0] === 0xff && buf[1] === 0xd8) ||
  (拡張 === 'png' && buf[1] === 0x50 && buf[2] === 0x4e);
if (!ok || buf.length < 1500) {
  console.error(`NG ${id}: 画像として読めません（${buf.length} バイト）`);
  process.exit(3);
}

const dir = path.join(DOCS_DIR, 'portraits');
for (const f of fs.readdirSync(dir)) {
  if (path.parse(f).name === id) fs.rmSync(path.join(dir, f));
}
fs.writeFileSync(path.join(dir, `${id}.${拡張}`), buf);

const done = path.join(ROOT, 'portraits', 'done.txt');
const ids = fs.existsSync(done) ? fs.readFileSync(done, 'utf8').split(/\r?\n/).filter(Boolean) : [];
if (!ids.includes(id)) fs.appendFileSync(done, `${id}\n`);

fs.rmSync(src);
syncDocsData();
console.log(`OK ${id}  ${Math.round(buf.length / 1024)}KB  (done: ${ids.includes(id) ? ids.length : ids.length + 1})`);
