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
/**
 * app.js と style.css の参照に中身の指紋を付ける。
 * GitHub Pages は資産を10分キャッシュするため、これがないと
 * コードを直した直後の訪問者が古い app.js で新しい JSON を読むことになる。
 */
export function stampAssets() {
  const 指紋 = (name) => {
    const file = path.join(DOCS_DIR, name);
    if (!fs.existsSync(file)) return null;
    let h = 2166136261;
    for (const b of fs.readFileSync(file)) {
      h ^= b;
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36).slice(0, 6);
  };

  const v = { 'app.js': 指紋('app.js'), 'style.css': 指紋('style.css') };
  let 直した = 0;

  for (const f of fs.readdirSync(DOCS_DIR).filter((x) => x.endsWith('.html'))) {
    const file = path.join(DOCS_DIR, f);
    const 元 = fs.readFileSync(file, 'utf8');
    let 後 = 元;
    for (const [name, hash] of Object.entries(v)) {
      if (!hash) continue;
      // href="style.css" / src="app.js"（既存の ?v= も含めて）を貼り替える
      後 = 後.replace(
        new RegExp(`(["'])${name.replace('.', '\\.')}(\\?v=[0-9a-z]+)?\\1`, 'g'),
        `$1${name}?v=${hash}$1`,
      );
    }
    if (後 !== 元) {
      fs.writeFileSync(file, 後, 'utf8');
      直した += 1;
    }
  }
  return { 直した, v };
}

export function syncDocsData() {
  stampAssets();
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

  // 置いてある顔写真の一覧。サイト側はこれを見てから img を出すので、
  // 絵のない人のぶんの 404 が飛ばない。
  const 顔写真ディレクトリ = path.join(DOCS_DIR, 'portraits');
  const 顔写真 = fs.existsSync(顔写真ディレクトリ)
    ? fs
        .readdirSync(顔写真ディレクトリ)
        .filter((f) => /\.webp$/i.test(f))
        .map((f) => f.replace(/\.webp$/i, ''))
        .sort()
    : [];
  writeJSON(path.join(DOCS_DATA_DIR, 'portraits.json'), { 顔写真 });

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
