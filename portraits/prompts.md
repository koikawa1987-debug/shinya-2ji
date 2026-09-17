# 深夜二時 ／ 人物の似顔絵プロンプト

`node generator/portraits.js` で書き出したもの。人物の外見・肩書・道具・癖から組み立てている。

## 使い方

1. 各人のプロンプトを画像生成にかける（1:1・正方形）
2. 出てきた画像を **`docs/portraits/<id>.webp`** として保存する（例：`docs/portraits/h051.webp`）
3. `npm run sync` を走らせてコミットする

置いた人から順に、名鑑と人物面に似顔絵が出る。置いていない人は何も出ない。
絵柄は**新聞のコラムに添えられる似顔絵**。ペンの黒とスクリーントーンの灰だけで、ある程度デフォルメする。
紙面が単色なので、**カラーで作らないこと**。55名が同じ描き手に見えることを優先する。

## 全員に共通する指定

```
stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1
```

### ネガティブ（対応する生成器なら）

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

## 編成部

### 柏木 稔（かしわぎ みのる）— `docs/portraits/h001.webp`

- 五十手前の男性。白髪まじりの短髪、痩せ型。ネクタイを緩めたところを誰も見たことがない。
- 肩書は編成部長（編成部）
- 持ち物：会議に持ち込む紙の束。数字はいつも二枚目に置いてある。
- 癖：会議で数字を出すとき、必ず一度紙をめくり直してから読む。

```
Subject: a Japanese man in their late 40s, programming director at a small regional broadcaster. graying hair, a slim build, a shirt and necktie. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 相良 ゆき（さがら ゆき）— `docs/portraits/h002.webp`

- 三十代前半の女性。短い黒髪に細い銀縁眼鏡。シャツの袖をいつも肘までまくっている。
- 肩書は編成部（編成部）
- 持ち物：新聞社ごとの締切を書いた一覧。机に貼ってある。
- 癖：議事録に「以上。」と書いたあと、必ず一行あけて保存する。

```
Subject: a Japanese woman in their early 30s, programming department clerk at a small regional broadcaster. short black hair, thin silver-rimmed glasses. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 佐分利 いち（さぶり いち）— `docs/portraits/h053.webp`

- 二十代半ばの男性。索引カードの束を持ち、送り先の名前を確かめている。
- 肩書は編成部（編成部）
- 持ち物：新聞社ごとの締切と担当者名を書いた索引カード。相良から譲られたもので、字が二人ぶんある。
- 癖：送信する前に、送る先の名前を三度読む。

```
Subject: a Japanese man in their mid 20s, programming department clerk at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

## 報道部

### 宇治原 千夏（うじはら ちなつ）— `docs/portraits/h006.webp`

- 二十代後半の女性。肩までの髪、地味な紺のジャケット。話す前に喉に手をやる。
- 肩書はアナウンサー（報道部）
- 持ち物：駅の案内放送のころから使っている喉のケア用品。
- 癖：読み間違えると、直したあと一拍おいてから続ける。

```
Subject: a Japanese woman in their late 20s, television news announcer at a small regional broadcaster. shoulder-length hair, a navy jacket. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 笹貫 亮（ささぬき りょう）— `docs/portraits/h007.webp`

- 四十代の男性。日焼けした顔にフィールドジャケット、首からカメラを提げている。
- 肩書は記者（報道部）
- 持ち物：取材車の鍵。局に一台しかない。
- 癖：中継の頭で、必ず足元を一度確かめる。

```
Subject: a Japanese man in their early 40s, field news reporter at a small regional broadcaster. a weathered sun-tanned face. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 菅生 洋次（すごう ようじ）— `docs/portraits/h046.webp`

- 五十代前半の男性。赤鉛筆を握り、原稿を指で追わずに読んでいる。
- 肩書は報道デスク（報道部）
- 持ち物：赤鉛筆。減りが早く、月に三本使う。
- 癖：原稿を読むとき、指で行を追わない。

```
Subject: a Japanese man in their early 50s, news desk editor at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 神無月 詩織（かんなづき しおり）— `docs/portraits/h051.webp`

