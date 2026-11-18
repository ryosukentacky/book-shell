# 読書学習ライブラリ（GitHub Pages）

## 公開方法
1. GitHubで新しい公開リポジトリ（例: `reading-library`）を作成します。
2. このフォルダ内の **ファイルとフォルダ** をリポジトリのルートにアップロードします（ZIPそのものではありません）。
3. `Settings` → `Pages` → `Build and deployment` → `Deploy from a branch` → `main` / `(root)` → `Save`。
4. 公開URLは通常 `https://ユーザー名.github.io/reading-library/` です。

## 本を追加する方法
PCにPythonとPyMuPDFをインストールしてください: `pip install pymupdf`

```
python add_book.py "C:\\Books\\次の本.pdf" "次の本のタイトル"
```

`books/` の新規PDF・JSON・更新された `index.json` をGitHubにアップロードしてください。元の書籍は残ります。

## 大事な注意
- PDFに含まれる本文をそのまま公開すると、著作権・プライバシーの問題が起こり得ます。**公開前に公開権限と内容を必ず確認してください。** 個人用でも公開リポジトリでは誰でも閲覧できます。
- 今回のPDFは410ページで、一部ページのテキスト抽出が著しく乱れています。原文はPDFに保存し、Webページの抽出テキストは検索補助用としています。
- 章タイトルは自動抽出した項目の先頭を仮表示しています。正式な章の大テーマを人手で精査して付ける作業は未完了です。
- 質問・回答をHTMLとして完全再現したものではありません。元のPDFをそのまま閲覧する形式です。
- GitHub Pagesにはサーバー上でのPDFアップロード機能はありません。新しい本の追加はPC上のスクリプトとGitHubへのアップロードで行います。
