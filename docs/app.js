// 深夜二時 JOZZ-DTV / JOZZ-FM ／ 紙面の組版と、オンエア線。
// 訪問者に入力を求めない。設定もフォームも置かない。読むだけの紙。

const DAY_START = 5 * 60; // 放送日は 05:00 に始まり 29:00 に終わる
const WD = ['日', '月', '火', '水', '木', '金', '土'];
const TV = 'テレビ';
const RADIO = 'ラジオ';

/* ---------- 下ごしらえ ---------- */

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

const json = (path) =>
  fetch(path, { cache: 'no-cache' }).then((r) => {
    if (!r.ok) throw new Error(`${path} を読めませんでした`);
    return r.json();
  });

const toMin = (hhmm) => {
  const [h, m] = String(hhmm).split(':').map(Number);
  return h * 60 + m;
};

const fmtTime = (hhmm) => {
  const [h, m] = String(hhmm).split(':');
  return { h: String(Number(h)), m };
};

const 媒体of = (x) => x?.媒体 ?? TV;
const 率の名前 = (媒体) => (媒体 === RADIO ? '聴取率' : '視聴率');
const 率を読む = (row, 媒体) => row[率の名前(媒体)] ?? row.視聴率;
const 率の書式 = (n, 媒体) => (媒体 === RADIO ? Number(n).toFixed(2) : Number(n).toFixed(1));

/** 尺と媒体からナレーションの上限字数を逆算する（生成側と同じ式） */
const ナレーション上限 = (尺, 媒体) => {
  const 実質 = 媒体 === RADIO ? 尺 - 3 : 尺 === 15 ? 10 : 尺 - 8;
  return { 実質, 上限: Math.floor(実質 * 6.6) };
};

const 構成案の列 = (媒体) =>
  媒体 === RADIO
    ? { 見出し: ['尺', '音', '原稿'], キー: ['時間', '音', '原稿'] }
    : { 見出し: ['尺', '映像', '音声'], キー: ['時間', '映像', '音声'] };