- 四十代前半の女性。落ち着いた品のある装い。局名をテープで隠したストップウォッチを持つ。
- 肩書は看板アナウンサー（報道部）
- 持ち物：在京局の局名が入ったままのストップウォッチ。テープで局名を隠して使っている。
- 癖：本番前に必ず一度、床の同じ場所を靴の先で確かめる。在京時代のスタジオの癖が抜けていない。

```
Subject: a Japanese woman in their early 40s, veteran lead announcer at a small regional broadcaster. quiet well-cut formal clothes. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 恵良 みちる（えら みちる）— `docs/portraits/h052.webp`

- 二十代前半の女性。真新しい紺のジャケット。使われなかった原稿の綴りを抱えている。
- 肩書はアナウンサー（研修中）（報道部）
- 持ち物：使われなかった原稿の綴り。日付順に全部とってある。
- 癖：練習でも、読み終わると必ず一礼する。無人のスタジオに向かって。

```
Subject: a Japanese woman in their early 20s, trainee announcer at a small regional broadcaster. a navy jacket. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

## 制作部

### 唐木田 節（からきだ せつ）— `docs/portraits/h004.webp`

- 四十代の男性。無精髭に作業ベスト。首にヘッドホンを掛けたまま会議に出る。
- 肩書は制作／語り（制作部）
- 持ち物：録音メモの束。企画書より厚い。
- 癖：音のいい場所を見つけると、用がなくても三分は黙って立っている。

```
Subject: a Japanese man in their early 40s, documentary producer and narrator at a small regional broadcaster. stubble, a utility work vest. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 岨手 洋一（そで よういち）— `docs/portraits/h038.webp`

- 四十代半ばの男性。年季の入った三脚のそば。レンズは拭かない。
- 肩書はカメラ（制作部）
- 持ち物：十二年使っている三脚。雲台の動きが渋く、それが画のゆっくりさを作っている。
- 癖：本番前にレンズを拭かない。拭くと落ち着かなくなると言う。

```
Subject: a Japanese man in their mid 40s, television cameraman at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 鰐渕 ほのか（わにぶち ほのか）— `docs/portraits/h039.webp`

- 三十代後半の女性。色温度計を手に、スタジオの天井を見上げている。
- 肩書は照明（制作部）
- 持ち物：色温度計。局の備品だが、実質この人しか使わない。
- 癖：スタジオに入ると、まず天井を見上げてから床を見る。

```
Subject: a Japanese woman in their late 30s, lighting technician at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 手島 権三（てしま ごんぞう）— `docs/portraits/h040.webp`

- 六十代の男性。作業着に自前の鉋。組んだセットを手のひらで押している。
- 肩書は美術・大道具（制作部）
- 持ち物：自前の鉋。局の予算で買った工具は一度も使っていない。
- 癖：組んだセットを最後に一度、手のひらで押して確かめる。

```
Subject: a Japanese man in their early 60s, set carpenter at a small regional broadcaster. plain work clothes. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 宿谷 まゆ（しゅくや まゆ）— `docs/portraits/h041.webp`

- 二十代後半の女性。編集卓の前。色分けしたラベルをテープに貼っている。
- 肩書は編集（制作部）
- 持ち物：使い回しのテープに貼る、色分けしたラベル。自費で買っている。
- 癖：カットを決める前に、必ず一度全体を等速で通して見る。

```
Subject: a Japanese woman in their late 20s, video editor at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 波々伯部 巧（ほうかべ たくみ）— `docs/portraits/h047.webp`

- 二十代前半の男性。明らかに寝ていない顔。三色ボールペンと、胸の高さで持った台本。
- 肩書は制作進行（制作部）
- 持ち物：三色のボールペン。青が最初に切れる。
- 癖：台本を持つ手を、必ず胸の高さで止める。

```
Subject: a Japanese man in their early 20s, production assistant at a small regional broadcaster. visibly exhausted, shadows under the eyes. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 十時 みのり（ととき みのり）— `docs/portraits/h050.webp`

- 二十代前半の女性。学生風の身なりで、番組表を貼ったノートを抱えている。
- 肩書はアルバイト（制作部）
- 持ち物：番組表を貼ったノート。放送された回の内容を自分でメモしている。
- 癖：頼まれた用件を、その場で必ず復唱する。

