# 読書学習ライブラリ（チャット本文版）

## GitHub Pages公開
ZIPを展開し、`index.html`, `app.js`, `style.css`, `index.json`, `book-001.json` をリポジトリ直下にアップロードします。Settings → Pages → Deploy from a branch → main / (root) を指定してください。

## 追加する本
新しい本のチャット本文をJSON形式にして `book-002.json` を作成し、`index.json` に登録します。章の大テーマは `themes`、項目は `sections` に入れます。各項目には `chapter`, `number`, `title`, `text`, `pages` を設定します。

## 元資料と整形の範囲
この版はPDF 14〜186ページに含まれるNotebookLMチャット解説をWebテキスト化しています。不要な `[1]` 等の参照番号や抽出由来の改行を整理しています。第6章を含め章名・項目名は編集上の整理です。187ページ以降はOCRが乱れた原典引用等のため未収録です。PDFの文字抽出品質に依存するため、一部の不自然な改行や表記が残る可能性があります。
