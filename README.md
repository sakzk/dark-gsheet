# Dark Sheets

Google スプレッドシート (docs.google.com/spreadsheets) をダークテーマで表示する Chrome 拡張 (Manifest V3)。

## インストール

1. chrome://extensions を開く
2. 右上の「デベロッパー モード」を ON
3. 「パッケージ化されていない拡張機能を読み込む」→ このフォルダ (dark-gsheet) を選択
4. 開いているシートがあれば再読み込み

## 使い方

ツールバーの拡張アイコンをクリックすると設定パネルが開く。変更は開いている全シートに即時反映される。

| 項目 | 内容 |
|---|---|
| テーマ | ダーク / ライト / OS に従う |
| カラーテーマ | デフォルト / Dracula / Tokyo Night / Catppuccin Mocha |
| 明るさ | 反転後の明るさ (60–140%) |
| コントラスト | 100% 未満で黒を濃いグレー寄りに (初期値 90%) |

## 仕組み

- セル領域は canvas 描画のため、CSS filter `invert(1) hue-rotate(180deg)` で明暗のみ反転
- 画像・動画・カラーピッカー・シート上のグラフは再反転して本来の色を保持
- カラーテーマは body の外 (html の疑似要素) に全面オーバーレイを 2 枚置き、lighten (背景色) / darken (文字色) で各チャンネルを [bg, fg] に収める。テーマ追加は settings.js の DGS_THEMES に bg / fg / accent を足すだけ
  - SVG フィルタ (url()) はツールバー等が描画されなくなるため不使用
- 読み込み時の白いちらつき防止のため、設定をページの localStorage にもキャッシュして document_start で適用

## 既知の制限

- セルの背景色・文字色も明暗が反転する (例: 黄色ハイライト → 暗い黄土色)
- セル内に挿入した画像 (IMAGE 関数等) は canvas 内に描画されるため反転されたままになる
- グラフ・カラーピッカーの再反転は Google 側のクラス名に依存しているため、UI 更新で効かなくなる可能性がある (dark.css のセレクタを修正して対応)

## ファイル構成

```
manifest.json
settings.js      共通の初期値
content.js       設定の適用 / OS テーマ追従
dark.css         反転フィルタ
popup/           設定パネル
icons/
```
