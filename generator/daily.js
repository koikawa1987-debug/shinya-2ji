#!/usr/bin/env node
// 毎朝 05:00 JST。編成のロジックはコードで決定論的に処理し、
// LLM に投げるのは創作部分（その日の回・新しいCM素材）だけ。

import { STATION_FILE, DAYS_DIR, readJSON, writeJSON, exists, syncDocsData } from './lib/paths.js';
import { currentBroadcastDate, weekdayOf, toHHMM, toMinutes, addDays } from './lib/time.js';
import { buildSkeleton, placeCommercials, 媒体of } from './lib/schedule.js';
import { simulateRating, 率の名前 } from './lib/ratings.js';
import { askJSON } from './lib/anthropic.js';
import { 世界観ルール, 回生成プロンプト } from './lib/prompts.js';
import { validate回, validateCM, retrying } from './lib/schema.js';
import { 新CM生成, 新在の更新, 今日つくる媒体, 素材に仕立てる } from './lib/cm.js';
import { composeEpisodes, composeMemo } from './lib/compose.js';
import { composeCM } from './lib/compose-cm.js';
import { TV, RADIO } from './lib/config.js';
import { bootstrap } from './bootstrap.js';
import path from 'node:path';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const 日付 = opt('date') ?? currentBroadcastDate();
const force = flag('force');
// --seed <file> を渡すと、その日の「回」を LLM ではなくファイルから読む。
// API キーなしで開局初日の紙面を組み直すための逃げ道。
const seedFile = opt('seed');
const 新CMなし = flag('no-new-cm');
// 既定は API を使わない作文器。--llm（または USE_LLM=1）のときだけ Claude を叩く。
// 無料で毎朝回すための既定値であって、質を捨てているわけではない。
const useLLM = flag('llm') || process.env.USE_LLM === '1';

