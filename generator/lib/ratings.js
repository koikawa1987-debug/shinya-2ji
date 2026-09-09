import {
  TV,
  RADIO,
  TIME_COEFFICIENT,
  GENRE_COEFFICIENT,
  GENRE_COEFFICIENT_DEFAULT,
  RADIO_TIME_COEFFICIENT,
  RADIO_GENRE_COEFFICIENT,
  RADIO_GENRE_COEFFICIENT_DEFAULT,
  RADIO_SCALE,
  RADIO_RATING_JITTER,
  RADIO_RATING_MIN,
  RADIO_RATING_DIGITS,
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

/** 媒体ごとの係数表をまとめて引く */
function 係数(媒体) {
  return 媒体 === RADIO
    ? {
        時間帯: RADIO_TIME_COEFFICIENT,
        ジャンル: RADIO_GENRE_COEFFICIENT,
        既定: RADIO_GENRE_COEFFICIENT_DEFAULT,
        倍率: RADIO_SCALE,
        ゆれ: RADIO_RATING_JITTER,
        下限: RADIO_RATING_MIN,
        桁: RADIO_RATING_DIGITS,
      }
    : {
        時間帯: TIME_COEFFICIENT,
        ジャンル: GENRE_COEFFICIENT,
        既定: GENRE_COEFFICIENT_DEFAULT,
        倍率: 1,
        ゆれ: RATING_JITTER,
        下限: RATING_MIN,
        桁: 1,
      };
}

export function timeCoefficient(開始時刻, 媒体 = TV) {
  const hour = Math.floor(toMinutes(開始時刻) / 60);
  return 係数(媒体).時間帯[hour] ?? 0.5;
}

export function genreCoefficient(ジャンル, 媒体 = TV) {
  const c = 係数(媒体);
  return c.ジャンル[ジャンル] ?? c.既定;
}

export function decay(開始日, 日付) {
  const weeks = Math.max(0, Math.floor(daysBetween(開始日, 日付) / 7));
  return Math.max(DECAY_FLOOR, DECAY_PER_WEEK ** weeks);
}

/**
 * ベース値 ＝ 時間帯係数 × ジャンル係数 × 継続週数による減衰、これに乱数。
 * テレビは視聴率で小数第1位まで、ラジオは聴取率で小数第2位まで。
 */
export function simulateRating(program, 日付, 開始時刻, 媒体 = TV) {
  const c = 係数(媒体);
  const base =
    timeCoefficient(開始時刻, 媒体) * genreCoefficient(program.ジャンル, 媒体) * decay(program.開始日, 日付) * c.倍率;
  const jitter = (seededRandom(`${日付}/${program.id}`) * 2 - 1) * c.ゆれ;
  const p = 10 ** c.桁;
  return Math.max(c.下限, Math.round((base + jitter) * p) / p);
}

/** 数字の呼び名。ラジオは「視聴率」ではなく「聴取率」 */
export function 率の名前(媒体) {
  return 媒体 === RADIO ? '聴取率' : '視聴率';
}
