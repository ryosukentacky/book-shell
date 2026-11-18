import fitz,json,re,sys,shutil,unicodedata
from pathlib import Path
root=Path(__file__).parent
if len(sys.argv)<3: raise SystemExit('使い方: python add_book.py "PDFのパス" "書籍タイトル"')
source=Path(sys.argv[1]); title=sys.argv[2]; slug='book-'+str(len(list(root.glob('book-*.json')))+1).zfill(3)
doc=fitz.open(source); pages=[]; sections=[]; current=None
pattern=re.compile(r'第\s*([0-9０-９]+)\s*章\s*([0-9０-９]+)\s*つ目\s*[:：]?\s*(.*)')
for i,p in enumerate(doc):
 text=p.get_text(sort=True)
 pages.append(text)
 m=pattern.search(text[:650])
 if m:
  ch=unicodedata.normalize('NFKC',m.group(1)); num=unicodedata.normalize('NFKC',m.group(2)); rest=m.group(3).split('\n')[0].strip()
  if current: current['end']=i
  current={'chapter':int(ch),'number':int(num),'title':rest or f'第{ch}章・第{num}項','start':i+1,'end':len(doc)};sections.append(current)
# If OCR or text flow has no headings, preserve navigability by page ranges
if not sections:
 for i in range(0,len(doc),10): sections.append({'chapter':i//50+1,'number':i//10%5+1,'title':f'{i+1}〜{min(i+10,len(doc))}ページ','start':i+1,'end':min(i+10,len(doc))})
filename=slug+'.pdf';shutil.copyfile(source,root/filename)
record={'id':slug,'title':title,'pdf':filename,'pages':len(doc),'sections':sections,'text':pages,'note':'見出しはPDFの抽出結果から自動検出。原本PDFを優先して確認してください。'}
(root/(slug+'.json')).write_text(json.dumps(record,ensure_ascii=False),encoding='utf-8')
index=root/'index.json'; items=json.loads(index.read_text(encoding='utf-8')) if index.exists() else []
items.append({'id':slug,'title':title,'file':slug+'.json','sections':len(sections),'pages':len(doc)})
index.write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'追加しました: {title} / {len(doc)}ページ / {len(sections)}項目')
