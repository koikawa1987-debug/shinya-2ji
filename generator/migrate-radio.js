#!/usr/bin/env node
// 一度きりの改造。テレビ1波だった局に、人物マスタとラジオの波を足す。
// station.json を書き換えたあと、--write-seed で同梱の開局データにも反映する。

import path from 'node:path';
import { STATION_FILE, ROOT, readJSON, writeJSON, exists, syncDocsData } from './lib/paths.js';
import { TV, RADIO } from './lib/config.js';
import { validateCM } from './lib/schema.js';

const LIB = path.join(ROOT, 'generator', 'lib');
const SEED_STATION = path.join(LIB, 'seed-station.json');

const args = process.argv.slice(2);
const writeSeed = args.includes('--write-seed');

function migrate(station) {
  const people = readJSON(path.join(LIB, 'seed-people.json'));
  const radio = readJSON(path.join(LIB, 'seed-radio.json'));

  // 1. 波を立てる。ラジオは開局時から免許はあったが、人手が足りず停波していた。
  station.波 = [
    {
      id: 'tv',
      名称: TV,
      コールサイン: 'JOZZ-DTV',
      開局日: station.開局日,
      備考: '開局と同時に放送開始。局の売上のほとんどはこちらから出ている。',
    },
    {
      id: 'radio',
      名称: RADIO,
      コールサイン: 'JOZZ-FM',
      周波数: '78.4MHz',
      開局日: radio.開始日,
      備考: '免許は開局時からあったが、人手が足りず停波していた。八月十日の定例で立ち上げが決まった。',
    },
  ];

  // 2. 既存の番組と素材はすべてテレビ
  for (const p of station.番組) p.媒体 ??= TV;
  for (const c of station.CM素材) c.媒体 ??= TV;
  for (const s of station.スポンサー) s.出稿方針.媒体 ??= [TV];

  // ラジオにも出す既存スポンサー。ジャンルがラジオ側にもある会社だけ広げる
  for (const id of ['s001', 's002', 's005', 's006']) {
    const s = station.スポンサー.find((x) => x.id === id);
    if (s && !s.出稿方針.媒体.includes(RADIO)) s.出稿方針.媒体.push(RADIO);
  }

  // 3. ラジオの番組
  const 既存id = new Set(station.番組.map((p) => p.id));
  for (const p of radio.番組) {
    if (既存id.has(p.id)) continue;
    station.番組.push({
      ...p,
      媒体: RADIO,
      開始日: radio.開始日,
      終了日: null,
      視聴率履歴: [],
      ステータス: '放送中',
      提供スポンサーid: [],
      看板: false,
    });
  }

  // 4. ラジオのスポンサーと素材
  for (const s of radio.スポンサー) {
    if (station.スポンサー.some((x) => x.id === s.id)) continue;
    station.スポンサー.push({ ...s, 提供番組id: [] });
  }
  for (const 種 of radio.CM素材) {
    if (station.CM素材.some((c) => c.略号 === 種.略号)) continue;
    const errs = validateCM(種, {
      スポンサーid一覧: station.スポンサー.map((s) => s.id),
      略号一覧: station.CM素材.map((c) => c.略号),
    });
    if (errs.length) throw new Error(`ラジオCM「${種.商品名}」が条件を満たしていません: ${errs.join(' / ')}`);
    station.CM素材.push({
      id: `c${String(station.CM素材.length + 1).padStart(3, '0')}`,
      新在: '新',
      ...種,
    });
  }

  // 5. 人物マスタ
  station.人物 = people;

  // 6. 提供関係を出稿方針から結び直す（媒体とジャンルの両方が合うこと）
  for (const s of station.スポンサー) {
    const 対象 = station.番組.filter(
      (p) =>
        p.ステータス === '放送中' &&
        (s.出稿方針.媒体 ?? [TV]).includes(p.媒体) &&
        (s.出稿方針.ジャンル ?? []).includes(p.ジャンル),
    );
    s.提供番組id = 対象.map((p) => p.id);
  }
  for (const p of station.番組) {
    p.提供スポンサーid = station.スポンサー.filter((s) => s.提供番組id.includes(p.id)).map((s) => s.id);
  }

  // 7. 人物と番組を双方向に結ぶ。出演者名から引けなかったものは担当番組idを信じる
  const byName = new Map(station.人物.map((h) => [h.氏名, h]));
  for (const h of station.人物) h.担当番組id = [...new Set(h.担当番組id ?? [])];
  for (const p of station.番組) {
    for (const 名 of p.出演者 ?? []) {
      // 「語り・唐木田 節」「選盤・網代 ふゆ」のような肩書つきの表記に対応する
      const 素 = String(名).split('・').pop().trim();
      const h = byName.get(素) ?? byName.get(名);
      if (h && !h.担当番組id.includes(p.id)) h.担当番組id.push(p.id);
    }
  }
  for (const h of station.人物) {
    h.担当番組id.sort();
    h.出演本数 = h.担当番組id.length;
  }

  station.改編履歴.push({
    日付: radio.開始日,
    種別: 'ラジオ再開',
    概要: `JOZZ-FM 78.4MHz を停波から立ち上げ。${radio.番組.length}番組・新規2社で放送開始。`,
  });

  return station;
}

const station = migrate(readJSON(STATION_FILE));
writeJSON(STATION_FILE, station);

const 数 = (媒体) => station.番組.filter((p) => p.媒体 === 媒体 && p.ステータス === '放送中').length;
console.log(
  `✓ テレビ ${数(TV)}番組 ／ ラジオ ${数(RADIO)}番組 ／ ` +
    `人物 ${station.人物.length}名 ／ スポンサー ${station.スポンサー.length}社 ／ CM素材 ${station.CM素材.length}本`,
);

if (writeSeed) {
  // 同梱の開局データにも同じ形を反映する。数字の履歴は落として種に戻す。
  const seed = JSON.parse(JSON.stringify(station));
  for (const p of seed.番組) p.視聴率履歴 = [];
  writeJSON(SEED_STATION, seed);
  console.log('✓ generator/lib/seed-station.json を更新しました');
}

syncDocsData();
