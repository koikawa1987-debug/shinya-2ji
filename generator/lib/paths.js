import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, '..', '..');

export const DATA_DIR = path.join(ROOT, 'data');
export const DAYS_DIR = path.join(DATA_DIR, 'days');
export const MEETINGS_DIR = path.join(DATA_DIR, 'meetings');
export const STATION_FILE = path.join(DATA_DIR, 'station.json');

export const DOCS_DIR = path.join(ROOT, 'docs');
export const DOCS_DATA_DIR = path.join(DOCS_DIR, 'data');

export function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function writeJSON(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

export function exists(file) {
  return fs.existsSync(file);
}

/**
 * /data を /docs/data へ丸ごと複製する。GitHub Pages は /docs しか配信しないため、
 * サイト側の fetch がそのまま通るようにここで写しをつくる。
 * あわせて index.json（日付一覧・議事録一覧）も書き出す。
 */
export function syncDocsData() {
  fs.rmSync(DOCS_DATA_DIR, { recursive: true, force: true });
  fs.cpSync(DATA_DIR, DOCS_DATA_DIR, { recursive: true });

  const listOf = (dir) =>
    fs.existsSync(dir)
      ? fs
          .readdirSync(dir)
          .filter((f) => f.endsWith('.json'))
          .map((f) => f.replace(/\.json$/, ''))
          .sort()
      : [];

  const days = listOf(DAYS_DIR);
  const meetings = listOf(MEETINGS_DIR);

  const s = fs.existsSync(STATION_FILE) ? readJSON(STATION_FILE) : null;

  writeJSON(path.join(DOCS_DATA_DIR, 'index.json'), {
    生成時刻: new Date().toISOString(),
    days,
    meetings,
    station: s && {
      局名: s.局名,
      コールサイン: s.コールサイン,
      開局日: s.開局日,
      波: s.波 ?? null,
      番組数: s.番組.filter((p) => p.ステータス === '放送中').length,
      テレビ番組数: s.番組.filter((p) => p.ステータス === '放送中' && (p.媒体 ?? 'テレビ') === 'テレビ').length,
      ラジオ番組数: s.番組.filter((p) => p.ステータス === '放送中' && p.媒体 === 'ラジオ').length,
      人物数: (s.人物 ?? []).length,
      スポンサー数: s.スポンサー.length,
      CM素材数: s.CM素材.length,
    },
  });

  return { days, meetings };
}
