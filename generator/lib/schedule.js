import {
  DAY_START_MIN,
  DAY_END_MIN,
  SB_MAX_SECONDS,
  PT_MAX_SECONDS,
  PT_MIN_PROGRAM_MINUTES,
  休止タイトル,
} from './config.js';
import { toMinutes, toHHMM, weekdayOf, airsOn } from './time.js';

/**
 * その日の曜日から放送中番組を並べ、タイムテーブルの骨格をつくる。
 * 空き枠は「放送休止（カラーバー）」で埋める。ここは完全に決定論。
 */
export function buildSkeleton(station, 日付) {
  const 曜日 = weekdayOf(日付);

  const onAir = station.番組
    .filter((p) => p.ステータス === '放送中' || p.ステータス === '特番')
    .filter((p) => p.開始日 <= 日付)
    .filter((p) => !p.終了日 || p.終了日 >= 日付)
    .filter((p) => airsOn(p, 曜日))
    .map((p) => ({
      program: p,
      start: toMinutes(p.枠.開始時刻),
      尺: p.枠.尺,
    }))
    .sort((a, b) => a.start - b.start);

  // 重なりを検出したら後発を落とす（編成事故を紙面に出さない）
  const kept = [];
  let cursor = DAY_START_MIN;
  const conflicts = [];
  for (const item of onAir) {
    if (item.start < cursor) {
      conflicts.push(item.program.id);
      continue;
    }
    kept.push(item);
    cursor = item.start + item.尺;
  }

  const rows = [];
  cursor = DAY_START_MIN;
  const pushGap = (from, to) => {
    if (to - from >= 5) {
      rows.push({
        種別: '休止',
        開始時刻: toHHMM(from),
        尺: to - from,
        タイトル: 休止タイトル,
      });
    }
  };

  for (const item of kept) {
    pushGap(cursor, item.start);
    rows.push({
      種別: '番組',
      開始時刻: toHHMM(item.start),
      尺: item.尺,
      番組id: item.program.id,
    });
    cursor = item.start + item.尺;
  }
  pushGap(cursor, DAY_END_MIN);

  return { 曜日, rows, conflicts };
}

// --- CM の割り付け ------------------------------------------------------

function isActive(素材, 日付) {
  const { 開始, 終了 } = 素材.使用期間;
  if (開始 && 日付 < 開始) return false;
  if (終了 && 日付 > 終了) return false;
  return true;
}

/**
 * スポンサーの出稿方針に従って素材をブレイクに割り付ける。
 * 方針は { 時間帯: [...], ジャンル: [...] } の形。合致数が多い素材を優先する。
 */
function 時間帯ラベル(開始時刻) {
  const h = Math.floor(toMinutes(開始時刻) / 60);
  if (h < 9) return '早朝';
  if (h < 12) return '午前';
  if (h < 16) return '午後';
  if (h < 19) return '夕方';
  if (h < 23) return '夜';
  if (h < 25) return '深夜';
  return '未明';
}

function score(素材, sponsor, ctx) {
  if (!sponsor) return 0;
  const 方針 = sponsor.出稿方針 ?? {};
  let s = 0;
  if ((方針.時間帯 ?? []).includes(ctx.時間帯)) s += 3;
  if ((方針.ジャンル ?? []).includes(ctx.ジャンル)) s += 3;
  if ((sponsor.提供番組id ?? []).includes(ctx.番組id)) s += 4;
  if (素材.新在 === '新') s += 2;
  s += { 大: 2, 中: 1, 小: 0 }[sponsor.予算規模] ?? 0;
  return s;
}

/**
 * 骨格に CM ブレイクを差し込む。
 * 番組と番組の間 → SB、番組内 → PT。
 */
export function placeCommercials(station, 日付, rows) {
  const sponsors = new Map(station.スポンサー.map((s) => [s.id, s]));
  const pool = station.CM素材.filter((c) => isActive(c, 日付));
  if (pool.length === 0) return rows;

  const 使用回数 = new Map(pool.map((c) => [c.id, 0]));
  const programById = new Map(station.番組.map((p) => [p.id, p]));

  const pick = (ctx, budgetSec) => {
    const chosen = [];
    let remain = budgetSec;
    // その日すでに流した回数ぶん優先度を下げ、同じ並びが続かないようにする
    const rank = (c) =>
      score(c, sponsors.get(c.スポンサーid), ctx) - (使用回数.get(c.id) ?? 0) * 1.5;
    const ranked = [...pool].sort((a, b) => rank(b) - rank(a));
    for (const c of ranked) {
      if (c.尺 > remain) continue;
      if (chosen.some((x) => x.スポンサーid === c.スポンサーid)) continue; // 同一社の連続を避ける
      chosen.push(c);
      使用回数.set(c.id, (使用回数.get(c.id) ?? 0) + 1);
      remain -= c.尺;
      if (remain < 15) break;
    }
    return chosen;
  };

  const out = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // 番組内 PT（一定尺以上の番組の中ほどに1本）
    if (row.種別 === '番組' && row.尺 >= PT_MIN_PROGRAM_MINUTES) {
      const p = programById.get(row.番組id);
      const ptAt = toMinutes(row.開始時刻) + Math.floor(row.尺 / 2);
      const ctx = {
        時間帯: 時間帯ラベル(toHHMM(ptAt)),
        ジャンル: p?.ジャンル ?? '',
        番組id: row.番組id,
      };
      const mats = pick(ctx, PT_MAX_SECONDS);
      if (mats.length) {
        // 番組行を前後に割らず、行に PT を抱かせる（紙面では番組名の下に略号が刷られる）
        row.PT = {
          開始時刻: toHHMM(ptAt),
          尺: mats.reduce((a, c) => a + c.尺, 0),
          '素材id[]': mats.map((c) => c.id),
          'SB/PT': 'PT',
        };
      }
    }

    out.push(row);

    // 番組と番組の間 SB
    const next = rows[i + 1];
    if (row.種別 === '番組' && next && next.種別 === '番組') {
      const at = toMinutes(row.開始時刻) + row.尺;
      const p = programById.get(next.番組id);
      const ctx = {
        時間帯: 時間帯ラベル(toHHMM(at)),
        ジャンル: p?.ジャンル ?? '',
        番組id: next.番組id,
      };
      const mats = pick(ctx, SB_MAX_SECONDS);
      if (mats.length) {
        out.push({
          種別: 'CM',
          開始時刻: toHHMM(at),
          尺: mats.reduce((a, c) => a + c.尺, 0),
          '素材id[]': mats.map((c) => c.id),
          'SB/PT': 'SB',
        });
      }
    }
  }
  return out;
}

export { DAY_START_MIN, DAY_END_MIN };
