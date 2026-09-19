#!/usr/bin/env node
// 似顔絵を人物データから描く。外部の生成器に頼らないので、55名が必ず揃う。
//
//   node generator/draw-portraits.js
//
// 紙面が黒と灰だけなので、絵もインクの線と網点の灰だけで描く。
// 表示は名鑑22px・人物面84px。線を太く、要素を少なくして、小さくても人が判るようにする。
// 顔つきは外見・年代・肩書から決まり、揺らぎも id から決まる決定論。
// 同じ人は何度描いても同じ顔になる。

import fs from 'node:fs';
import path from 'node:path';
import { STATION_FILE, DOCS_DIR, readJSON, syncDocsData } from './lib/paths.js';

const INK = '#17160f';
const PAPER = '#efece3';

/* ---------- 決定論の揺らぎ ---------- */

function rngOf(seed) {
  let h = 2166136261;
  for (const ch of String(seed)) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13; h >>>= 0;
    h ^= h >>> 17;
    h ^= h << 5; h >>>= 0;
    return h / 4294967296;
  };
}
const between = (r, a, b) => a + r() * (b - a);
const oneOf = (r, arr) => arr[Math.floor(r() * arr.length) % arr.length];

/* ---------- 外見の読み取り ---------- */

const 年代の年 = {
  二十代前半: 22, 二十代半ば: 25, 二十代後半: 28,
  三十代前半: 32, 三十代後半: 38,
  四十代前半: 42, 四十代半ば: 45, 四十代後半: 48,
  五十代前半: 52, 五十代後半: 58,
  六十代前半: 62, 六十代半ば: 65,
  七十代前半: 72,
};

function 読み取る(h) {
  const v = h.外見 ?? '';
  const 年 = 年代の年[h.年代] ?? 45;
  const 女 = /女性/.test(v);

  // 書いてある髪型を優先し、書いていなければ性別と年齢から選ぶ。
  // 55名を並べたときに同じ輪郭が続かないよう、既定の型を散らす。
  const 既定 = 女
    ? ['bob', 'shoulder', 'crop', 'tied', 'long']
    : ['short', 'sidePart', 'crew', 'short', 'wave'];
  let 髪 = 既定[0];
  let 指定 = false;
  const 決 = (x) => { 髪 = x; 指定 = true; };
  if (/角刈り/.test(v)) 決('crew');
  if (/短い黒髪|短髪/.test(v)) 決('short');
  if (/ショートカット/.test(v)) 決('crop');
  if (/肩までの髪/.test(v)) 決('shoulder');
  if (/前髪が長/.test(v)) 決('fringe');
  if (/長い髪|髪が長/.test(v)) 決('long');
  if (/束ね|結い|結った|まとめ/.test(v)) 決('tied');
  if (/和装/.test(v)) 決(女 ? 'tied' : 'short');

  const 白 = /白髪(?!まじり)/.test(v);
  const 灰 = /白髪まじり/.test(v) || 年 >= 62;

  let 眼鏡 = null;
  if (/銀縁/.test(v)) 眼鏡 = 'thin';
  else if (/丸眼鏡/.test(v)) 眼鏡 = 'round';
  else if (/老眼鏡/.test(v)) 眼鏡 = 'brow';
  else if (/眼鏡/.test(v)) 眼鏡 = 'plain';

  let 服 = 女 ? 'blouse' : 'shirt';
  if (/綿のシャツ|開襟シャツ/.test(v)) 服 = 'openShirt';
  if (/Tシャツ|学生風/.test(v)) 服 = 'tee';
  if (/カーディガン/.test(v)) 服 = 'cardigan';
  if (/エプロン/.test(v)) 服 = 'apron';
  if (/事務服/.test(v)) 服 = 'office';
  if (/作業ベスト/.test(v)) 服 = 'vest';
  if (/作業ジャンパー|作業着|作業帽/.test(v)) 服 = 'work';
  if (/警備服/.test(v)) 服 = 'uniform';
  if (/紺のジャケット/.test(v)) 服 = 'jacket';
  if (/スーツ|ネクタイ|落ち着いた品/.test(v)) 服 = 'suit';
  if (/蝶ネクタイ/.test(v)) 服 = 'bowtie';
  if (/和装/.test(v)) 服 = 'kimono';

  return {
    女,
    年,
    髪,
    髪指定: 指定,
    髪既定: 既定,
    白,
    灰,
    眼鏡,
    服,
    帽子: /作業帽/.test(v),
    髭: /無精髭/.test(v),
    日焼け: /日焼け/.test(v),
    痩せ: /痩せ型/.test(v),
    恰幅: /恰幅/.test(v),
    疲れ: /寝ていない|疲れた顔|血の気/.test(v),
  };
}