/** JST の「いま」を、放送日の日付と 05:00 起点の分に直す */
function nowJST() {
  const s = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date());
  const g = (t) => Number(s.find((p) => p.type === t).value);
  const [y, mo, d, hh, mm] = [g('year'), g('month'), g('day'), g('hour') % 24, g('minute')];
  let date = `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  let minutes = hh * 60 + mm;
  if (minutes < DAY_START) {
    const t = new Date(Date.UTC(y, mo - 1, d));
    t.setUTCDate(t.getUTCDate() - 1);
    date = t.toISOString().slice(0, 10);
    minutes += 24 * 60;
  }
  return {
    date,
    minutes,
    label: `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`,
  };
}

const 曜日of = (date) => WD[new Date(`${date}T12:00:00+09:00`).getDay()];
const 和文日付 = (date) => {
  const [y, m, d] = date.split('-').map(Number);
  return `${y}年${m}月${d}日（${曜日of(date)}）`;
};

/* ---------- せり上がる面 ---------- */

let 直前のフォーカス = null;

function openPanel(kicker, build) {
  const panel = $('#panel');
  const veil = $('#veil');
  if (!panel) return;
  if (panel.hidden) 直前のフォーカス = document.activeElement;

  $('#panel-kicker').textContent = kicker;
  const inner = $('#panel-inner');
  inner.replaceChildren();
  build(inner);

  panel.hidden = false;
  veil.hidden = false;
  panel.scrollTop = 0;
  requestAnimationFrame(() => {
    panel.dataset.open = '1';
    veil.dataset.open = '1';
  });
  $('#panel-close').focus();
  document.addEventListener('keydown', onEsc);
}

function closePanel() {
  const panel = $('#panel');
  const veil = $('#veil');
  if (!panel || panel.hidden) return;
  delete panel.dataset.open;
  delete veil.dataset.open;
  document.removeEventListener('keydown', onEsc);
  const done = () => {
    panel.hidden = true;
    veil.hidden = true;
  };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) done();
  else setTimeout(done, 190);
  直前のフォーカス?.focus?.();
}

function onEsc(e) {
  if (e.key === 'Escape') closePanel();
  if (e.key === 'Tab') {
    const panel = $('#panel');
    const items = panel.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

function initPanel() {
  $('#panel-close')?.addEventListener('click', closePanel);
  $('#veil')?.addEventListener('click', closePanel);
}

/* ---------- 面の中身 ---------- */

function 節(parent, 見出し) {
  const s = el('section', 'sec');
  s.append(el('h3', 'sec__h', 見出し));
  parent.append(s);
  return s;
}

/** 人物名のボタン。名鑑に載っている人だけ押せる */
function 人物リンク(名, station) {
  const 素 = String(名).split('・').pop().trim();
  const h = (station.人物 ?? []).find((x) => x.氏名 === 素 || x.氏名 === 名);
  if (!h) return document.createTextNode(名);
  const b = el('button', 'namelink', 名);
  b.type = 'button';
  b.addEventListener('click', () => openPanel('人物', 人物面(h, station)));
  return b;
}

function 名前を並べる(parent, 名前たち, station) {
  const p = el('p');
  名前たち.forEach((名, i) => {
    if (i) p.append(document.createTextNode('、'));
    p.append(人物リンク(名, station));
  });
  parent.append(p);
}

function 人物面(h, station) {
  return (root) => {
    root.append(el('h2', 'panel__title', h.氏名));
    root.append(el('p', 'panel__meta', `${h.よみ}　${h.肩書}　${h.所属}`));
    if (h.経歴) 節(root, '経歴').append(el('p', null, h.経歴));
    if (h.局との関係) 節(root, '局との関係').append(el('p', null, h.局との関係));
    if (h.癖) 節(root, '癖').append(el('p', null, h.癖));

    const 番組 = (h.担当番組id ?? [])
      .map((id) => station.番組.find((p) => p.id === id))
      .filter(Boolean);
    if (番組.length) {
      const s = 節(root, '担当番組');
      const ul = el('ul', 'list');
      for (const p of 番組) {
        const li = el('li');
        li.append(el('div', 'list__key', 媒体of(p)));
        const val = el('div', 'list__val');
        const b = el('button', 'hit');
        b.type = 'button';
        b.append(el('b', 'prog__title', p.タイトル));
        b.append(document.createTextNode(`　${p.ジャンル}　${p.枠.開始時刻}`));
        if (p.ステータス === '打ち切り') b.append(el('span', 'tag', '終了'));
        b.addEventListener('click', () => openPanel('番組', 番組面(p, null, station, 媒体of(p))));
        val.append(b);
        li.append(val);
        ul.append(li);
      }
      s.append(ul);
    }
  };
}

function CM面(cm, sponsor) {
  const 媒体 = 媒体of(cm);
  return (root) => {
    const t = el('h2', 'panel__title', cm.商品名);
    if (cm.新在 === '新') t.append(el('span', 'tag tag--red', '新'));
    root.append(t);
    root.append(
      el(
        'p',
        'panel__meta',
        `${sponsor?.社名 ?? '提供社不明'}　${媒体}　${cm.尺}秒　略号 ${cm.略号}　` +
          `使用期間 ${cm.使用期間?.開始 ?? '—'} 〜 ${cm.使用期間?.終了 ?? '—'}`,
      ),
    );

    const 列 = 構成案の列(媒体);
    const s1 = 節(root, '構成案');
    const table = el('table', 'board');
    const thead = el('thead');
    const tr = el('tr');
    for (const h of 列.見出し) tr.append(el('th', null, h));
    thead.append(tr);
    table.append(thead);
    const tb = el('tbody');
    for (const row of cm.構成案 ?? []) {
      const r = el('tr');
      r.append(el('td', null, `${row[列.キー[0]]}秒`));
      r.append(el('td', null, row[列.キー[1]]));
      r.append(el('td', 'board__sound', row[列.キー[2]]));
      tb.append(r);
    }
    const 合計 = (cm.構成案 ?? []).reduce((a, r) => a + Number(r.時間 || 0), 0);
    const fr = el('tr');
    fr.append(el('td', null, `計${合計}秒`));
    const spacer = el('td', null, '');
    spacer.colSpan = 2;
    fr.append(spacer);
    tb.append(fr);
    table.append(tb);
    s1.append(table);

    const s2 = 節(root, 媒体 === RADIO ? '原稿（読み全文）' : 'ナレーション');
    const n = el('p', 'narration', cm.ナレーション全文);
    const { 実質, 上限 } = ナレーション上限(cm.尺, 媒体);
    const 字 = [...String(cm.ナレーション全文).replace(/[\s、。「」『』・…—-]/g, '')].length;
    n.append(
      el('span', 'narration__count',
        `${字}字／尺${cm.尺}秒　実質${実質}秒ぶんの上限 ${上限}字（1秒あたり6.6字で逆算）`),
    );
    s2.append(n);

    const s3 = 節(root, '没案');
    const ul = el('ul', 'killed');
    for (const b of cm.没案 ?? []) {
      const li = el('li');
      li.append(el('div', 'killed__t', b.タイトル));
      li.append(el('p', 'killed__b', b.内容));
      li.append(el('div', 'killed__why', b.没理由));
      ul.append(li);
    }
    s3.append(ul);
  };
}

function 番組面(prog, row, station, 媒体 = 媒体of(prog)) {
  return (root) => {
    const t = el('h2', 'panel__title', prog.タイトル);
    t.append(el('span', 'tag', 媒体));
    root.append(t);
    const 曜 = Array.isArray(prog.枠.曜日) ? prog.枠.曜日.join('・') : prog.枠.曜日;
    root.append(
      el('p', 'panel__meta',
        `${prog.ジャンル}　${曜}　${prog.枠.開始時刻} から ${prog.枠.尺}分　` +
          `${prog.ステータス}${prog.看板 ? '（局の看板）' : ''}`),
    );

    if (row?.サブタイトル) {
      const lead = el('p', 'panel__lead');
      lead.append(el('strong', null, `「${row.サブタイトル}」`));
      lead.append(document.createTextNode(`　${row.今回の内容 ?? ''}`));
      root.append(lead);
    }

    if (row?.ゲスト?.length) 名前を並べる(節(root, 'ゲスト'), row.ゲスト, station);
    if (prog.出演者?.length) 名前を並べる(節(root, '出演'), prog.出演者, station);

    const 数字 = row ? 率を読む(row, 媒体) : null;
    if (数字 != null) {
      const s = 節(root, 率の名前(媒体));
      const wrap = el('div', 'rating');
      wrap.append(el('span', 'rating__n', 率の書式(数字, 媒体)));
      wrap.append(el('span', 'rating__u', 媒体 === RADIO ? '％（自社推計）' : '％（世帯・自社推計）'));
      s.append(wrap);
      if (Number(数字) === 0) s.append(el('p', null, '調査の刻みに届かず、この回は数字が立たなかった。'));

      const h = (prog.視聴率履歴 ?? []).slice(-14);
      if (h.length > 1) {
        const max = Math.max(...h.map((x) => x.数値), 0.0001);
        const spark = el('div', 'spark');
        for (const x of h) {
          const bar = el('i');
          bar.style.height = `${Math.max(1, (x.数値 / max) * 26)}px`;
          bar.title = `${x.日付}　${率の書式(x.数値, 媒体)}％`;
          spark.append(bar);
        }
        s.append(spark);
        s.append(el('p', null, `直近${h.length}回　最高 ${率の書式(max, 媒体)}％`));
      }
    }

    節(root, '番組概要').append(el('p', null, prog.番組概要));

    const 提供 = (prog.提供スポンサーid ?? [])
      .map((id) => station.スポンサー.find((s) => s.id === id)?.社名)
      .filter(Boolean);
    if (提供.length) 節(root, '提供').append(el('p', null, 提供.join('、')));
  };
}

/* ---------- 略号 ---------- */

function marksNode(ids, station, 見出し) {
  const wrap = el('span', 'marks');
  if (見出し) wrap.append(el('span', 'cm-label', 見出し));
  for (const id of ids ?? []) {
    const cm = station.CM素材.find((c) => c.id === id);
    if (!cm) continue;
    const b = el('button', 'mark');
    b.type = 'button';
    b.append(document.createTextNode(cm.略号));
    if (cm.新在 === '新') b.append(el('span', 'mark__new', '新'));
    const sponsor = station.スポンサー.find((s) => s.id === cm.スポンサーid);
    b.setAttribute('aria-label', `CM素材 ${cm.略号}　${cm.商品名}　${cm.尺}秒。構成案を開く`);
    b.addEventListener('click', () => openPanel('ＣＭ素材／構成案', CM面(cm, sponsor)));
    wrap.append(b);
  }
  return wrap;
}

/* ---------- 番組表を組む ---------- */

function renderGrid(編成, station, sheet, 媒体) {
  const progById = new Map(station.番組.map((p) => [p.id, p]));
  const rows = [];

  for (const item of 編成 ?? []) {
    const node = el('div', 'row');
    node.dataset.start = String(toMin(item.開始時刻));
    // CM行の尺は「秒」なので時間軸には乗せない。乗せると30秒のブレイクが
    // 30分の帯になって、オンエア線がそこで止まってしまう。
    node.dataset.dur = String(item.種別 === 'CM' ? 0 : (item.尺 ?? 0));

    const time = el('div', 'row__time');
    const { h, m } = fmtTime(item.開始時刻);
    time.append(el('span', 't-h', h), el('span', 't-sep', '.'), el('span', 't-m', m));
    node.append(time);

    const body = el('div', 'row__body');

    if (item.種別 === '番組') {
      const prog = progById.get(item.番組id);
      if (!prog) continue;
      const hit = el('button', 'hit');
      hit.type = 'button';
      const p = el('p', 'prog');
      p.append(el('b', 'prog__title', prog.タイトル));
      if (item.サブタイトル) p.append(el('span', 'prog__sub', item.サブタイトル));
      p.append(el('span', 'prog__desc', item.今回の内容 ?? ''));
      if (item.ゲスト?.length) p.append(el('span', 'prog__cast', `　ゲスト＝${item.ゲスト.join('、')}`));
      hit.append(p);
      hit.setAttribute('aria-label', `${prog.タイトル}　この回の内容を開く`);
      hit.addEventListener('click', () => openPanel('番組／この回', 番組面(prog, item, station, 媒体)));
      body.append(hit);
      if (item.PT?.['素材id[]']?.length) body.append(marksNode(item.PT['素材id[]'], station, 'ＰＴ'));
    } else if (item.種別 === 'CM') {
      node.classList.add('row--cm');
      body.append(marksNode(item['素材id[]'], station, item['SB/PT'] ?? 'ＳＢ'));
    } else {
      node.classList.add('row--rest');
      const p = el('p', 'prog');
      p.append(el('b', 'prog__title', item.タイトル ?? '放送休止（カラーバー）'));
      p.append(el('span', 'prog__desc', `${item.尺}分`));
      body.append(p);
    }

    node.append(body);
    rows.push(node);
    sheet.append(node);
  }
  return rows;
}

/* ---------- オンエア線 ---------- */

/** 波ごとに1本ずつ引く。時計は同じものを見ている。 */
function 線を引く(波たち, day) {
  if (!波たち.length) return;
  let 前の分 = -1;

  const tick = () => {
    const now = nowJST();
    if (now.date !== day.日付) {
      for (const w of 波たち) w.line.hidden = true;
      if (!document.hidden) location.reload();
      return;
    }
    if (now.minutes === 前の分) return;
    前の分 = now.minutes;

    for (const { sheet, line, clock, rows } of 波たち) {
      const sheetTop = sheet.getBoundingClientRect().top + window.scrollY;
      let y = null;
      for (const r of rows) {
        const s = Number(r.dataset.start);
        const d = Number(r.dataset.dur) || 0;
        r.classList.remove('row--now');
        if (d > 0 && now.minutes >= s && now.minutes < s + d) {
          const box = r.getBoundingClientRect();
          const top = box.top + window.scrollY - sheetTop;
          y = top + (box.height * (now.minutes - s)) / d;
          r.classList.add('row--now');
        }
      }
      if (y == null) {
        const 過ぎた = rows.filter((r) => Number(r.dataset.start) <= now.minutes);
        const last = 過ぎた[過ぎた.length - 1];
        if (!last) {
          line.hidden = true;
          continue;
        }
        const box = last.getBoundingClientRect();
        y = box.bottom + window.scrollY - sheetTop;
      }
      line.hidden = false;
      line.style.transform = `translateY(${Math.round(y)}px)`;
      clock.textContent = now.label;
    }
  };

  tick();
  setInterval(tick, 5000);
  const 引き直す = () => {
    前の分 = -1;
    tick();
  };
  window.addEventListener('resize', 引き直す);
  window.addEventListener('load', 引き直す);
}

/* ---------- 各面 ---------- */

async function pageIndex() {
  const index = await json('data/index.json');
  const now = nowJST();
  const 指定 = new URLSearchParams(location.search).get('date');
  const 日付 = index.days.includes(指定)
    ? 指定
    : index.days.includes(now.date)
      ? now.date
      : index.days[index.days.length - 1];
  const [station, day] = await Promise.all([json('data/station.json'), json(`data/days/${日付}.json`)]);

  $('#masthead-date').textContent = 和文日付(日付);
  $('#masthead-sub').textContent =
    日付 === now.date ? '本日の番組表' : `${日付.replace(/-/g, '.')} の紙面（バックナンバー）`;
  document.title = `深夜二時　${和文日付(日付)}の番組表`;

  const 波たち = [];
  const 組む = (媒体, 編成, key) => {
    const wave = $(`#wave-${key}`);
    if (!編成?.length) {
      if (wave) wave.hidden = true;
      return;
    }
    const sheet = $(`#sheet-${key}`);
    for (const c of [...sheet.children]) if (!c.classList.contains('onair')) c.remove();
    const rows = renderGrid(編成, station, sheet, 媒体);
    波たち.push({ sheet, rows, line: $(`#onair-${key}`), clock: $(`#onair-clock-${key}`) });
  };

  組む(TV, day.編成, 'tv');
  組む(RADIO, day.ラジオ編成, 'radio');

  const memo = $('#memo');
  if (day.編成メモ) memo.replaceChildren(el('b', null, '編成メモ'), document.createTextNode(day.編成メモ));
  else memo.hidden = true;

  if (日付 === now.date) 線を引く(波たち, day);
  else for (const w of 波たち) w.line.hidden = true;

  const s = index.station ?? {};
  $('#foot-note').textContent =
    `開局 ${s.開局日}　テレビ ${s.テレビ番組数 ?? '—'}本／ラジオ ${s.ラジオ番組数 ?? '—'}本　` +
    `出演 ${s.人物数 ?? '—'}名　スポンサー ${s.スポンサー数}社　CM素材 ${s.CM素材数}本`;
}

