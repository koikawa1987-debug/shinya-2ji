import { DAY_START_MIN, DAY_END_MIN, WEEKDAYS } from './config.js';

/** "26:30" -> 1590（放送日内の分。基準は 00:00 ではなく実時刻の連続値） */
export function toMinutes(hhmm) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!m) throw new Error(`時刻の書式が不正: ${hhmm}`);
  return Number(m[1]) * 60 + Number(m[2]);
}

/** 1590 -> "26:30" */
export function toHHMM(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** 放送日の先頭からの経過分 */
export function offsetInDay(hhmm) {
  return toMinutes(hhmm) - DAY_START_MIN;
}

export const DAY_LENGTH_MIN = DAY_END_MIN - DAY_START_MIN;

/** "2026-08-08" -> "土" */
export function weekdayOf(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

/** 日付文字列の加減算 */
export function addDays(dateStr, delta) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + delta));
  return t.toISOString().slice(0, 10);
}

/** いまの JST における「放送日」。05:00 未満なら前日の紙面。 */
export function currentBroadcastDate(now = new Date()) {
  const jst = new Date(now.getTime() + 9 * 3600 * 1000);
  const date = jst.toISOString().slice(0, 10);
  return jst.getUTCHours() < 5 ? addDays(date, -1) : date;
}

/** 2つの日付の間の日数 */
export function daysBetween(a, b) {
  const p = (s) => {
    const [y, m, d] = s.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((p(b) - p(a)) / 86400000);
}

/** その放送日に番組が編成されるか（枠の曜日は配列） */
export function airsOn(program, weekday) {
  const days = Array.isArray(program.枠.曜日) ? program.枠.曜日 : [program.枠.曜日];
  return days.includes(weekday);
}
