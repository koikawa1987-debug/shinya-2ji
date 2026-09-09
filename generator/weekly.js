#!/usr/bin/env node
// 毎週月曜 04:00 JST の編成会議。daily より先に走らせること。

import path from 'node:path';
import { STATION_FILE, MEETINGS_DIR, readJSON, writeJSON, exists, syncDocsData } from './lib/paths.js';
import { currentBroadcastDate, addDays, daysBetween, toMinutes, toHHMM } from './lib/time.js';
import { DAY_START_MIN, DAY_END_MIN } from './lib/config.js';
import { askJSON } from './lib/anthropic.js';
import { 世界観ルール, 編成会議プロンプト } from './lib/prompts.js';
import { validate会議, retrying } from './lib/schema.js';
import { composeMeeting } from './lib/compose-meeting.js';

const args = process.argv.slice(2);
const opt = (n) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const 日付 = opt('date') ?? currentBroadcastDate();
// 既定は API を使わない作文器。--llm（または USE_LLM=1）のときだけ Claude を叩く。
const useLLM = args.includes('--llm') || process.env.USE_LLM === '1';

/** 3月末と9月末は大改編 */
function is大改編(日付) {
  const [, m, d] = 日付.split('-').map(Number);
  return (m === 3 && d >= 25) || (m === 9 && d >= 24);
}

/** その曜日の空き枠を洗い出す */
function 空き枠一覧(station, 日付) {
  const lines = [];
  for (const 曜日 of ['月', '火', '水', '木', '金', '土', '日']) {
    const items = station.番組
      .filter((p) => p.ステータス === '放送中' && (!p.終了日 || p.終了日 >= 日付))
      .filter((p) => (Array.isArray(p.枠.曜日) ? p.枠.曜日 : [p.枠.曜日]).includes(曜日))
      .map((p) => ({ s: toMinutes(p.枠.開始時刻), e: toMinutes(p.枠.開始時刻) + p.枠.尺 }))
      .sort((a, b) => a.s - b.s);
    let cur = DAY_START_MIN;
    for (const it of items) {
      if (it.s - cur >= 30) lines.push(`- ${曜日} ${toHHMM(cur)}〜${toHHMM(it.s)}（${it.s - cur}分）`);
      cur = Math.max(cur, it.e);
    }
    if (DAY_END_MIN - cur >= 30) lines.push(`- ${曜日} ${toHHMM(cur)}〜${toHHMM(DAY_END_MIN)}（${DAY_END_MIN - cur}分）`);
  }
  return lines.join('\n') || '（空きなし）';
}

function 実績表(station, 日付) {
  const 起点 = addDays(日付, -28);
  return station.番組
    .filter((p) => p.ステータス === '放送中' && (!p.終了日 || p.終了日 >= 日付))
    .map((p) => {
      const h = (p.視聴率履歴 ?? []).filter((x) => x.日付 >= 起点);
      const avg = h.length ? (h.reduce((a, x) => a + x.数値, 0) / h.length).toFixed(2) : '—';
      const 週数 = Math.floor(daysBetween(p.開始日, 日付) / 7);
      return (
        `- ${p.id} ${p.タイトル}（${p.ジャンル}／${(Array.isArray(p.枠.曜日) ? p.枠.曜日 : [p.枠.曜日]).join('')} ${p.枠.開始時刻} ${p.枠.尺}分）` +
        ` 4週平均 ${avg}％（${h.length}回）放送${週数}週目${p.看板 ? ' ★局の看板' : ''}`
      );
    })
    .join('\n');
}

function スポンサー状況(station) {
  return station.スポンサー
    .map(
      (s) =>
        `- ${s.id} ${s.社名}（${s.業種}／予算${s.予算規模}）提供 ${s.提供番組id.length} 番組／` +
        `方針 時間帯=${(s.出稿方針?.時間帯 ?? []).join('・')} ジャンル=${(s.出稿方針?.ジャンル ?? []).join('・')}`,
    )
    .join('\n');
}