/* ---------- 部品 ---------- */

const 線 = (d, w = 2.2, extra = '') =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const 面 = (d, fill, w = 2.2) =>
  `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"/>`;

function 髪を描く(型, 顔, r, 色, 年) {
  const { cx, cy, rx, ry } = 顔;
  const top = cy - ry;
  const out = [];
  // 生え際の高さ。年を取るほど上がる
  const 後退 = 年 >= 58 ? ry * 0.16 : 年 >= 48 ? ry * 0.07 : 0;
  const 生え際 = cy - ry * 0.44 - 後退;

  const 短い = (厚, угол = 0.12) =>
    面(
      `M${cx - rx * 1.03},${生え際 + 5} C${cx - rx * 1.06},${top - ry * 厚} ${cx + rx * 1.06},${top - ry * 厚} ${cx + rx * 1.03},${生え際 + 5} C${cx + rx * 0.72},${生え際 - ry * угол} ${cx - rx * 0.72},${生え際 - ry * угол} ${cx - rx * 1.03},${生え際 + 5} Z`,
      色,
    );

  switch (型) {
    case 'crew':
      out.push(短い(0.1, 0.02));
      break;
    case 'short':
      out.push(短い(0.3, 0.14));
      break;
    case 'wave':
      out.push(短い(0.42, 0.2));
      out.push(線(`M${cx - rx * 0.6},${生え際 - 2} q${rx * 0.3},${-ry * 0.16} ${rx * 0.62},${ry * 0.02}`, 1.6));
      break;
    case 'sidePart':
      out.push(短い(0.32, 0.1));
      out.push(
        面(
          `M${cx - rx * 0.98},${生え際 + 3} C${cx - rx * 0.5},${生え際 - ry * 0.34} ${cx + rx * 0.5},${生え際 - ry * 0.22} ${cx + rx * 1.0},${生え際 + 6} C${cx + rx * 0.3},${生え際 - ry * 0.02} ${cx - rx * 0.4},${生え際 + ry * 0.06} ${cx - rx * 0.98},${生え際 + 3} Z`,
          色,
          1.4,
        ),
      );
      break;
    case 'bald':
      out.push(
        面(
          `M${cx - rx * 1.02},${cy - ry * 0.05} C${cx - rx * 1.04},${cy - ry * 0.5} ${cx - rx * 0.86},${cy - ry * 0.62} ${cx - rx * 0.8},${cy - ry * 0.5} C${cx - rx * 0.6},${cy - ry * 0.2} ${cx + rx * 0.6},${cy - ry * 0.2} ${cx + rx * 0.8},${cy - ry * 0.5} C${cx + rx * 0.86},${cy - ry * 0.62} ${cx + rx * 1.04},${cy - ry * 0.5} ${cx + rx * 1.02},${cy - ry * 0.05} Z`,
          色,
          1.8,
        ),
      );
      break;
    case 'crop':
    case 'bob': {
      const 幅 = 型 === 'bob' ? 1.18 : 1.05;
      const 丈 = 型 === 'bob' ? ry * 0.42 : ry * 0.12;
      out.push(
        面(
          `M${cx - rx * 幅},${cy + 丈} C${cx - rx * 1.26},${top - ry * 0.3} ${cx + rx * 1.26},${top - ry * 0.3} ${cx + rx * 幅},${cy + 丈} L${cx + rx * 0.8},${cy + 丈 * 0.9} C${cx + rx * 0.96},${生え際 - 2} ${cx - rx * 0.96},${生え際 - 2} ${cx - rx * 0.8},${cy + 丈 * 0.9} Z`,
          色,
        ),
      );
      break;
    }
    case 'shoulder':
    case 'long':
    case 'fringe': {
      const 丈 = 型 === 'long' ? ry * 1.5 : ry * 1.0;
      out.push(
        面(
          `M${cx - rx * 1.2},${cy + 丈} C${cx - rx * 1.36},${top - ry * 0.24} ${cx + rx * 1.36},${top - ry * 0.24} ${cx + rx * 1.2},${cy + 丈} L${cx + rx * 0.86},${cy + 丈 * 0.9} C${cx + rx * 1.02},${生え際} ${cx - rx * 1.02},${生え際} ${cx - rx * 0.86},${cy + 丈 * 0.9} Z`,
          色,
        ),
      );
      if (型 === 'fringe') {
        out.push(
          面(
            `M${cx - rx * 1.0},${生え際 + ry * 0.24} C${cx - rx * 0.5},${生え際 - ry * 0.34} ${cx + rx * 0.9},${生え際 - ry * 0.28} ${cx + rx * 0.98},${生え際 + ry * 0.5} C${cx + rx * 0.3},${生え際 + ry * 0.06} ${cx - rx * 0.3},${生え際 + ry * 0.3} ${cx - rx * 1.0},${生え際 + ry * 0.24} Z`,
            色,
            1.6,
          ),
        );
      }
      break;
    }
    default: {
      // tied：後ろでまとめる
      out.push(
        面(
          `M${cx - rx * 1.08},${cy + ry * 0.08} C${cx - rx * 1.22},${top - ry * 0.28} ${cx + rx * 1.22},${top - ry * 0.28} ${cx + rx * 1.08},${cy + ry * 0.08} L${cx + rx * 0.84},${cy + ry * 0.04} C${cx + rx * 0.98},${生え際 - 1} ${cx - rx * 0.98},${生え際 - 1} ${cx - rx * 0.84},${cy + ry * 0.04} Z`,
          色,
        ),
      );
      out.push(
        面(
          `M${cx + rx * 0.96},${cy + ry * 0.06} q${rx * 0.36},${ry * 0.22} ${rx * 0.12},${ry * 0.6} q${-rx * 0.36},${-ry * 0.12} ${-rx * 0.32},${-ry * 0.58} Z`,
          色,
          1.8,
        ),
      );
    }
  }
  return out.join('');
}

