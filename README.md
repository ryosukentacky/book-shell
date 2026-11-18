# 読書学習ライブラリ（GitHub Pages用・フラット構成）

## 修正点
すべてのファイルを同じ階層に置く構成です。HTML・CSS・JavaScript・JSON・PDFの参照パスを一致させました。

## GitHubにアップロード
1. ZIPをWindowsで「すべて展開」します。
2. GitHubのリポジトリで Add file → Upload files を選び、展開後の **8ファイルすべて** を選んでアップロードします。ZIPそのものはアップロードしません。
3. 以前アップロードした同名ファイルは上書きしてください。
4. Settings → Pages で main / (root) を公開します。
5. 反映後、公開URLで Ctrl+Shift+R を押します。

## 本を追加
Python と PyMuPDF を用意し、`pip install pymupdf` のあと `python add_book.py "次の本.pdf" "本のタイトル"` を実行します。生成された book-XXX.pdf、book-XXX.json、更新された index.json をGitHubへアップロードしてください。

## 注意
書籍PDFの公開には著作権・プライバシーの確認が必要です。GitHub Pagesは原則公開サイトです。PDF内の解説は原本を優先して表示します。全項目の分割と章の大テーマの精査は未完了です。