```
Subject: a Japanese woman in their early 20s, student part-timer at a small regional broadcaster. plain student clothes. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

## 技術部

### 網代 ふゆ（あじろ ふゆ）— `docs/portraits/h005.webp`

- 三十代後半の女性。髪を後ろで束ね、作業着の上に受付用の上着を羽織っている。
- 肩書は技術／受付（技術部）
- 持ち物：前夜に仕込む盤の順を書いた紙。翌朝には捨てる。
- 癖：本番中でも、機材の音が変わると話の途中で天井を見る。

```
Subject: a Japanese woman in their late 30s, broadcast engineer at a small regional broadcaster. hair tied back, plain work clothes. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 百目鬼 慎（どうめき しん）— `docs/portraits/h035.webp`

- 五十代後半の男性。送出卓の前。両手を一度ひざで拭いてから座る。
- 肩書は送出（夜勤）（技術部）
- 持ち物：前の局から持ってきた自前のストップウォッチ。局の備品より三秒早く止まる癖があり、それを見越して使っている。
- 癖：送出卓の前に座る前、必ず両手を一度ひざで拭く。

```
Subject: a Japanese man in their late 50s, master control operator on night shift at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 苫米地 累（とまべち るい）— `docs/portraits/h036.webp`

- 二十代半ばの男性。若い顔にヘッドホン。片側の音が小さいまま使っている。
- 肩書は送出（日勤）（技術部）
- 持ち物：百目鬼から譲られた予備のヘッドホン。片側の音が小さいままで使っている。
- 癖：番組が終わる十秒前から、口の中で秒を数える。

```
Subject: a Japanese man in their mid 20s, master control operator at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 膳所 なつき（ぜぜ なつき）— `docs/portraits/h037.webp`

- 三十代前半の女性。ガンマイクを担ぎ、もう一方の手をフェーダーから離さない。
- 肩書は音声（技術部）
- 持ち物：自前のガンマイク。局の備品では拾えない距離があるという理由で、申請せずに使っている。
- 癖：無音の場面でフェーダーから手を離さない。

```
Subject: a Japanese woman in their early 30s, sound engineer at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 沼田尻 廉（ぬまたじり れん）— `docs/portraits/h048.webp`

- 六十代半ばの男性。作業帽。送信所の空中線を見上げる姿勢。
- 肩書はラジオ技術（技術部）
- 持ち物：三年間つけ続けた点検の記録帳。停波中の欄も空白になっていない。
- 癖：送信所に着くと、建物に入る前に空中線を見上げる。

```
Subject: a Japanese man in their mid 60s, radio transmitter engineer at a small regional broadcaster. a work cap and work clothes. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

## 営業部

### 都筑 剛（つづき つよし）— `docs/portraits/h003.webp`

- 五十代の男性。恰幅がよく角刈り。紺のスーツを何着も同じ型で持っている。
- 肩書は営業部長（営業部）
- 持ち物：出稿先ごとの年間予算表。手帳に挟んで持ち歩いている。
- 癖：反論されると、まず「おっしゃるとおりです」と言ってから数字を出す。

```
Subject: a Japanese man in their early 50s, advertising sales director at a small regional broadcaster. close-cropped hair, a heavy build, a dark suit. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 梶尾 拓（かじお たく）— `docs/portraits/h045.webp`

- 二十代後半の男性。スーツに鞄。書き込みだらけの県内地図を持ち歩く。
- 肩書は営業（営業部）
- 持ち物：県内の事業所を書き込んだ地図。訪ねた先に日付を入れている。
- 癖：断られた帰り、必ずその会社の前で一度振り返る。

```
Subject: a Japanese man in their late 20s, advertising sales representative at a small regional broadcaster. a dark suit. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 鴇田 すみれ（ときた すみれ）— `docs/portraits/h054.webp`

- 二十代後半の女性。書類を裏返して枚数を確かめる手つき。机がよく片づいている。
- 肩書は営業事務（営業部）
- 持ち物：差し戻しの理由を分類した自作の一覧。梶尾がこっそり写しを持っている。
- 癖：書類を受け取ると、まず裏返して枚数を確かめる。