async function pageArchive() {
  const index = await json('data/index.json');
  const root = $('#article');
  root.replaceChildren();
  const byMonth = new Map();
  for (const d of [...index.days].reverse()) {
    const key = d.slice(0, 7);
    if (!byMonth.has(key)) byMonth.set(key, []);
    byMonth.get(key).push(d);
  }
  for (const [month, days] of byMonth) {
    const [y, m] = month.split('-').map(Number);
    root.append(el('h2', 'headline', `${y}年${m}月`));
    const ul = el('ul', 'list');
    for (const d of days) {
      const li = el('li');
      const a = el('a');
      a.href = `index.html?date=${d}`;
      a.style.display = 'contents';
      const key = el('div', 'list__key', d.replace(/-/g, '.'));
      key.append(el('small', null, `（${曜日of(d)}）`));
      a.append(key, el('div', 'list__val', '番組表'));
      li.append(a);
      ul.append(li);
    }
    root.append(ul);
  }
  if (!index.days.length) root.append(el('p', 'loading', '過去の紙面はまだありません'));
}

async function pageMeetings() {
  const index = await json('data/index.json');
  const root = $('#article');
  root.replaceChildren();
  const list = [...index.meetings].reverse();
  if (!list.length) {
    root.append(el('p', 'loading', '議事録はまだありません'));
    return;
  }
  const 本文 = await Promise.all(list.map((d) => json(`data/meetings/${d}.json`)));
  for (const m of 本文) {
    const h = el('h2', 'headline', `${和文日付(m.日付)}　編成会議`);
    if (m.大改編) h.append(el('span', 'tag tag--red', '大改編'));
    else if (m.種別) h.append(el('span', 'tag', m.種別));
    root.append(h);

    const 概要 = [];
    if (m.打ち切り?.length) 概要.push(`打ち切り ${m.打ち切り.length}本`);
    if (m.新番組?.length) 概要.push(`新番組 ${m.新番組.length}本`);
    if (m.新規スポンサー?.length) 概要.push(`新規スポンサー ${m.新規スポンサー.length}社`);
    if (概要.length) root.append(el('p', 'lede', 概要.join('　／　')));

    root.append(el('div', 'minutes', m.議事録));
  }
}

