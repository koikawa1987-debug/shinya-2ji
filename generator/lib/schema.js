// 生成結果の検証。LLM が破った制約はここで弾き、呼び出し側で作り直させる。

import { TV, RADIO, 媒体一覧, CM_LENGTHS } from './config.js';

/**
 * 尺から逆算したナレーションの上限文字数。日本語ナレーションは1秒あたり約6〜7文字。
 * テレビは商品名・法定表示のスーパーぶんを引く。ラジオは絵がないぶん実質が長く、
 * 引くのは頭のジングルと尻の社名だけでよい。
 */
export function ナレーション上限(尺, 媒体 = TV) {
  const 実質秒 = 媒体 === RADIO ? 尺 - 3 : 尺 === 15 ? 10 : 尺 - 8;
  return Math.floor(実質秒 * 6.6);
}

/** 構成案の3列表の見出し。ラジオに映像欄はない。 */
export function 構成案の列(媒体) {
  return 媒体 === RADIO
    ? { 見出し: ['尺', '音', '原稿'], キー: ['時間', '音', '原稿'] }
    : { 見出し: ['尺', '映像', '音声'], キー: ['時間', '映像', '音声'] };
}

function 文字数(s) {
  // 記号・空白は読みに乗らないので除いて数える
  return [...String(s).replace(/[\s、。「」『』・…—-]/g, '')].length;
}

export function validateCM(cm, { スポンサーid一覧, 略号一覧 }) {
  const errs = [];
  const 媒体 = cm.媒体 ?? TV;
  if (!媒体一覧.includes(媒体)) errs.push(`媒体が不正: ${媒体}`);
  const 許される尺 = CM_LENGTHS[媒体] ?? CM_LENGTHS[TV];
  if (!許される尺.includes(cm.尺)) errs.push(`${媒体}の尺は ${許される尺.join(' か ')}`);
  if (!スポンサーid一覧.includes(cm.スポンサーid)) errs.push(`スポンサーid が不正: ${cm.スポンサーid}`);
  if (!/^[A-Z][0-9]$/.test(cm.略号 ?? '')) errs.push('略号は英大文字1字＋数字1字');
  else if (略号一覧.includes(cm.略号)) errs.push(`略号が重複: ${cm.略号}`);

  const 列 = 構成案の列(媒体);
  if (!Array.isArray(cm.構成案) || cm.構成案.length < 2) errs.push('構成案が足りない');
  else {
    const 合計 = cm.構成案.reduce((a, r) => a + Number(r.時間 || 0), 0);
    if (合計 !== cm.尺) errs.push(`構成案の秒の合計が尺と合わない（${合計} / ${cm.尺}）`);
    const [, 第2, 第3] = 列.キー;
    if (cm.構成案.some((r) => !r[第2] || !r[第3]))
      errs.push(`構成案に空欄がある（${媒体}の列は ${列.見出し.join('／')}）`);
  }

  const 上限 = ナレーション上限(cm.尺, 媒体);
  const n = 文字数(cm.ナレーション全文 ?? '');
  if (n === 0) errs.push('ナレーション全文が空');
  else if (n > 上限) errs.push(`ナレーションが尺に収まらない（${n}字／上限${上限}字）`);

  if (!Array.isArray(cm.没案) || cm.没案.length !== 3) errs.push('没案はちょうど3本');
  else if (cm.没案.some((b) => !b.タイトル || !b.内容 || !b.没理由)) errs.push('没案に空欄がある');

  return errs;
}

export function validate回(rows, 番組id一覧) {
  const errs = [];
  if (!Array.isArray(rows)) return ['回が配列でない'];
  for (const r of rows) {
    if (!番組id一覧.includes(r.番組id)) errs.push(`番組id が不正: ${r.番組id}`);
    if (!r.サブタイトル) errs.push(`${r.番組id}: サブタイトルが空`);
    if ([...String(r.サブタイトル ?? '')].length > 24) errs.push(`${r.番組id}: サブタイトルが長い`);
    if (!r.今回の内容) errs.push(`${r.番組id}: 今回の内容が空`);
    if ([...String(r.今回の内容 ?? '')].length > 130) errs.push(`${r.番組id}: 今回の内容が長い`);
  }
  return errs;
}

export function validate会議(result, { 番組id一覧, 上限 }) {
  const errs = [];
  const 打 = result.打ち切り ?? [];
  const 新 = result.新番組 ?? [];
  if (打.length > 上限.打ち切り) errs.push(`打ち切りが上限超過（${打.length}）`);
  if (新.length < 1 || 新.length > 上限.新番組) errs.push(`新番組の本数が範囲外（${新.length}）`);
  for (const x of 打) {
    if (!番組id一覧.includes(x.番組id)) errs.push(`打ち切り対象の番組idが不正: ${x.番組id}`);
    if (!x.理由) errs.push('打ち切り理由が空');
  }
  for (const p of 新) {
    if (!p.タイトル || !p.ジャンル || !p.枠) errs.push('新番組の必須項目が欠けている');
    else if (!/^\d{2}:\d{2}$/.test(p.枠.開始時刻 ?? '')) errs.push('新番組の開始時刻の書式が不正');
  }
  const 議 = [...String(result.議事録 ?? '')].length;
  if (議 < 400) errs.push(`議事録が短い（${議}字）`);
  if (議 > 1100) errs.push(`議事録が長い（${議}字）`);
  return errs;
}

/** 生成をやり直すための共通ループ */
export async function retrying(label, attempts, fn) {
  let last;
  for (let i = 1; i <= attempts; i++) {
    const { value, errors } = await fn(i, last);
    if (!errors || errors.length === 0) return value;
    last = errors;
    console.warn(`[${label}] ${i}回目の生成を差し戻し: ${errors.join(' / ')}`);
  }
  throw new Error(`[${label}] 規定回数で条件を満たせませんでした: ${last?.join(' / ')}`);
}