function 服を描く(型, r) {
  const 肩 = `M6,120 C8,100 30,90 60,90 C90,90 112,100 114,120 Z`;
  const out = [面(肩, PAPER, 2.4)];
  const V = (w, dy = 0) =>
    線(`M${60 - w},${92 + dy} L60,${104 + dy} L${60 + w},${92 + dy}`, 2.2);

  switch (型) {
    case 'suit':
      out.push(面(`M42,92 L60,106 L78,92 L86,96 L84,120 L36,120 L34,96 Z`, 'url(#tone)', 2.2));
      out.push(面(`M54,96 L60,104 L66,96 L64,120 L56,120 Z`, INK, 1.4));
      break;
    case 'jacket':
      out.push(面(`M42,92 L60,106 L78,92 L86,96 L84,120 L36,120 L34,96 Z`, 'url(#tone)', 2.2));
      out.push(V(12));
      break;
    case 'bowtie':
      out.push(面(`M42,92 L60,106 L78,92 L86,96 L84,120 L36,120 L34,96 Z`, 'url(#tone)', 2.2));
      out.push(面(`M52,100 L60,104 L52,108 Z M68,100 L60,104 L68,108 Z`, INK, 1.2));
      break;
    case 'uniform':
      out.push(面(`M40,92 L60,104 L80,92 L86,96 L84,120 L36,120 L34,96 Z`, 'url(#tone)', 2.2));
      out.push(線(`M46,104 L50,120 M74,104 L70,120`, 1.6));
      break;
    case 'work':
    case 'vest':
      out.push(面(`M38,93 L60,102 L82,93 L88,98 L86,120 L34,120 L32,98 Z`, 'url(#tone)', 2.2));
      out.push(線(`M60,102 L60,120`, 1.8));
      if (型 === 'vest') out.push(面(`M44,106 h9 v7 h-9 Z M67,106 h9 v7 h-9 Z`, PAPER, 1.4));
      break;
    case 'apron':
      out.push(面(`M46,94 L60,102 L74,94 L82,98 L84,120 L36,120 L38,98 Z`, PAPER, 2.2));
      out.push(面(`M48,104 L72,104 L76,120 L44,120 Z`, 'url(#tone)', 1.8));
      break;
    case 'cardigan':
      out.push(面(`M42,93 L60,103 L78,93 L86,98 L84,120 L36,120 L34,98 Z`, 'url(#tone)', 2.2));
      out.push(線(`M60,103 L60,120`, 1.6));
      out.push(`<circle cx="60" cy="110" r="1.9" fill="${INK}"/>`);
      break;
    case 'office':
      out.push(面(`M44,93 L60,104 L76,93 L84,98 L82,120 L38,120 L36,98 Z`, PAPER, 2.2));
      out.push(V(10));
      out.push(線(`M44,100 L46,120 M76,100 L74,120`, 1.5));
      break;
    case 'kimono':
      out.push(面(`M38,94 L60,110 L82,94 L88,100 L86,120 L34,120 L32,100 Z`, PAPER, 2.4));
      out.push(面(`M52,98 L60,110 L68,98 L66,120 L54,120 Z`, 'url(#tone)', 1.8));
      break;
    case 'tee':
      out.push(面(`M40,94 C48,90 72,90 80,94 L88,100 L86,120 L34,120 L32,100 Z`, PAPER, 2.2));
      out.push(線(`M50,93 C56,99 64,99 70,93`, 2));
      break;
    case 'openShirt':
      out.push(面(`M42,93 L60,104 L78,93 L86,98 L84,120 L36,120 L34,98 Z`, PAPER, 2.2));
      out.push(線(`M46,95 L60,106 L74,95`, 2.2));
      break;
    default:
      out.push(面(`M42,93 L60,103 L78,93 L86,98 L84,120 L36,120 L34,98 Z`, PAPER, 2.2));
      out.push(V(11));
  }
  return out.join('');
}

