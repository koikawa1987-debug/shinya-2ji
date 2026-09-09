import { askJSON } from './anthropic.js';
import { 世界観ルール, CM作法ルール, ラジオCM作法ルール, CM生成プロンプト } from './prompts.js';
import { validateCM, retrying, ナレーション上限 } from './schema.js';
import { addDays } from './time.js';
import { TV, RADIO, CM_LENGTHS } from './config.js';

/** その媒体に素材を出しうるスポンサーだけを渡す */
function 出稿しうる(station, 媒体) {
  return station.スポンサー.filter((s) => {
    const 波 = s.出稿方針?.媒体;
    return !波 || 波.length === 0 || 波.includes(媒体);
  });
}

/** 新しいCM素材を1本つくる。制約を満たすまで最大3回やり直す。 */
export async function 新CM生成(station, 日付, 媒体 = TV) {
  const 候補 = 出稿しうる(station, 媒体);
  if (!候補.length) throw new Error(`${媒体}に出稿するスポンサーがいません`);

  const スポンサー一覧 = 候補
    .map(
      (s) =>
        `- ${s.id} ${s.社名}（${s.業種}／予算${s.予算規模}）出稿方針: ` +
        `時間帯=${(s.出稿方針?.時間帯 ?? []).join('・')} ` +
        `ジャンル=${(s.出稿方針?.ジャンル ?? []).join('・')} ${s.出稿方針?.備考 ?? ''}`,
    )
    .join('\n');
  const 既存商品 =
    station.CM素材.map((c) => `- ${c.商品名}（${c.略号}／${c.媒体 ?? TV}）`).join('\n') || '（なし）';
  const 略号一覧 = station.CM素材.map((c) => c.略号);
  const スポンサーid一覧 = 候補.map((s) => s.id);

  const cm = await retrying(`CM素材(${媒体})`, 3, async (_i, prev) => {
    const value = await askJSON({
      system: `${世界観ルール}\n\n${媒体 === RADIO ? ラジオCM作法ルール : CM作法ルール}`,
      prompt:
        CM生成プロンプト({
          日付,
          媒体,
          スポンサー一覧,
          既存商品,
          既存略号: 略号一覧.join('、') || '（なし）',
        }) +
        `\n\n参考：${CM_LENGTHS[媒体].map((n) => `${n}秒なら${ナレーション上限(n, 媒体)}字`).join('、')}が上限です。` +
        (prev ? `\n\n## 前回の差し戻し\n${prev.join('\n')}\n直して出し直してください。` : ''),
      maxTokens: 4000,
    });
    value.媒体 = 媒体;
    return { value, errors: validateCM(value, { スポンサーid一覧, 略号一覧 }) };
  });

  return 素材に仕立てる(station, 日付, { ...cm, 媒体 });
}

/** 検証済みの素材に id と使用期間をつける */
export function 素材に仕立てる(station, 日付, 種) {
  const seq = station.CM素材.length + 1;
  return {
    id: `c${String(seq).padStart(3, '0')}`,
    媒体: 種.媒体 ?? TV,
    スポンサーid: 種.スポンサーid,
    商品名: 種.商品名,
    尺: 種.尺,
    略号: 種.略号,
    新在: '新',
    使用期間: 種.使用期間 ?? { 開始: 日付, 終了: addDays(日付, 90) },
    構成案: 種.構成案,
    ナレーション全文: 種.ナレーション全文,
    没案: 種.没案,
  };
}

/** 使用開始から14日たった素材は「在」に落とす。 */
export function 新在の更新(station, 日付) {
  for (const c of station.CM素材) {
    if (c.新在 !== '新') continue;
    const 開始 = c.使用期間?.開始;
    if (開始 && addDays(開始, 14) <= 日付) c.新在 = '在';
  }
}

/**
 * その日どちらの波の素材をつくるか。素材の少ないほうを優先し、
 * 同数ならテレビ。ラジオが痩せたまま放置されないようにする。
 */
export function 今日つくる媒体(station) {
  const 本数 = (媒体) => station.CM素材.filter((c) => (c.媒体 ?? TV) === 媒体).length;
  return 本数(RADIO) < 本数(TV) ? RADIO : TV;
}
