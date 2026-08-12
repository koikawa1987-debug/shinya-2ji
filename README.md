# 深夜二時 ／ JOZZ-DTV

実在しない放送局「深夜二時」のラテ欄を、毎日自動生成して公開する静的サイト。

深夜帯だけが異様に充実した、経営が不安な独立局。番組・スポンサー・CM素材がひとつの世界として噛み合い、週に一度の編成会議で局が勝手に変化していく。人間の入力は一切いらない。訪問者は読むだけ。

- 番組表は毎朝 05:00 JST に更新
- 編成会議は毎週月曜 04:00 JST（日次より1時間先に走る）
- 3月末と9月末は大改編。打ち切り上限4本・新番組上限4本

## 動かす

### 1. 依存を入れる

```bash
npm install
```

### 2. APIキーを設定する

生成には Claude API のキーが要る。**クライアント側のコードには絶対に置かない。** サーバも持たないので、キーが載るのは手元の環境変数と GitHub Secrets だけ。

PowerShell（そのセッションのみ）:

```powershell
$env:ANTHROPIC_API_KEY = 'sk-ant-...'
```

bash / zsh:

```bash
export ANTHROPIC_API_KEY='sk-ant-...'
```

GitHub Actions では、リポジトリの Settings → Secrets and variables → Actions → New repository secret から `ANTHROPIC_API_KEY` という名前で登録する。ワークフローが参照するのはこれ1本だけ。

### 3. 開局する

`data/station.json` が無ければ、局そのものをつくるところから始まる。

```bash
npm run bootstrap
```

番組16本・スポンサー6社・CM素材4本・開局の編成会議議事録が生成される。
APIキーが設定されていない場合は、同梱の開局データ（`generator/lib/seed-station.json`）で立ち上げる。手元でとりあえず動かしたいときはこれで足りる。

### 4. 今日の紙面をつくる

```bash
npm run daily
```

`data/days/YYYY-MM-DD.json` が書き出され、`docs/data/` に写しが作られる。

| オプション | 意味 |
| --- | --- |
| `--date 2026-08-09` | 放送日を指定する |
| `--force` | 生成済みでも作り直す |
| `--seed <file>` | その日の「回」を LLM ではなくファイルから読む |
| `--no-new-cm` | 新しいCM素材を作らない |

APIキー無しで開局初日の紙面を組み直すなら:

```bash
node generator/daily.js --date 2026-08-08 --seed generator/lib/seed-day-2026-08-08.json --no-new-cm --force
```

### 5. 編成会議を開く

```bash
npm run weekly
```

過去4週の視聴率とスポンサーの出稿状況から、打ち切り・新番組・新規スポンサー・議事録が決まる。

### 6. 点検する

```bash
npm run check
```

API を叩かず、手元のデータが制約を満たしているかだけを見る。ナレーションの文字数、構成案の秒の合計、没案の本数、番組の枠が放送日に収まっているか、日次データの時間軸に穴や重なりがないか、存在しない素材idを参照していないか。

### 7. 紙面を見る

```bash
npm run serve
```

<http://localhost:4649/> が開く。`docs/` をそのまま配るだけなので、GitHub Pages と同じものが見える。

## GitHub Pages

Settings → Pages → Source を「Deploy from a branch」、Branch を `main` / `/docs` にする。
`/data` は `/docs/data` に自動で複製されるので、Pages 側は `docs/` だけ見ればよい。

## 中身

```
docs/            公開ディレクトリ（GitHub Pages）
  index.html     今日のラテ欄
  archive.html   過去の日付一覧
  meetings.html  編成会議アーカイブ
  sponsors.html  スポンサー名鑑
  style.css      紙面
  app.js         組版とオンエア線
  data/          /data の写し（自動生成・手で触らない）
data/
  station.json          局の状態（番組マスタ・スポンサー・CM素材・改編履歴）
  days/YYYY-MM-DD.json  日次の編成結果
  meetings/YYYY-MM-DD.json 編成会議の議事録
generator/
  bootstrap.js   開局処理
  daily.js       毎朝の生成
  weekly.js      月曜の編成会議
  sync.js        /data → /docs/data
  check.js       API を叩かない点検
  serve.js       ローカル確認用の静的サーバ
  lib/           時刻・編成・視聴率・プロンプト・検証・API呼び出し
.github/workflows/
  daily.yml      毎朝 05:00 JST
  weekly.yml     毎週月曜 04:00 JST
```

## つくりの方針

LLM に投げるのは創作部分だけで、編成のロジックはコードで決定論的に処理する。

日次の流れ:

1. `station.json` を読む
2. **コード**：曜日から放送中番組を並べ、タイムテーブルの骨格を作る。空き枠は放送休止（カラーバー）で埋める
3. **LLM**：その日の各番組の回（サブタイトル・今回の内容・ゲスト）。直近3回を渡して繰り返しを避けさせる
4. **LLM**：新しいCM素材を1本。ありえない商品ひとつ、構成案の3列表、ナレーション、没案3本と没理由
5. **コード**：スポンサーの出稿方針に従ってCMブレイクに素材を割り付ける。使用期間切れは自動的に外す
6. **コード**：視聴率をシミュレート（時間帯係数 × ジャンル係数 × 継続週数の減衰 ± 0.8）
7. 書き出してコミット

ナレーションの文字数は尺から逆算して検証する（日本語ナレーションは1秒あたり約6〜7文字。15秒CMなら商品名・法定表示を除いて実質10秒＝66字が上限）。この制約を破った生成は差し戻して作り直させる。構成案の秒の合計が尺と合わない、没案が3本ない、といったものも同じく差し戻す。

CMブレイクの `SB/PT` は、番組内に挟まるものが PT、番組と番組の間が SB。

## 世界観のルール

生成プロンプトに必ず入れているもの。

- 実在の人物名・企業名・番組名は一切使わない。出演者もスポンサーもすべて架空
- 実在の番組を明らかに想起させるタイトルも避ける
- ありえない商品は「ありえないが、CMの作法は完全に正しい」ものにする。バカバカしさは商品側に置き、構成案は真面目に書く
- 局の経営は常にやや苦しい。深夜帯だけが充実している
- 特定の政治的立場・実在の社会的対立を題材にしない

## 断り

この局・番組・出演者・スポンサー・商品はすべて実在しません。
