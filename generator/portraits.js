#!/usr/bin/env node
// 人物に外見を与え、似顔絵を描かせるためのプロンプトを書き出す。
//
//   node generator/portraits.js            プロンプトを portraits/prompts.md に書き出す
//   node generator/portraits.js --apply    外見を station.json に取り込む（--write-seed で種にも）
//
// 画像は docs/portraits/<id>.webp に置く。置いた時点で名鑑と人物面に出る。
// ファイルが無い人は何も出ない（欠けても紙面が崩れない）。

import fs from 'node:fs';
import path from 'node:path';
import { STATION_FILE, DOCS_DIR, ROOT, readJSON, writeJSON, syncDocsData } from './lib/paths.js';

const LIB = path.join(ROOT, 'generator', 'lib');
const OUT_DIR = path.join(ROOT, 'portraits');
const apply = process.argv.includes('--apply');
const writeSeed = process.argv.includes('--write-seed');

const station = readJSON(STATION_FILE);
const 外見表 = readJSON(path.join(LIB, 'seed-appearance.json'));

/* ---------- 外見を取り込む ---------- */

if (apply) {
  let n = 0;
  for (const h of station.人物) {
    const a = 外見表[h.id];
    if (!a) continue;
    h.外見 = a;
    n += 1;
  }
  writeJSON(STATION_FILE, station);
  console.log(`✓ ${n}名に外見を設定しました`);

  if (writeSeed) {
    const SEED = path.join(LIB, 'seed-station.json');
    const seed = readJSON(SEED);
    for (const h of seed.人物) if (外見表[h.id]) h.外見 = 外見表[h.id];
    writeJSON(SEED, seed);
    console.log('✓ seed-station.json を更新しました');
  }
  syncDocsData();
}

/* ---------- プロンプトを書き出す ---------- */

// 紙面が新聞なので、似顔絵ではなく「新聞に刷られた顔写真」に寄せる。
// 網点とインクのにじみを指定して、他の要素（明朝・ヘアライン・単色）と衝突させない。
const 共通 = [
  'black and white newspaper press photograph, 1980s Japanese regional newspaper staff portrait',
  'head and shoulders, centered, facing camera, neutral expression, no smile',
  'plain light gray seamless studio background, soft frontal light, gentle shadow on one side',
  'visible coarse halftone dot texture, slight ink bleed and dot gain of cheap newsprint',
  'slightly blown highlights, muted grays, no pure black',
  'documentary realism, not illustration, not anime, not painting',
  'no text, no captions, no logos, no watermark, no border, no frame',
  'square crop',
].join(', ');

const 否定 = [
  'color, saturated colors, glamour retouching, smooth skin, beauty filter',
  'anime, manga, illustration, 3d render, cgi, painting, sketch',
  'text, letters, japanese characters, captions, watermark, signature, logo',
  'multiple people, full body, hands near face, dramatic lighting, bokeh background',
  'modern digital photo look, high dynamic range, sharp clinical detail',
].join(', ');

// 年代・性別・肩書は絵の骨格を決めるので英語でも渡す。
// 細部だけ日本語にすると、生成器によって解釈が割れて絵柄が揃わない。
const 年代英 = {
  二十代前半: 'in their early 20s', 二十代半ば: 'in their mid 20s', 二十代後半: 'in their late 20s',
  三十代前半: 'in their early 30s', 三十代後半: 'in their late 30s',
  四十代前半: 'in their early 40s', 四十代半ば: 'in their mid 40s', 四十代後半: 'in their late 40s',
  五十代前半: 'in their early 50s', 五十代後半: 'in their late 50s',
  六十代前半: 'in their early 60s', 六十代半ば: 'in their mid 60s',
  七十代前半: 'in their early 70s',
};

const 肩書英 = {
  編成部長: 'programming director', 編成部: 'programming department clerk',
  営業部長: 'advertising sales director', 営業: 'advertising sales representative',
  営業事務: 'sales office administrator',
  'アナウンサー': 'television news announcer', 看板アナウンサー: 'veteran lead announcer',
  'アナウンサー（研修中）': 'trainee announcer', 記者: 'field news reporter', 報道デスク: 'news desk editor',
  '制作／語り': 'documentary producer and narrator', '技術／受付': 'broadcast engineer',
  '送出（夜勤）': 'master control operator on night shift', '送出（日勤）': 'master control operator',
  音声: 'sound engineer', カメラ: 'television cameraman', 照明: 'lighting technician',
  '美術・大道具': 'set carpenter', 編集: 'video editor', 考査: 'broadcast standards reviewer',
  経理: 'accountant', '総務・受付': 'front desk receptionist', 制作進行: 'production assistant',
  ラジオ技術: 'radio transmitter engineer', 夜間警備: 'night security guard', アルバイト: 'student part-timer',
  実演販売: 'in-studio product demonstrator', アシスタント: 'programme assistant',
  '選盤・進行': 'record librarian and presenter', 選盤: 'record librarian',
  出演: 'late-night television personality', 俳優: 'stage actor',
  落語家: 'rakugo storyteller in kimono', 映画解説: 'film commentator',
  交通情報: 'radio traffic reporter', パーソナリティ: 'radio host',
  通販進行: 'radio shopping programme host', 朗読: 'radio reader', 司書: 'public librarian',
  講師: 'language lecturer',
};