async function main() {
  if (!exists(STATION_FILE)) throw new Error('station.json がありません。先に bootstrap を実行してください。');
  const station = readJSON(STATION_FILE);

  const outFile = path.join(MEETINGS_DIR, `${日付}.json`);
  if (exists(outFile)) {
    console.log(`${日付} の議事録はすでにあります。`);
    return;
  }

  const 大改編 = is大改編(日付);
  const 上限 = 大改編 ? { 打ち切り: 4, 新番組: 4 } : { 打ち切り: 2, 新番組: 2 };
  console.log(`■ ${日付} 編成会議${大改編 ? '（大改編）' : ''}`);

  const 番組id一覧 = station.番組.map((p) => p.id);
  const 結果 = useLLM
    ? await retrying('編成会議', 3, async (_i, prev) => {
        const value = await askJSON({
          system: `${世界観ルール}\n\n局の説明: ${station.局のキャラクター}`,
          prompt:
            編成会議プロンプト({
              日付,
              大改編,
              実績: 実績表(station, 日付),
              空き枠: 空き枠一覧(station, 日付),
              スポンサー状況: スポンサー状況(station),
              上限,
            }) + (prev ? `\n\n## 前回の差し戻し\n${prev.join('\n')}\n直して出し直してください。` : ''),
          maxTokens: 8000,
        });
        return { value, errors: validate会議(value, { 番組id一覧, 上限 }) };
      })
    : composeMeeting(station, 日付, 大改編);

  if (!useLLM) {
    const errs = validate会議(結果, { 番組id一覧, 上限 });
    if (errs.length) console.warn(`作文器の会議に不足: ${errs.join(' / ')}`);
  }

  const 終了日 = addDays(日付, -1);
  for (const x of 結果.打ち切り ?? []) {
    const p = station.番組.find((q) => q.id === x.番組id);
    if (!p) continue;
    p.ステータス = '打ち切り';
    p.終了日 = 終了日;
    station.改編履歴.push({ 日付, 種別: '打ち切り', 概要: `${p.タイトル}：${x.理由}` });
  }

  let seq = station.番組.length;
  const 新番組ids = [];
  for (const p of 結果.新番組 ?? []) {
    seq += 1;
    const id = `p${String(seq).padStart(3, '0')}`;
    station.番組.push({
      id,
      媒体: p.媒体 ?? 'テレビ',
      タイトル: p.タイトル,
      ジャンル: p.ジャンル,
      枠: p.枠,
      出演者: p.出演者 ?? [],
      番組概要: p.番組概要 ?? '',
      開始日: 日付,
      終了日: null,
      視聴率履歴: [],
      ステータス: '放送中',
      提供スポンサーid: [],
      看板: false,
    });
    新番組ids.push({ 番組id: id, タイトル: p.タイトル });
    station.改編履歴.push({ 日付, 種別: '新番組', 概要: `${p.タイトル}（${p.枠.曜日.join('')} ${p.枠.開始時刻}）` });
  }

  const 新規スポンサーids = [];
  let sseq = station.スポンサー.length;
  for (const s of 結果.新規スポンサー ?? []) {
    sseq += 1;
    const id = `s${String(sseq).padStart(3, '0')}`;
    station.スポンサー.push({
      id,
      社名: s.社名,
      業種: s.業種,
      出稿方針: s.出稿方針,
      予算規模: s.予算規模,
      提供番組id: [],
      初出稿日: 日付,
    });
    新規スポンサーids.push({ id, 社名: s.社名 });
    station.改編履歴.push({ 日付, 種別: '新規スポンサー', 概要: s.社名 });
  }

  // 提供関係を出稿方針で結び直す
  for (const s of station.スポンサー) {
    const 対象 = station.番組.filter(
      (p) =>
        p.ステータス === '放送中' &&
        (s.出稿方針?.媒体 ?? ['テレビ']).includes(p.媒体 ?? 'テレビ') &&
        (s.出稿方針?.ジャンル ?? []).includes(p.ジャンル),
    );
    s.提供番組id = 対象.map((p) => p.id);
  }
  for (const p of station.番組) {
    p.提供スポンサーid = station.スポンサー.filter((s) => s.提供番組id.includes(p.id)).map((s) => s.id);
  }

  writeJSON(STATION_FILE, station);
  writeJSON(outFile, {
    日付,
    種別: 大改編 ? '大改編' : '定例',
    大改編,
    打ち切り: 結果.打ち切り ?? [],
    新番組: 新番組ids,
    新規スポンサー: 新規スポンサーids,
    議事録: 結果.議事録,
  });
  syncDocsData();
  console.log(`✓ 議事録を書き出しました（打ち切り ${(結果.打ち切り ?? []).length} / 新番組 ${新番組ids.length}）`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
