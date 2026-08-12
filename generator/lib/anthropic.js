import { MODEL } from './config.js';

// SDK は実際に API を叩くときだけ読み込む。
// 同梱データで紙面を組み直すだけなら npm install なしでも動くようにしておく。
let client;
async function getClient() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      'ANTHROPIC_API_KEY が設定されていません。' +
        'ローカルでは環境変数に、GitHub Actions では Secrets に入れてください。',
    );
  }
  if (!client) {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    client = new Anthropic({ apiKey: key });
  }
  return client;
}

export function hasKey() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function extractJSON(text) {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(text);
  const body = fenced ? fenced[1] : text;
  const start = body.search(/[[{]/);
  if (start < 0) throw new Error(`JSON が見つかりません:\n${text.slice(0, 400)}`);
  const open = body[start];
  const close = open === '{' ? '}' : ']';
  const end = body.lastIndexOf(close);
  return JSON.parse(body.slice(start, end + 1));
}

/**
 * JSON だけを返させる呼び出し。assistant の書き出しを固定して前置きを封じる。
 */
export async function askJSON({ system, prompt, prefill = '{', maxTokens = 8000 }) {
  const anthropic = await getClient();
  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [
      { role: 'user', content: prompt },
      { role: 'assistant', content: prefill },
    ],
  });
  const text = prefill + res.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
  try {
    return extractJSON(text);
  } catch (e) {
    throw new Error(`応答の JSON 解析に失敗しました: ${e.message}`);
  }
}

export async function askText({ system, prompt, maxTokens = 4000 }) {
  const anthropic = await getClient();
  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: prompt }],
  });
  return res.content
    .map((b) => (b.type === 'text' ? b.text : ''))
    .join('')
    .trim();
}
