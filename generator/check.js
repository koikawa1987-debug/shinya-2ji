#!/usr/bin/env node
// 手元で通す点検。API を叩かず、いま持っているデータが制約を満たしているか見るだけ。

import fs from 'node:fs';
import path from 'node:path';
import { STATION_FILE, DAYS_DIR, readJSON, exists } from './lib/paths.js';
import { validateCM, validate回, ナレーション上限 } from './lib/schema.js';
import { toMinutes } from './lib/time.js';
import { DAY_START_MIN, DAY_END_MIN } from './lib/config.js';

let ng = 0;
const ok = (msg) => console.log(`  ok   ${msg}`);
const bad = (msg) => {
  ng += 1;
  console.log(`  NG   ${msg}`);
};

if (!exists(STATION_FILE)) {
  console.error('station.json がありません。npm run bootstrap を先に。');
  process.exit(1);
}
const station = readJSON(STATION_FILE);

console.log('■ CM素材');
for (const c of station.CM素材) {
  const errs = validateCM(c, {
    スポンサーid一覧: station.スポンサー.map((s) => s.id),
    略号一覧: station.CM素材.filter((x) => x.id !== c.id).map((x) => x.略号),
  });
  const 字 = [...String(c.ナレーション全文).replace(/[\s、。「」『』・…—-]/g, '')].length;
  if (errs.length) bad(`${c.略号} ${c.商品名} → ${errs.join(' / ')}`);
  else ok(`${c.略号} ${c.商品名}（${c.尺}秒／ナレ ${字}字・上限 ${ナレーション上限(c.尺)}字）`);
}

console.log('■ 番組');
for (const p of station.番組) {
  const s = toMinutes(p.枠.開始時刻);
  if (s < DAY_START_MIN || s + p.枠.尺 > DAY_END_MIN) bad(`${p.タイトル} が放送日の範囲外`);
}
const 看板 = station.番組.filter((p) => p.看板).length;
if (看板 === 0) bad('局の看板が1本もない');
else ok(`${station.番組.length}本（放送中 ${station.番組.filter((p) => p.ステータス === '放送中').length}／看板 ${看板}）`);

console.log('■ 日次データ');
const days = exists(DAYS_DIR) ? fs.readdirSync(DAYS_DIR).filter((f) => f.endsWith('.json')) : [];
const 番組id一覧 = station.番組.map((p) => p.id);
const 素材id一覧 = new Set(station.CM素材.map((c) => c.id));
for (const f of days) {
  const day = readJSON(path.join(DAYS_DIR, f));
  const errs = validate回(
    day.編成.filter((r) => r.種別 === '番組'),
    番組id一覧,
  );

  // 時間軸に穴と重なりがないこと（オンエア線が迷子にならない条件）
  let cursor = DAY_START_MIN;
  for (const r of day.編成) {
    if (r.種別 === 'CM') continue;
    const s = toMinutes(r.開始時刻);
    if (s !== cursor) errs.push(`${r.開始時刻} で時間軸が飛んでいる（想定 ${cursor}分）`);
    cursor = s + r.尺;
  }
  if (cursor !== DAY_END_MIN) errs.push(`終端が ${cursor}分（想定 ${DAY_END_MIN}分）`);

  for (const r of day.編成) {
    const ids = r.種別 === 'CM' ? r['素材id[]'] : (r.PT?.['素材id[]'] ?? []);
    for (const id of ids ?? []) if (!素材id一覧.has(id)) errs.push(`存在しない素材id ${id}`);
    if (r.種別 === 'CM' && !['SB', 'PT'].includes(r['SB/PT'])) errs.push('SB/PT が不正');
  }

  if (errs.length) bad(`${day.日付} → ${errs.join(' / ')}`);
  else ok(`${day.日付}（${day.曜日}）番組 ${day.編成.filter((r) => r.種別 === '番組').length}／CM ${day.編成.filter((r) => r.種別 === 'CM').length}`);
}

console.log(ng ? `\n${ng} 件が引っかかりました。` : '\nすべて通りました。');
process.exit(ng ? 1 : 0);