```
Subject: a Japanese woman in their late 20s, sales office administrator at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

## 総務部

### 御調 静子（みつぎ しずこ）— `docs/portraits/h042.webp`

- 五十代前半の女性。きちんとした装いに赤鉛筆。付箋を黄と青で使い分ける。
- 肩書は考査（総務部）
- 持ち物：付箋。没にした案には黄、条件付きで通した案には青を貼る。青のほうが減りが早い。
- 癖：書類に赤を入れるとき、消せる筆記具を使わない。

```
Subject: a Japanese woman in their early 50s, broadcast standards reviewer at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 轟 妙子（とどろき たえこ）— `docs/portraits/h043.webp`

- 四十代後半の女性。電卓と手書きの月次表。数字が合わないと天井を見る。
- 肩書は経理（総務部）
- 持ち物：手書きの月次表。会計ソフトの出力とは別に、自分用のものを付けている。
- 癖：数字が合わないとき、電卓を打ち直す前に一度天井を見る。

```
Subject: a Japanese woman in their late 40s, accountant at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 生駒 ちさと（いこま ちさと）— `docs/portraits/h044.webp`

- 三十代前半の女性。受付席で記録簿を開き、受話器を耳から離さずにいる。
- 肩書は総務・受付（総務部）
- 持ち物：問い合わせの記録簿。開局初日から一件も抜かさずに付けている。
- 癖：電話を切ったあと、相手が切るまで受話器を耳から離さない。

```
Subject: a Japanese woman in their early 30s, front desk receptionist at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 禿 芳雄（かむろ よしお）— `docs/portraits/h049.webp`

- 七十代前半の男性。警備服。巡回の判子を同じ位置に押す手。
- 肩書は夜間警備（総務部）
- 持ち物：巡回の判子。押す位置が毎回ぴたりと同じ。
- 癖：巡回の折り返し地点で、必ず同じ窓から外を見る。

```
Subject: a Japanese man in their early 70s, night security guard at a small regional broadcaster. a security guard uniform. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

## 外部

### 篠塚 玲二（しのづか れいじ）— `docs/portraits/h008.webp`

- 五十代の男性。声の通りそうな体格に明るい色のシャツ、腕まくり。
- 肩書は実演販売（外部）
- 持ち物：催事場のころから使っている呼び込み用のマイク。局の備品は使わない。
- 癖：売れないときほど声を落とす。

```
Subject: a Japanese man in their early 50s, in-studio product demonstrator at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 郡司 あさひ（ぐんじ あさひ）— `docs/portraits/h009.webp`

- 二十代半ばの女性。ショートカットに劇団のTシャツ。姿勢がまっすぐ。
- 肩書はアシスタント（外部）
- 持ち物：劇団の台本。局の控室でいつも読んでいる。
- 癖：商品を置くとき、必ず角を揃える。

```
Subject: a Japanese woman in their mid 20s, programme assistant at a small regional broadcaster. short cropped hair, a plain t-shirt. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 樋渡 邦夫（ひわたし くにお）— `docs/portraits/h010.webp`

- 六十代の男性。白髪にエプロン、白手袋。手だけが妙に若い。
- 肩書は実演販売（外部）
- 持ち物：三十年使っている手袋。商品を持つとき必ずはめる。
- 癖：説明に詰まると、商品をいったん置いて両手を見せる。

```
Subject: a Japanese man in their early 60s, in-studio product demonstrator at a small regional broadcaster. white hair, an apron. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 小手川 みさ（こてがわ みさ）— `docs/portraits/h011.webp`

- 四十代後半の女性。髪をきっちり結い、指先が速そうな手をしている。
- 肩書は実演販売（外部）
- 持ち物：在庫表。台本より先に見る。
- 癖：注文が入ると、言葉を切らずに指だけで数を示す。

