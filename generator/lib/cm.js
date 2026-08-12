import { askJSON } from './anthropic.js';
import { 世界観ルール, CM作法ルール, CM生成プロンプト } from './prompts.js';
import { validateCM, retrying, ナレーション上限 } from './schema.js';
import { addDays } from './time.js';

/** 新しいCM素材を1本つくる。制約を満たすまで最大3回やり直す。 */
export async function 新CM生成(station, 日付) {
  const スポンサー一覧 = station.スポンサー
    .map(
      (s) =>
        `- ${s.id} ${s.社名}（${s.業種}／予算${s.予算規模}）出稿方針: ` +
        `時間帯=${(s.出稿方針?.時間帯 ?? []).join('・')} ` +
        `ジャンル=${(s.出稿方針?.ジャンル ?? []).join('・')} ${s.出稿方針?.備考 ?? ''}`,
    )
    .join('\n');
  const 既存商品 = station.CM素材.map((c) => `- ${c.商品名}（${c.略号}）`).join('\n') || '（なし）';
  const 略号一覧 = station.CM素材.map((c) => c.略号);
  const スポンサーid一覧 = station.スポンサー.map((s) => s.id);

  const cm = await retrying('CM素材', 3, async (_i, prev) => {
    const value = await askJSON({
      system: `${世界観ルール}\n\n${CM作法ルール}`,
      prompt:
        CM生成プロンプト({ 日付, スポンサー一覧, 既存商品 }) +
        `\n\n参考：15秒なら${ナレーション上限(15)}字、30秒なら${ナレーション上限(30)}字が上限です。` +
        (prev ? `\n\n## 前回の差し戻し\n${prev.join('\n')}\n直して出し直してください。` : ''),
      maxTokens: 4000,
    });
    return { value, errors: validateCM(value, { スポンサーid一覧, 略号一覧 }) };
  });

  const seq = station.CM素材.length + 1;
  return {
    id: `c${String(seq).padStart(3, '0')}`,
    スポンサーid: cm.スポンサーid,
    商品名: cm.商品名,
    尺: cm.尺,
    略号: cm.略号,
    新在: '新',
    使用期間: { 開始: 日付, 終了: addDays(日付, 90) },
    構成案: cm.構成案,
    ナレーション全文: cm.ナレーション全文,
    没案: cm.没案,
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