async function pageSponsors() {
  const station = await json('data/station.json');
  const root = $('#article');
  root.replaceChildren();
  const progById = new Map(station.番組.map((p) => [p.id, p]));

  for (const s of station.スポンサー) {
    const h = el('h2', 'headline', s.社名);
    h.append(el('span', 'tag', `予算${s.予算規模}`));
    for (const w of s.出稿方針?.媒体 ?? [TV]) h.append(el('span', 'tag', w));
    root.append(h);
    root.append(
      el('p', 'lede',
        `${s.業種}　初出稿 ${s.初出稿日}　` +
          `希望時間帯＝${(s.出稿方針?.時間帯 ?? []).join('・')}　` +
          `希望ジャンル＝${(s.出稿方針?.ジャンル ?? []).join('・')}` +
          (s.出稿方針?.備考 ? `\n${s.出稿方針.備考}` : '')),
    );

    const 素材 = station.CM素材.filter((c) => c.スポンサーid === s.id);
    const ul = el('ul', 'list');
    for (const c of 素材) {
      const li = el('li');
      const key = el('div', 'list__key', c.略号);
      key.append(el('small', null, `${媒体of(c)}／${c.尺}秒`));
      const val = el('div', 'list__val');
      const b = el('button', 'hit');
      b.type = 'button';
      b.append(el('b', 'prog__title', c.商品名));
      if (c.新在 === '新') b.append(el('span', 'tag tag--red', '新'));
      b.addEventListener('click', () => openPanel('ＣＭ素材／構成案', CM面(c, s)));
      val.append(b);
      li.append(key, val);
      ul.append(li);
    }
    if (!素材.length) ul.append(el('li', null, '（素材なし）'));
    root.append(ul);

    const 提供 = (s.提供番組id ?? []).map((id) => progById.get(id)).filter(Boolean);
    if (提供.length) {
      root.append(
        el('p', 'lede',
          `提供番組　${提供.map((p) => p.タイトル + (p.ステータス === '打ち切り' ? '（終了）' : '')).join('、')}`),
      );
    }
  }
}

