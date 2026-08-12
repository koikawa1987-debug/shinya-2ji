import {
  TIME_COEFFICIENT,
  GENRE_COEFFICIENT,
  GENRE_COEFFICIENT_DEFAULT,
  DECAY_PER_WEEK,
  DECAY_FLOOR,
  RATING_JITTER,
  RATING_MIN,
} from './config.js';
import { toMinutes, daysBetween } from './time.js';

/**
 * 日付＋番組idから決まる擬似乱数。同じ入力なら同じ数字になるので、
 * 再実行しても紙面が暴れない。
 */
function seededRandom(seed) {
  let h = 2166136261;
  for (const ch of seed) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 15;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  return ((h >>> 0) % 1000000) / 1000000;
}

export function timeCoefficient(開始時刻) {
  const hour = Math.floor(toMinutes(開始時刻) / 60);
  return TIME_COEFFICIENT[hour] ?? 0.5;
}

export function genreCoefficient(ジャンル) {
  return GENRE_COEFFICIENT[ジャンル] ?? GENRE_COEFFICIENT_DEFAULT;
}

export function decay(開始日, 日付) {
  const weeks = Math.max(0, Math.floor(daysBetween(開始日, 日付) / 7));
  return Math.max(DECAY_FLOOR, DECAY_PER_WEEK ** weeks);
}

/**
 * ベース値 ＝ 時間帯係数 × ジャンル係数 × 継続週数による減衰、これに ±0.8 の乱数。
 * 小数第1位まで。
 */
export function simulateRating(program, 日付, 開始時刻) {
  const base =
    timeCoefficient(開始時刻) * genreCoefficient(program.ジャンル) * decay(program.開始日, 日付);
  const jitter = (seededRandom(`${日付}/${program.id}`) * 2 - 1) * RATING_JITTER;
  return Math.max(RATING_MIN, Math.round((base + jitter) * 10) / 10);
}