```
Subject: a Japanese woman in their late 40s, in-studio product demonstrator at a small regional broadcaster. hair tied back. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 黒滝 悠（くろたき ゆう）— `docs/portraits/h012.webp`

- 六十代半ばの男性。丸眼鏡に開襟シャツ。指先にレコードの縁の跡がある。
- 肩書は選盤・進行（外部）
- 持ち物：店の在庫台帳。廃業したあとも手放していない。
- 癖：盤を置く前に、必ず一度息を吹きかける。

```
Subject: a Japanese man in their mid 60s, record librarian and presenter at a small regional broadcaster. round glasses, an open-collar shirt. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 戸山 かなえ（とやま かなえ）— `docs/portraits/h013.webp`

- 三十代後半の女性。長い髪をひとつに束ね、綿のシャツ。厚い台帳を抱えている。
- 肩書は選盤（外部）
- 持ち物：テレビとラジオで同じ盤をかけないための台帳。
- 癖：かけた盤の枚数を、番組の終わりに小声で数える。

```
Subject: a Japanese woman in their late 30s, record librarian at a small regional broadcaster. long hair, a plain cotton shirt. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 半田 かける（はんだ かける）— `docs/portraits/h014.webp`

- 三十代前半の男性。眼鏡。血の気の引いた顔で、回転椅子に座ったまま。
- 肩書は出演（外部）
- 持ち物：書店員のころの値札シール。財布に一枚入っている。
- 癖：気分が悪くなると話が異様に速くなる。

```
Subject: a Japanese man in their early 30s, late-night television personality at a small regional broadcaster. plain glasses, a pale, drained complexion. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 鵜殿 ちよ（うどの ちよ）— `docs/portraits/h015.webp`

- 二十代後半の女性。前髪が長く目にかかる。笑うと先に肩が上がる。
- 肩書は出演（外部）
- 持ち物：はがきを書いていたころの万年筆。
- 癖：笑うとき、口より先に肩が動く。

```
Subject: a Japanese woman in their late 20s, late-night television personality at a small regional broadcaster. long fringe falling over the eyes. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 沖永 タケシ（おきなが たけし）— `docs/portraits/h016.webp`

- 四十代の男性。日焼けした肌に、案内係だったころの姿勢が残っている。
- 肩書は出演（外部）
- 持ち物：遊園地時代の名札。理由は言わずに持っている。
- 癖：相手の話が長いと、聞きながら椅子の高さを直す。

```
Subject: a Japanese man in their early 40s, late-night television personality at a small regional broadcaster. a weathered sun-tanned face. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 嶺岸 志乃（みねぎし しの）— `docs/portraits/h017.webp`

- 四十代後半の女性。事務服が板についている。髪をまとめ、伝票を手にしている。
- 肩書は俳優（外部）
- 持ち物：実際に取得した経理の資格証。小道具の監修に使う。
- 癖：台詞のない場面でも、手元の伝票を最後まできちんと繰る。

```
Subject: a Japanese woman in their late 40s, stage actor at a small regional broadcaster. hair tied back, an office uniform. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 袴田 たもつ（はかまだ たもつ）— `docs/portraits/h018.webp`

- 五十代後半の男性。白髪、老眼鏡を額に上げ、窓の外を見ている。
- 肩書は俳優（外部）
- 持ち物：窓際の席に置いてある湯呑み。私物。
- 癖：窓の外を見る芝居のとき、本当に天気を見ている。

```
Subject: a Japanese man in their late 50s, stage actor at a small regional broadcaster. white hair, reading glasses pushed up on the forehead. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 由良 ちひろ（ゆら ちひろ）— `docs/portraits/h019.webp`

- 二十代前半の女性。硬い表情。指に指サックをはめたまま。
- 肩書は俳優（外部）
- 持ち物：伝票の音を立てないための指サック。
- 癖：本番前に必ず指を温める。

```
Subject: a Japanese woman in their early 20s, stage actor at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 立花家 みどり（たちばなや みどり）— `docs/portraits/h020.webp`

- 四十代の女性。和装。扇子を膝に置いた高座の姿勢。
- 肩書は落語家（外部）
- 持ち物：高座に上がる前に置く扇子。局には持ち込まない予備がある。
- 癖：高座に上がる前、袖で一度だけ客席の数を数える。

```
Subject: a Japanese woman in their early 40s, rakugo storyteller in kimono at a small regional broadcaster. a traditional kimono. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 桃園亭 かん平（とうえんてい かんぺい）— `docs/portraits/h021.webp`

