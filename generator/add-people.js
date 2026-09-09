#!/usr/bin/env node
// seed-staff2.json の人物を station に足し、既存の記述との食い違いを直す。
// 看板アナが入ったので「局で唯一のアナウンサー」だった宇治原の記述を改める。

import path from 'node:path';
import { STATION_FILE, ROOT, readJSON, writeJSON, syncDocsData } from './lib/paths.js';

const LIB = path.join(ROOT, 'generator', 'lib');
const writeSeed = process.argv.includes('--write-seed');

const 訂正 = {
  h006: {
    経歴:
      '報道の原稿を読むのは局でこの人ひとり。開局にあたって百二十人の応募から採られた。前職は駅の案内放送。',
    局との関係:
      'テレビの朝昼夕とラジオのニュース、一日五本を一人で回している。原稿は自分で書き足す。看板アナの神無月はニュースを読まないため、報道の負担は開局から変わっていない。',
  },
  h024: {
    局との関係:
      '看板番組の中心。台本を前半しか書かない構成を通した本人で、後半で詰まるのも本人。神無月が入ってからは、詰まったところを拾ってもらえるようになった。',
  },
  h032: {
    局との関係:
      '夜の音楽枠の後半を持つ。二十二時に御手洗から枠を受け取るが、引き継ぎで言葉を交わさない取り決めになっている。しゃべりの量を回ごとに変えていて、局はそれを止めていない。',
  },
};

const station = readJSON(STATION_FILE);
const 追加 = readJSON(path.join(LIB, 'seed-staff2.json'));
const byId = new Map(station.人物.map((h) => [h.id, h]));

for (const [id, patch] of Object.entries(訂正)) {
  const h = byId.get(id);
  if (h) Object.assign(h, patch);
  else console.warn(`人物 ${id} が見つかりません`);
}

let 足した = 0;
for (const p of 追加) {
  if (byId.has(p.id)) continue;
  station.人物.push(p);
  byId.set(p.id, p);
  足した += 1;
}

// 担当番組を番組側の出演者にも反映する（名鑑と番組表で食い違わないように）
for (const p of 追加) {
  for (const pid of p.担当番組id ?? []) {
    const prog = station.番組.find((x) => x.id === pid);
    if (!prog) continue;
    prog.出演者 = prog.出演者 ?? [];
    if (!prog.出演者.includes(p.氏名)) prog.出演者.push(p.氏名);
  }
}

// 関係は実在する人物だけに絞る
const ids = new Set(station.人物.map((h) => h.id));
for (const h of station.人物) h.関係 = (h.関係 ?? []).filter((r) => ids.has(r.id) && r.id !== h.id);

writeJSON(STATION_FILE, station);

const 部署別 = {};
for (const h of station.人物) 部署別[h.部署 ?? '未設定'] = (部署別[h.部署 ?? '未設定'] ?? 0) + 1;
console.log(`✓ 人物 ${station.人物.length}名（${足した}名を追加、${Object.keys(訂正).length}名の記述を訂正）`);
console.log('  ' + Object.entries(部署別).map(([k, v]) => `${k} ${v}`).join(' ／ '));

if (writeSeed) {
  const SEED = path.join(LIB, 'seed-station.json');
  const seed = readJSON(SEED);
  seed.人物 = JSON.parse(JSON.stringify(station.人物));
  for (const p of 追加) {
    for (const pid of p.担当番組id ?? []) {
      const prog = seed.番組.find((x) => x.id === pid);
      if (prog && !(prog.出演者 ?? []).includes(p.氏名)) (prog.出演者 ??= []).push(p.氏名);
    }
  }
  writeJSON(SEED, seed);
  console.log('✓ seed-station.json を更新しました');
}

syncDocsData();
