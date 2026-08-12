#!/usr/bin/env node
// 開局処理。data/station.json が無いときだけ走る。
// 番組12〜16本・スポンサー6社・CM素材4本・開局の編成会議議事録1本を生成する。

import path from 'node:path';
import {
  STATION_FILE,
  MEETINGS_DIR,
  readJSON,
  writeJSON,
  exists,
  syncDocsData,
  ROOT,
} from './lib/paths.js';
import { currentBroadcastDate, addDays } from './lib/time.js';
import { askJSON } from './lib/anthropic.js';
import { 世界観ルール } from './lib/prompts.js';
import { 新CM生成 } from './lib/cm.js';

const SEED_FILE = path.join(ROOT, 'generator', 'lib', 'seed-station.json');

const 開局プロンプト = (開局日) => `${開局日} に開局する独立局「深夜二時」の編成表をつくってください。

## つくるもの
- 番組を16本。深夜帯（23:00〜27:00）に厚く配分し、朝夕は通販とニュースで薄くする。
  23時台は曜日別の単発枠、24時以降は帯番組にすること。26:00 の枠を「局の看板」にする。
- スポンサーを6社。予算規模は 大1・中3・小2 のバランスで。
- 放送休止（カラーバー）の時間が1日に何か所か残る編成にする。経営が苦しい局なので、そこを無理に埋めない。

## 時刻の書き方
放送日は 05:00 から 28:59 まで。深夜1時は 25:00、深夜2時は 26:00 と書く。
番組どうしの枠が重ならないようにし、開始時刻＋尺が次の番組の開始時刻を越えないこと。

## 出力
次の形の JSON だけを返してください。説明文を書かないこと。
{
  "番組": [{
    "タイトル": "...", "ジャンル": "...",
    "枠": {"曜日": ["月","火"], "開始時刻": "23:00", "尺": 60},
    "出演者": ["..."], "番組概要": "80字程度", "看板": false
  }],
  "スポンサー": [{
    "社名": "...", "業種": "...",
    "出稿方針": {"時間帯": ["深夜"], "ジャンル": ["ドラマ"], "備考": "..."},
    "予算規模": "中"
  }]
}
時間帯は 早朝・午前・午後・夕方・夜・深夜・未明 から選ぶ。`;

const 開局議事録プロンプト = (station) => `開局にあたっての編成会議の議事録を書いてください。

## 決まった編成
${station.番組.map((p) => `- ${p.枠.曜日.join('')} ${p.枠.開始時刻} ${p.タイトル}（${p.ジャンル}／${p.枠.尺}分）`).join('\n')}

## ついたスポンサー
${station.スポンサー.map((s) => `- ${s.社名}（${s.業種}／予算${s.予算規模}）`).join('\n')}

500〜800字。編成部の会議録の体裁で。発言者は役職＋姓（架空）。
開局にこぎつけるまでに何を諦めたか、深夜帯に寄せた理由、
昼間の枠が通販で埋まっていることへの各人の温度差が読める文章にすること。
結論に至るまでの筋が通っていること。出力は議事録の本文だけ。`;

export async function bootstrap({ 開局日 = currentBroadcastDate() } = {}) {
  if (exists(STATION_FILE)) {
    console.log('station.json はすでにあります。開局処理は行いません。');
    return readJSON(STATION_FILE);
  }

  // API キーが無い環境では同梱の開局データを使う（サイトが必ず立ち上がるようにするため）
  if (!process.env.ANTHROPIC_API_KEY && exists(SEED_FILE)) {
    console.log('ANTHROPIC_API_KEY が無いので、同梱の開局データで station.json をつくります。');
    const seed = readJSON(SEED_FILE);
    writeJSON(STATION_FILE, seed);
    syncDocsData();
    return seed;
  }

  console.log(`■ ${開局日} 開局。編成表をつくります`);
  const 骨子 = await askJSON({
    system: 世界観ルール,
    prompt: 開局プロンプト(開局日),
    maxTokens: 12000,
  });

  const station = {
    局名: '深夜二時',
    コールサイン: 'JOZZ-DTV',
    開局日,
    局のキャラクター: '深夜帯だけが異様に充実した、経営が不安な独立局',
    番組: 骨子.番組.map((p, i) => ({
      id: `p${String(i + 1).padStart(3, '0')}`,
      タイトル: p.タイトル,
      ジャンル: p.ジャンル,
      枠: p.枠,
      出演者: p.出演者 ?? [],
      番組概要: p.番組概要,
      開始日: 開局日,
      終了日: null,
      視聴率履歴: [],
      ステータス: '放送中',
      提供スポンサーid: [],
      看板: Boolean(p.看板),
    })),
    スポンサー: 骨子.スポンサー.map((s, i) => ({
      id: `s${String(i + 1).padStart(3, '0')}`,
      社名: s.社名,
      業種: s.業種,
      出稿方針: s.出稿方針,
      予算規模: s.予算規模,
      提供番組id: [],
      初出稿日: 開局日,
    })),
    CM素材: [],
    改編履歴: [{ 日付: 開局日, 種別: '開局', 概要: `${骨子.番組.length}番組・${骨子.スポンサー.length}社で開局` }],
  };

  // 提供関係を出稿方針から機械的に結ぶ
  for (const s of station.スポンサー) {
    const 対象 = station.番組.filter((p) => (s.出稿方針?.ジャンル ?? []).includes(p.ジャンル));
    s.提供番組id = 対象.map((p) => p.id);
    for (const p of 対象) p.提供スポンサーid.push(s.id);
  }

  // CM素材4本
  for (let i = 0; i < 4; i++) {
    const cm = await 新CM生成(station, 開局日);
    cm.新在 = i >= 2 ? '新' : '在';
    station.CM素材.push(cm);
    console.log(`  素材 ${cm.略号}「${cm.商品名}」`);
  }

  writeJSON(STATION_FILE, station);

  // 開局の議事録
  const 議事録 = await askJSON({
    system: 世界観ルール,
    prompt: 開局議事録プロンプト(station) + '\n\n出力は {"議事録": "..."} の JSON で。',
    maxTokens: 4000,
  });
  writeJSON(path.join(MEETINGS_DIR, `${開局日}.json`), {
    日付: 開局日,
    種別: '開局',
    大改編: false,
    打ち切り: [],
    新番組: station.番組.map((p) => ({ 番組id: p.id, タイトル: p.タイトル })),
    新規スポンサー: station.スポンサー.map((s) => ({ id: s.id, 社名: s.社名 })),
    議事録: 議事録.議事録,
  });

  syncDocsData();
  console.log('✓ 開局しました');
  return station;
}

const { pathToFileURL } = await import('node:url');
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  bootstrap().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