- 三十代前半の男性。和装だがまだ着慣れていない。愛想のいい笑顔。
- 肩書は落語家（外部）
- 持ち物：客席の入りを数えるための、袖に置いた手帳。
- 癖：受けなかったときほど、丁寧に礼をする。

```
Subject: a Japanese man in their early 30s, rakugo storyteller in kimono at a small regional broadcaster. a traditional kimono. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 久我山 澪（くがやま みお）— `docs/portraits/h022.webp`

- 六十代の男性。蝶ネクタイに白髪。上着に古い映写室の匂いが残っていそう。
- 肩書は映画解説（外部）
- 持ち物：名画座時代の上映記録。フィルムの傷の位置まで書いてある。
- 癖：解説の最後に、必ず上映時間を言い直す。

```
Subject: a Japanese man in their early 60s, film commentator at a small regional broadcaster. white hair, a bow tie. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 柚木 ぬい（ゆのき ぬい）— `docs/portraits/h023.webp`

- 四十代の女性。和風の落ち着いた装い。湯呑みに手を添えている。
- 肩書は出演（外部）
- 持ち物：沈黙のあいだ位置を直す湯呑み。局の備品ではない。
- 癖：沈黙が三十秒を超えると、湯呑みの位置を少しだけ直す。

```
Subject: a Japanese woman in their early 40s, late-night television personality at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 矢車 とおる（やぐるま とおる）— `docs/portraits/h024.webp`

- 四十代後半の男性。疲れた顔。ペンを持ったまま台本の裏を見ている。
- 肩書は出演（外部）
- 持ち物：台本の裏。行き詰まると必ずそこに何か書く。
- 癖：話が行き詰まると、台本の裏に何か書いてから顔を上げる。

```
Subject: a Japanese man in their late 40s, late-night television personality at a small regional broadcaster. visibly exhausted, shadows under the eyes. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 西野入 かほ（にしのいり かほ）— `docs/portraits/h025.webp`

- 三十代前半の女性。明るい表情で進行表を持つ。腕時計をしていない。
- 肩書は出演（外部）
- 持ち物：腕時計。番組中は一度も見ない。
- 癖：時計を見ないで残り時間を当てる。ほぼ当たる。

```
Subject: a Japanese woman in their early 30s, late-night television personality at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 更科 とし子（さらしな としこ）— `docs/portraits/h026.webp`

- 五十代後半の女性。作業ジャンパー。書き込みで黒くなった道路図を広げている。
- 肩書は交通情報（外部）
- 持ち物：運行管理のころから使っている県内の道路図。書き込みで黒い。
- 癖：渋滞の距離を言うとき、必ず起点も言い直す。

```
Subject: a Japanese woman in their late 50s, radio traffic reporter at a small regional broadcaster. plain work clothes. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 布施 ヒロ（ふせ ひろ）— `docs/portraits/h027.webp`

- 四十代の男性。ヘッドホンを片耳だけ外し、柔らかい表情でマイクに向かう。
- 肩書はパーソナリティ（外部）
- 持ち物：三年前に用意したまま使わなかった番組ノート。一ページ目だけ古い。
- 癖：曲を紹介したあと、一度だけ息を吸う音が入る。

```
Subject: a Japanese man in their early 40s, radio host at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 山鹿 いさむ（やまが いさむ）— `docs/portraits/h028.webp`

- 三十代後半の男性。マイクの前で手が動いている。絵がないのに身振りが出る。
- 肩書は通販進行（外部）
- 持ち物：色を言い換えるための語彙帳。自分で作った。
- 癖：色を説明するとき、必ず身近な物にたとえる。

```
Subject: a Japanese man in their late 30s, radio shopping programme host at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 鹿野 すず（かの すず）— `docs/portraits/h029.webp`

- 五十代の女性。落ち着いた装い。本を閉じずに伏せて持っている。
- 肩書は朗読（外部）
- 持ち物：伏せて置くための布。本を閉じないための道具。
- 癖：章の切れ目で、本を閉じずに伏せる。