function 英語の主語(h) {
  const 性 = /女性/.test(h.外見 ?? '') ? 'woman' : /男性/.test(h.外見 ?? '') ? 'man' : 'person';
  const 齢 = 年代英[h.年代] ?? '';
  const 役 = 肩書英[h.肩書] ?? 'local television station employee';
  return `a Japanese ${性} ${齢}, ${役} at a small regional broadcaster`.replace(/\s+/g, ' ');
}

/** 人物から場面の手がかりを引く。道具と癖が絵の芯になる */
function 手がかり(h) {
  const 素 = [];
  if (h.外見) 素.push(h.外見);
  if (h.肩書) 素.push(`肩書は${h.肩書}（${h.部署 ?? '外部'}）`);
  if (h.道具) 素.push(`持ち物：${h.道具}`);
  if (h.癖) 素.push(`癖：${h.癖}`);
  return 素;
}

const 行 = [];
行.push('# 深夜二時 ／ 人物の似顔絵プロンプト');
行.push('');
行.push('`node generator/portraits.js` で書き出したもの。人物の外見・肩書・道具・癖から組み立てている。');
行.push('');
行.push('## 使い方');
行.push('');
行.push('1. 各人のプロンプトを画像生成にかける（1:1・正方形）');
行.push('2. 出てきた画像を **`docs/portraits/<id>.webp`** として保存する（例：`docs/portraits/h051.webp`）');
行.push('3. `npm run sync` を走らせてコミットする');
行.push('');
行.push('置いた人から順に、名鑑と人物面に顔写真が出る。置いていない人は何も出ない。');
行.push('紙面が単色なので、**カラーで作らず白黒で作ること**。網点の粗さが他の要素と釣り合う。');
行.push('');
行.push('## 全員に共通する指定');
行.push('');
行.push('```');
行.push(共通);
行.push('```');
行.push('');
行.push('### ネガティブ（対応する生成器なら）');
行.push('');
行.push('```');
行.push(否定);
行.push('```');
行.push('');

const 部署順 = ['編成部', '報道部', '制作部', '技術部', '営業部', '総務部', '外部'];
const 並び = [...station.人物].sort(
  (a, b) =>
    部署順.indexOf(a.部署 ?? '外部') - 部署順.indexOf(b.部署 ?? '外部') || a.id.localeCompare(b.id),
);

let 現部署 = null;
for (const h of 並び) {
  const 部 = h.部署 ?? '外部';
  if (部 !== 現部署) {
    現部署 = 部;
    行.push(`## ${部}`);
    行.push('');
  }
  行.push(`### ${h.氏名}（${h.よみ}）— \`docs/portraits/${h.id}.webp\``);
  行.push('');
  for (const s of 手がかり(h)) 行.push(`- ${s}`);
  行.push('');
  行.push('```');
  行.push(`Subject: ${英語の主語(h)}. ${共通}.`);
  行.push(`（細部：${h.外見 ?? 外見表[h.id] ?? ''}${h.道具 ? ` 傍らに置くもの：${h.道具}` : ''}）`);
  行.push('```');
  行.push('');
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const out = path.join(OUT_DIR, 'prompts.md');
fs.writeFileSync(out, 行.join('\n'), 'utf8');

// 画像の置き場所は先に作っておく
const 置き場 = path.join(DOCS_DIR, 'portraits');
fs.mkdirSync(置き場, { recursive: true });
const ある = fs.readdirSync(置き場).filter((f) => /\.(webp|png|jpg|jpeg)$/i.test(f));

console.log(`✓ ${path.relative(ROOT, out)} に ${station.人物.length}名ぶんのプロンプトを書き出しました`);
console.log(`  画像の置き場所: docs/portraits/（いま ${ある.length} 枚）`);