async function pageCast() {
  const station = await json('data/station.json');
  const root = $('#article');
  root.replaceChildren();
  const 人物 = station.人物 ?? [];
  if (!人物.length) {
    root.append(el('p', 'loading', '名鑑はまだありません'));
    return;
  }

  const 局員 = 人物.filter((h) => h.所属 === '局員');
  const 外 = 人物.filter((h) => h.所属 !== '局員');

  const 並べる = (見出し, 一覧, 説明) => {
    root.append(el('h2', 'headline', 見出し));
    if (説明) root.append(el('p', 'lede', 説明));
    const ul = el('ul', 'list');
    for (const h of 一覧) {
      const li = el('li');
      const key = el('div', 'list__key');
      const b = el('button', 'hit');
      b.type = 'button';
      b.append(el('b', 'prog__title', h.氏名));
      b.addEventListener('click', () => openPanel('人物', 人物面(h, station)));
      key.append(b);
      key.append(el('small', null, h.よみ));

      const 番組 = (h.担当番組id ?? [])
        .map((id) => station.番組.find((p) => p.id === id))
        .filter(Boolean);
      const val = el('div', 'list__val');
      val.append(document.createTextNode(`${h.肩書}　`));
      val.append(
        document.createTextNode(番組.length ? 番組.map((p) => p.タイトル).join('、') : '（担当番組なし）'),
      );
      li.append(key, val);
      ul.append(li);
    }
    root.append(ul);
  };

  並べる('局員', 局員, '編成会議に出てくるのはこの人たち。画面や電波に出ている者もいる。');
  並べる('出演者', 外, `フリー・劇団・一門ほか ${外.length}名。`);
}

/* ---------- 起動 ---------- */

const pages = {
  index: pageIndex,
  archive: pageArchive,
  meetings: pageMeetings,
  sponsors: pageSponsors,
  cast: pageCast,
};

initPanel();
const page = document.body.dataset.page;
pages[page]?.().catch((e) => {
  const box = $('#article') ?? $('#sheet-tv');
  if (box) box.replaceChildren(el('p', 'loading', e.message));
  console.error(e);
});