```
Subject: a Japanese woman in their early 50s, radio reader at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 樽見 えい子（たるみ えいこ）— `docs/portraits/h030.webp`

- 四十代後半の女性。カーディガンに、貸出の少ない本を数冊抱えている。
- 肩書は司書（外部）
- 持ち物：貸出の少ない本のリスト。毎月自分で作っている。
- 癖：本の話をする前に、必ず請求記号から言う。

```
Subject: a Japanese woman in their late 40s, public librarian at a small regional broadcaster. a cardigan. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 逢坂 かん（おうさか かん）— `docs/portraits/h031.webp`

- 三十代後半の男性。使えなくなった無線機の受けを机に置き、地図を見ている。
- 肩書は交通情報（外部）
- 持ち物：配車係のころの無線の受け。もう使えないが机に置いてある。
- 癖：渋滞が解けると、報告のあとに短く「よかったですね」と言う。

```
Subject: a Japanese man in their late 30s, radio traffic reporter at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 三雲 レイ（みくも れい）— `docs/portraits/h032.webp`

- 四十代の男性。暗いスタジオでマイクに向かい、目を閉じている。
- 肩書はパーソナリティ（外部）
- 持ち物：曲の終わり二秒を計るための、秒針のある古い時計。
- 癖：曲が終わる二秒前からマイクを開ける。

```
Subject: a Japanese man in their early 40s, radio host at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 小夜 ふみ（さよ ふみ）— `docs/portraits/h033.webp`

- 三十代後半の女性。眼鏡に資料の束。索引だけできた辞書を抱えている。
- 肩書は講師（外部）
- 持ち物：未完成の辞書。索引だけ先にできている。
- 癖：発音の見本を出すとき、二回目は必ず少しゆっくり言う。

```
Subject: a Japanese woman in their late 30s, language lecturer at a small regional broadcaster. plain glasses. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 春木 とおる（はるき とおる）— `docs/portraits/h034.webp`

- 六十代の男性。穏やかな顔で受話器を持っている。メモ用紙は自前。
- 肩書はパーソナリティ（外部）
- 持ち物：電話相談のころのメモ用紙。局に持ち込んで使っている。
- 癖：相談の途中で、一度だけ相手の言葉をそのまま繰り返す。

```
Subject: a Japanese man in their early 60s, radio host at a small regional broadcaster.  stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>

### 御手洗 万作（みたらい まんさく）— `docs/portraits/h055.webp`

- 七十代前半の男性。白髪。マイクの前で、話し終わりに半拍の間を置く。
- 肩書はパーソナリティ（外部）
- 持ち物：四十年ぶんの放送日誌。段ボール九箱ぶんあり、局の倉庫に置かせてもらっている。
- 癖：話し終わりに、必ず半拍の間を置いてから曲を出す。四十年変わっていない。

```
Subject: a Japanese man in their early 70s, radio host at a small regional broadcaster. white hair. stylized caricature portrait illustration in the style of a Japanese newspaper column sketch, moderately deformed proportions: head slightly large for the body, simplified features, but the personality clearly readable in the face, confident black brush-pen and fine pen linework, flat gray screentone shading with visible halftone dots, monochrome only — black ink and grays on off-white paper, no color at all, tight head-and-shoulders, the face fills most of the frame, centered, facing the viewer, a subtle characteristic expression, completely plain empty off-white background, no room, no furniture, no equipment, no props of any kind, the same illustrator and the same drawing style for every portrait in a series, absolutely no text anywhere in the image, no signature, square 1:1.
```

<details><summary>ネガティブ</summary>

```
text, letters, japanese characters, kanji, signage, name plates, captions, speech bubbles, logos, brand names, station call letters, broadcaster names, trademarks, watermark, signature, microphones, headphones, stopwatches, clocks, tape machines, studio equipment, desks, papers, room interior, background objects, scenery, busy background, color, saturated colors, colored pencil, watercolor wash, photorealistic, photograph, 3d render, cgi, glossy digital painting, anime eyes, chibi, super-deformed, cute mascot style, western cartoon, multiple people, full body, wide shot, hands visible
```

</details>