/* ---------- 一人ぶん ---------- */

function 描く(h) {
  const f = 読み取る(h);
  const r = rngOf(h.id + h.氏名);

  const cx = 60;
  const cy = 50 + between(r, -1.5, 1.5);
  const rx = (f.恰幅 ? 27.5 : f.痩せ ? 23 : 25.5) + between(r, -1.4, 1.4);
  const ry = (f.恰幅 ? 30 : 32) + between(r, -1.6, 1.6);
  const 顔 = { cx, cy, rx, ry };
  // 顎の張り。丸顔・面長・えら張りを散らす
  const 顎 = oneOf(r, [0.42, 0.56, 0.72, 0.9]);

  // 髪型が書かれていない人は、既定の並びから id で選ぶ。
  // 男性で年配なら、頭頂の後退も候補に入れる
  if (!f.髪指定) {
    const 候補 = [...f.髪既定];
    if (!f.女 && f.年 >= 58) 候補.push('bald', 'bald');
    f.髪 = oneOf(r, 候補);
  }

  // 白髪は輪郭だけ、白髪まじりは細い斜線。網点で塗ると帽子に見えてしまう
  const 髪色 = f.白 ? PAPER : f.灰 ? 'url(#hatch)' : INK;
  const 目間 = 10.5 + between(r, -0.8, 0.8);
  const 目高 = cy + between(r, -1, 1.5);
  const 眉高 = 目高 - 8.5 - between(r, 0, 1.5);
  const 眉角 = between(r, -1.6, 1.6);
  const 口幅 = 6 + between(r, -1.2, 1.6);
  const 口反 = between(r, -1.4, 1.2);
  const 鼻長 = 6 + between(r, -1, 1.5);

  const p = [];
  p.push(`<rect width="120" height="120" fill="${PAPER}"/>`);
  p.push(服を描く(f.服, r));

  // 首
  p.push(面(`M52,74 L68,74 L69,94 L51,94 Z`, PAPER, 2.2));

  // 顔
  p.push(
    面(
      `M${cx - rx},${cy - ry * 0.25} C${cx - rx},${cy - ry * 1.05} ${cx + rx},${cy - ry * 1.05} ${cx + rx},${cy - ry * 0.25} C${cx + rx},${cy + ry * 0.62} ${cx + rx * 顎},${cy + ry} ${cx},${cy + ry} C${cx - rx * 顎},${cy + ry} ${cx - rx},${cy + ry * 0.62} ${cx - rx},${cy - ry * 0.25} Z`,
      PAPER,
      2.4,
    ),
  );
  // 日焼けは頬の斜線で示す。顔全体を塗ると小さいとき黒く潰れる
  if (f.日焼け) {
    p.push(線(`M${cx - rx * 0.72},${cy + 4} l5,6 M${cx - rx * 0.56},${cy + 2} l5,6`, 1.3));
    p.push(線(`M${cx + rx * 0.72},${cy + 4} l-5,6 M${cx + rx * 0.56},${cy + 2} l-5,6`, 1.3));
  }
  // 耳
  p.push(面(`M${cx - rx - 1},${cy - 2} q-5,3 0,9 Z`, PAPER, 2));
  p.push(面(`M${cx + rx + 1},${cy - 2} q5,3 0,9 Z`, PAPER, 2));

  p.push(髪を描く(f.髪, 顔, r, 髪色, f.年));

  // 眉。太さと角度を散らす
  const 眉太 = between(r, 1.8, 3.2);
  p.push(線(`M${cx - 目間 - 5},${眉高 + 眉角} q5,-2.6 10,${-眉角 * 0.4}`, 眉太));
  p.push(線(`M${cx + 目間 + 5},${眉高 - 眉角} q-5,-2.6 -10,${眉角 * 0.4}`, 眉太));

  // 目
  const 目型 = f.疲れ ? 'tired' : oneOf(r, ['open', 'open', 'narrow', 'round']);
  const 目 = (x) => {
    if (目型 === 'tired')
      return 線(`M${x - 4},${目高} q4,3.4 8,0`, 2.2) + 線(`M${x - 3},${目高 + 4} q3,1.4 6,0`, 1.3);
    if (目型 === 'narrow')
      return 線(`M${x - 4.6},${目高 + 0.6} q4.6,-3 9.2,0`, 2.4);
    if (目型 === 'round')
      return `<circle cx="${x}" cy="${目高 + 0.4}" r="3.4" fill="${PAPER}" stroke="${INK}" stroke-width="2"/><circle cx="${x}" cy="${目高 + 0.6}" r="1.7" fill="${INK}"/>`;
    return (
      線(`M${x - 4.2},${目高} q4.2,-4 8.4,0`, 2.2) +
      `<circle cx="${x}" cy="${目高 + 0.6}" r="1.9" fill="${INK}"/>`
    );
  };
  p.push(目(cx - 目間), 目(cx + 目間));

  // 鼻・口
  p.push(線(`M${cx - 1.5},${目高 + 鼻長} q3,2.4 4.6,-0.6`, 2));
  const 口型 = oneOf(r, ['flat', 'smile', 'flat', 'press']);
  const 口y = 目高 + 鼻長 + 9;
  if (口型 === 'smile') p.push(線(`M${cx - 口幅},${口y - 1} q${口幅},${4 + 口反} ${口幅 * 2},0`, 2.2));
  else if (口型 === 'press') p.push(線(`M${cx - 口幅},${口y} q${口幅},${-1.2} ${口幅 * 2},0`, 2.4));
  else p.push(線(`M${cx - 口幅},${口y} q${口幅},${2.2 + 口反} ${口幅 * 2},0`, 2.2));

  // 年齢の線
  if (f.年 >= 48) {
    p.push(線(`M${cx - 12},${目高 + 鼻長 + 5} q3,5 1,9`, 1.4));
    p.push(線(`M${cx + 12},${目高 + 鼻長 + 5} q-3,5 -1,9`, 1.4));
  }
  if (f.年 >= 60) p.push(線(`M${cx - 9},${眉高 - 6} q9,-2.4 18,0`, 1.3));

  // 無精髭
  if (f.髭) {
    p.push(
      `<path d="M${cx - rx * 0.78},${cy + ry * 0.3} C${cx - rx * 0.6},${cy + ry * 0.95} ${cx + rx * 0.6},${cy + ry * 0.95} ${cx + rx * 0.78},${cy + ry * 0.3} C${cx + rx * 0.5},${cy + ry * 0.72} ${cx - rx * 0.5},${cy + ry * 0.72} ${cx - rx * 0.78},${cy + ry * 0.3} Z" fill="url(#tone)" opacity="0.85"/>`,
    );
  }

  // 眼鏡
  if (f.眼鏡) {
    const w = f.眼鏡 === 'round' ? 7.6 : 8.4;
    const 太 = f.眼鏡 === 'thin' ? 1.3 : 2;
    const y = f.眼鏡 === 'brow' ? 眉高 - 7 : 目高 + 0.5;
    const 形 = (x) =>
      f.眼鏡 === 'round'
        ? `<circle cx="${x}" cy="${y}" r="${w}" fill="none" stroke="${INK}" stroke-width="${太}"/>`
        : `<rect x="${x - w}" y="${y - 6}" width="${w * 2}" height="12" rx="3" fill="none" stroke="${INK}" stroke-width="${太}"/>`;
    p.push(形(cx - 目間), 形(cx + 目間));
    p.push(線(`M${cx - 目間 + w},${y} L${cx + 目間 - w},${y}`, 太));
  }

  // 作業帽
  if (f.帽子) {
    p.push(面(`M${cx - rx * 1.08},${cy - ry * 0.46} C${cx - rx * 1.1},${cy - ry * 1.2} ${cx + rx * 1.1},${cy - ry * 1.2} ${cx + rx * 1.08},${cy - ry * 0.46} Z`, 'url(#tone)', 2.2));
    p.push(面(`M${cx - rx * 1.25},${cy - ry * 0.46} h${rx * 2.5} v4 h${-rx * 2.5} Z`, INK, 1.6));
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="${h.氏名}の似顔絵">
<defs>
<pattern id="tone" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="${PAPER}"/><circle cx="1.4" cy="1.4" r="1.15" fill="${INK}"/></pattern>
<pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><rect width="5" height="5" fill="${PAPER}"/><line x1="0" y1="0" x2="0" y2="5" stroke="${INK}" stroke-width="1.6"/></pattern>
</defs>
${p.join('\n')}
</svg>
`;
}

/* ---------- 書き出し ---------- */

const station = readJSON(STATION_FILE);
const dir = path.join(DOCS_DIR, 'portraits');
fs.mkdirSync(dir, { recursive: true });

// 描き直すので、前の生成物は落とす（絵柄が混ざらないように）
for (const f of fs.readdirSync(dir)) {
  if (/\.(jpg|jpeg|png|webp|svg)$/i.test(f)) fs.rmSync(path.join(dir, f));
}

let n = 0;
for (const h of station.人物) {
  fs.writeFileSync(path.join(dir, `${h.id}.svg`), 描く(h), 'utf8');
  n += 1;
}

syncDocsData();
console.log(`✓ ${n}名ぶんの似顔絵を描きました（docs/portraits/*.svg）`);