async function main() {
  if (!exists(STATION_FILE)) {
    console.log('station.json がないので開局処理から始めます。');
    await bootstrap();
  }
  const station = readJSON(STATION_FILE);

  const outFile = path.join(DAYS_DIR, `${日付}.json`);
  if (exists(outFile) && !force) {
    console.log(`${日付} は生成済みです（--force で作り直し）。`);
    syncDocsData();
    return;
  }

  const 曜日 = weekdayOf(日付);
  console.log(`■ ${日付}（${曜日}）の編成をつくります`);

  // 2. 骨格（決定論）。テレビとラジオを別々に組む
  const { rows, conflicts } = buildSkeleton(station, 日付, TV);
  const { rows: radioRows, conflicts: radioConflicts } = buildSkeleton(station, 日付, RADIO);
  const 全conflicts = [...conflicts, ...radioConflicts];
  if (全conflicts.length) console.warn(`枠が重複したため落とした番組: ${全conflicts.join(', ')}`);

  const programById = new Map(station.番組.map((p) => [p.id, p]));
  const 番組行 = [...rows, ...radioRows].filter((r) => r.種別 === '番組');

  // 3. LLM 呼び出し①：その日の各番組の回（2波ぶんまとめて1回で聞く）
  const 直近 = await 直近3回(日付);
  const 番組リスト = 番組行
    .map((r) => {
      const p = programById.get(r.番組id);
      const past = (直近.get(p.id) ?? []).map((x) => `    - ${x.日付} ${x.サブタイトル}／${x.今回の内容}`);
      return [
        `- 番組id: ${p.id}`,
        `  媒体: ${媒体of(p)}`,
        `  タイトル: ${p.タイトル}（${p.ジャンル}）`,
        `  放送時刻: ${r.開始時刻} から ${r.尺}分`,
        `  出演者: ${(p.出演者 ?? []).join('、') || 'なし'}`,
        `  番組概要: ${p.番組概要}`,
        past.length ? `  直近の回:\n${past.join('\n')}` : '  直近の回: （今回が初回）',
      ].join('\n');
    })
    .join('\n');

  let 回結果;
  if (seedFile) {
    回結果 = readJSON(path.isAbsolute(seedFile) ? seedFile : path.resolve(process.cwd(), seedFile));
    // seed は書いた時点の編成しか知らない。あとから編成会議で入った番組は作文器で補う
    const 済み = new Set(回結果.回.map((r) => r.番組id));
    const 不足 = 番組行.filter((r) => !済み.has(r.番組id));
    if (不足.length) {
      回結果.回.push(...composeEpisodes(station, 日付, 曜日, 不足));
      console.log(`seed に無い ${不足.length} 番組を作文器で補いました`);
    }
  } else if (useLLM) {
    回結果 = await retrying('回生成', 3, async (_i, prev) => {
      const value = await askJSON({
        system: `${世界観ルール}\n\n局の説明: ${station.局のキャラクター}`,
        prompt:
          回生成プロンプト({ 日付, 曜日, 番組リスト }) +
          (prev ? `\n\n## 前回の差し戻し\n${prev.join('\n')}\n直して出し直してください。` : ''),
        maxTokens: 8000,
      });
      return { value, errors: validate回(value.回, [...programById.keys()]) };
    });
  } else {
    回結果 = {
      回: composeEpisodes(station, 日付, 曜日, 番組行),
      編成メモ: composeMemo(station, 日付, 曜日, rows, radioRows),
    };
    const errs = validate回(回結果.回, [...programById.keys()]);
    if (errs.length) throw new Error(`作文器の出力が条件を満たしていません: ${errs.join(' / ')}`);
  }
  const 回by = new Map(回結果.回.map((r) => [r.番組id, r]));

  // 4. LLM 呼び出し②：新しいCM素材を1本。素材の少ない波から埋める
  新在の更新(station, 日付);
  if (!新CMなし) {
    const 媒体 = 今日つくる媒体(station);
    // どの経路で作っても、検証は同じものを通す
    let 新CM = null;
    if (回結果.新CM) 新CM = seedCM(station, 日付, 回結果.新CM);
    else if (useLLM) 新CM = await 新CM生成(station, 日付, 媒体);
    else {
      const 種 = composeCM(station, 日付, 媒体);
      if (種) 新CM = seedCM(station, 日付, 種);
      else console.warn(`${媒体}の新素材は今日は作れませんでした（名前か略号が尽きています）`);
    }
    if (新CM) {
      station.CM素材.push(新CM);
      const sponsor = station.スポンサー.find((s) => s.id === 新CM.スポンサーid);
      console.log(`新素材 ${新CM.略号}「${新CM.商品名}」（${新CM.媒体}／${sponsor?.社名}／${新CM.尺}秒）`);
    }
  }

  // 5〜6. CM の割り付けと数字のシミュレート（どちらも決定論）
  const 組む = (rs, 媒体) =>
    placeCommercials(station, 日付, rs, 媒体).map((row) => {
      if (row.種別 !== '番組') return row;
      const p = programById.get(row.番組id);
      const 回 = 回by.get(row.番組id) ?? {};
      const 数字 = simulateRating(p, 日付, row.開始時刻, 媒体);
      return {
        種別: '番組',
        開始時刻: row.開始時刻,
        尺: row.尺,
        番組id: row.番組id,
        サブタイトル: 回.サブタイトル ?? '',
        今回の内容: 回.今回の内容 ?? '',
        ゲスト: 回.ゲスト ?? [],
        [率の名前(媒体)]: 数字,
        ...(row.PT ? { PT: row.PT } : {}),
      };
    });

  const 編成 = 組む(rows, TV);
  const ラジオ編成 = 組む(radioRows, RADIO);

  // 7. 書き出し
  const day = {
    日付,
    曜日,
    編成,
    ラジオ編成,
    編成メモ: 回結果.編成メモ ?? '',
  };
  writeJSON(outFile, day);

  // 履歴は媒体を問わず 視聴率履歴 に積む（ラジオの中身は聴取率）。
  // 編成会議はこの一本の系列だけを読めばよい。
  for (const [rowsOf, 媒体] of [
    [編成, TV],
    [ラジオ編成, RADIO],
  ]) {
    for (const row of rowsOf) {
      if (row.種別 !== '番組') continue;
      const p = programById.get(row.番組id);
      p.視聴率履歴 = (p.視聴率履歴 ?? []).filter((h) => h.日付 !== 日付);
      p.視聴率履歴.push({ 日付, 数値: row[率の名前(媒体)] });
      p.視聴率履歴.sort((a, b) => a.日付.localeCompare(b.日付));
      if (p.視聴率履歴.length > 120) p.視聴率履歴 = p.視聴率履歴.slice(-120);
    }
  }
  writeJSON(STATION_FILE, station);

  const { days } = syncDocsData();
  console.log(`✓ ${path.relative(process.cwd(), outFile)} を書き出しました（全 ${days.length} 日分）`);
}

/** seed で渡されたCM素材に id と使用期間をつける。制約は LLM 産と同じ検証にかける。 */
function seedCM(station, 日付, 種) {
  const 略号一覧 = station.CM素材.map((c) => c.略号);
  // 略号がすでに使われていたら振り直す。素材そのものは捨てない
  if (略号一覧.includes(種.略号)) {
    const 空き = [];
    for (const a of 'ABCDEFGHJKLMNPRSTWY') for (let d = 1; d <= 9; d++) 空き.push(`${a}${d}`);
    const 代わり = 空き.find((x) => !略号一覧.includes(x));
    if (!代わり) throw new Error('略号が尽きました');
    console.warn(`略号 ${種.略号} は使用済みのため ${代わり} に振り直しました`);
    種 = { ...種, 略号: 代わり };
  }
  const errs = validateCM(種, { スポンサーid一覧: station.スポンサー.map((s) => s.id), 略号一覧 });
  if (errs.length) throw new Error(`seed のCM素材が条件を満たしていません: ${errs.join(' / ')}`);
  return 素材に仕立てる(station, 日付, 種);
}

async function 直近3回(日付) {
  const map = new Map();
  for (let d = 1; d <= 21; d++) {
    const f = path.join(DAYS_DIR, `${addDays(日付, -d)}.json`);
    if (!exists(f)) continue;
    const past = readJSON(f);
    for (const row of past.編成) {
      if (row.種別 !== '番組') continue;
      const list = map.get(row.番組id) ?? [];
      if (list.length >= 3) continue;
      list.push({ 日付: past.日付, サブタイトル: row.サブタイトル, 今回の内容: row.今回の内容 });
      map.set(row.番組id, list);
    }
  }
  return map;
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
