const $=id=>document.getElementById(id);let books=[],book=null,selected=0;const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const sections=['A｜要点','B｜詳しい解説','C｜イメージ理解','D｜具体例','類義語・近義語・使い分け','理解確認問題','解答・解説','30秒復習','一文記憶'];function parse(t){
 const re=/(?:^|\n)[ \t]*(?:#{2,4}\s*)?(A｜要点|B｜詳しい解説|C｜イメージ理解|D｜具体例|類義語・近義語・使い分け|理解確認問題|解答・解説|30秒復習|一文記憶|用語解説・注意点)[ \t]*(?=\n|$)/g;
 const hits=[...t.matchAll(re)];if(!hits.length)return [{title:'解説全文',text:t}];
 const out=[];if(hits[0].index>0){const intro=t.slice(0,hits[0].index).trim();if(intro)out.push({title:'導入・はじめに',text:intro})}
 hits.forEach((m,i)=>{const start=m.index+m[0].length,end=i+1<hits.length?hits[i+1].index:t.length;out.push({title:m[1],text:t.slice(start,end).trim()})});return out;
}
function inline(t){return esc(t).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/【([^】]+)】/g,'<strong class="keyword">$1</strong>')}
function clean(t){return String(t||'').replace(/\r/g,'').replace(/([ぁ-んァ-ヶ一-龥])\n([ぁ-んァ-ヶ一-龥])/g,'$1$2').replace(/\n[ \t]*([。、」])/g,'$1').replace(/ {2,}/g,' ').replace(/ +([。、！？」])/g,'$1').trim()}
function paragraphs(t){
 const lines=String(t||'').replace(/\r/g,'').split('\n'),out=[],buf=[];
 const flush=()=>{if(buf.length){out.push('<p class="para">'+inline(buf.join(' ').replace(/\s+([。、！？])/g,'$1'))+'</p>');buf.length=0}};
 for(let line of lines){line=line.trim();if(!line){flush();continue}
 if(/^---+$/.test(line)){flush();out.push('<hr class="subdivider">');continue}
 let h=line.match(/^#{2,6}\s+(.+)$/);if(h){flush();out.push('<h3 class="subheading">'+inline(h[1])+'</h3>');continue}
 if(/^[*•-]\s+/.test(line)){flush();out.push('<div class="point">'+inline(line.replace(/^[*•-]\s+/,''))+'</div>');continue}
 if(/^(?:[①-⑳]|\d+[.．]|[A-D][.．])\s*/.test(line)){flush();out.push('<div class="point">'+inline(line)+'</div>');continue}
 if(/^[┌┐└┘│├┤┬┴┼─▼▲]/.test(line)||/^\|/.test(line)){flush();out.push('<pre class="diagram">'+esc(line)+'</pre>');continue}
 if(line==='↓'){flush();out.push('<div class="down">↓</div>');continue}
 if(/^(?:原因|変化|反応|結果)[:：]/.test(line)){flush();out.push('<div class="step">'+inline(line)+'</div>');continue}
 if(buf.length&&(/^[「『……]/.test(line)||/[。！？？」]$/.test(buf[buf.length-1]))){flush()}
 buf.push(line)
 }flush();return out.join('')
}
function quizBlock(t,answerText){
 const source=String(t||''), starts=[...source.matchAll(/(?:^|\n)#{2,6}\s*Q(\d+)[^\n]*/g)];
 if(!starts.length)return paragraphs(t);
 const intro=source.slice(0,starts[0].index), qs=[];
 for(let i=0;i<starts.length;i++){
 const part=source.slice(starts[i].index,starts[i+1]?.index??source.length);
 const opts=[...part.matchAll(/(?:^|\n)\s*(?:\*\s*)?([A-D])[.．]\s+([^\n]*)/g)];
 if(opts.length!==4)return paragraphs(t);
 const question=part.slice(0,opts[0].index).trim();const num=starts[i][1];
 const am=answerText.match(new RegExp('Q'+num+'の解答[：:]\\s*正解は\\s*【([A-D])】'));
 const correct=am?.[1]||'';
 const options=opts.map((o,j)=>({letter:o[1],text:part.slice(o.index+o[0].length-(o[2]||'').length,opts[j+1]?.index??part.length).trim().replace(/\n/g,' ')}));
 qs.push({num,question,correct,options});
 }
 return '<div class="quiz-intro">'+paragraphs(intro)+'</div>'+qs.map(q=>`<div class="quiz-card" data-answer="${q.correct}"><h3>${inline(q.question.replace(/^#{2,6}\s*/,''))}</h3><div class="choices">${q.options.map(o=>`<button type="button" class="choice" data-choice="${o.letter}"><span class="letter">${o.letter}</span><span>${inline(o.text)}</span></button>`).join('')}</div><p class="quiz-feedback" aria-live="polite">選択肢を選ぶと正誤を確認できます。</p></div>`).join('');
}
function renderBlocks(t){let blocks=parse(t),answers=blocks.find(x=>x.title==='解答・解説')?.text||'';return blocks.map(b=>{if(b.title==='理解確認問題')return `<section class="content-block" id="quiz"><h2>📝 ${esc(b.title)}</h2>${quizBlock(b.text,answers)}</section>`;if(b.title==='解答・解説')return `<section class="content-block" id="answers"><details class="answers"><summary>📘 解答・詳しい解説を表示</summary><div class="answer-content">${paragraphs(b.text)}</div></details></section>`;return `<section class="content-block"><h2>${esc(b.title)}</h2>${paragraphs(b.text)}</section>`}).join('')}

function learningVisual(s){
  const t=s.title||'', id=book?.id||'';
  if(id!=='book-003')return '';
  let title='',body='';
  if(/BS（|貸借対照表/.test(t)){
    title='貸借対照表（BS）の左右の関係';
    body='<div class="v-bs"><div><b>資産（左側）</b><span>現金・売掛金・商品・設備</span><small>調達した資金の現在の姿</small></div><div class="v-right"><div><b>負債（右側上）</b><span>借入金・買掛金</span></div><div><b>純資産（右側下）</b><span>資本金・利益剰余金</span></div></div></div><p class="v-eq">資産 ＝ 負債 ＋ 純資産</p>';
  }else if(/PL（|損益計算書/.test(t)){
    title='損益計算書（PL）で利益をたどる';
    body='<div class="v-stack"><div>売上高</div><div>− 売上原価 <b>＝ 売上総利益</b></div><div>− 販売費及び一般管理費 <b>＝ 営業利益</b></div><div>＋ 営業外収益 − 営業外費用 <b>＝ 経常利益</b></div><div>＋ 特別利益 − 特別損失 <b>＝ 税引前当期純利益</b></div><div>− 法人税等 <b>＝ 当期純利益</b></div></div>';
  }else if(/CS（|キャッシュフロー|8パターン/.test(t)){
    title='キャッシュフロー計算書（CS）の3区分';
    body='<div class="v-three"><div><b>営業CF</b><span>本業で稼ぐ・支払う</span></div><div><b>投資CF</b><span>設備や資産を買う・売る</span></div><div><b>財務CF</b><span>借りる・返す・出資を受ける</span></div></div><p class="v-eq">期首の現金 ＋ 現金の増減 ＝ 期末の現金</p>';
  }else if(/取引|実践/.test(t)){
    title='ひとつの取引が財務3表にどう反映されるか';
    body='<div class="v-flow"><div>① 取引が発生</div><span>↓</span><div>② 売上・費用が動くか？<small>PLで確認</small></div><span>↓</span><div>③ 資産・負債・純資産は？<small>BSで確認</small></div><span>↓</span><div>④ 現金の出入りは？<small>CSで確認</small></div></div>';
  }else if(/つながり|連動/.test(t)){
    title='財務3表をつなぐ基本的な関係';
    body='<div class="v-three"><div><b>PL</b><span>一定期間の利益</span></div><div><b>BS</b><span>ある時点の財産</span></div><div><b>CS</b><span>一定期間の現金の動き</span></div></div><div class="v-links"><p>PLの当期純利益 → BSの利益剰余金に反映</p><p>CSの期末現金残高 ↔ BSの現金・現金同等物に対応</p><p>BSの資産合計 ＝ 負債合計 ＋ 純資産合計</p></div>';
  }else{
    title='会計を理解するための3つの基本活動';
    body='<div class="v-flow"><div>集める<small>出資・借入れなど</small></div><span>↓</span><div>投資する<small>商品・設備など</small></div><span>↓</span><div>稼ぐ<small>売上・利益の獲得</small></div></div>';
  }
  return `<section class="learning-visual" aria-label="学習内容の補助図"><div class="v-label">📊 図で理解する</div><h2>${esc(title)}</h2>${body}<p class="v-caption">理解を助けるための模式図です。細かな会計処理は本文の解説をご確認ください。</p></section>`;
}

function wireQuiz(){document.querySelectorAll('.quiz-card').forEach(card=>{card.querySelectorAll('.choice').forEach(btn=>btn.onclick=()=>{let answer=card.dataset.answer,choice=btn.dataset.choice;card.querySelectorAll('.choice').forEach(b=>{b.classList.remove('correct','wrong');if(b.dataset.choice===answer)b.classList.add('correct');if(b===btn&&choice!==answer)b.classList.add('wrong')});card.querySelector('.quiz-feedback').textContent=answer?(choice===answer?'正解です！ 詳しい理由は下の「解答・詳しい解説」で確認できます。':`不正解です。正解は ${answer} です。詳しい理由を確認しましょう。`):'正解データが見つかりません。下の解答・詳しい解説をご確認ください。'})})}
async function init(){books=await(await fetch('./index.json?v=20261119-3books',{cache:'no-store'})).json();$('search').addEventListener('input',renderNav);$('home').onclick=()=>{location.hash='';book=null;renderNav();$('content').innerHTML='<h1>読書学習ライブラリ</h1><p>左の本棚から書籍を選んでください。</p>'};renderNav();let h=decodeURIComponent(location.hash.slice(1)).split('/');if(h[0]&&books.some(x=>x.id===h[0]))await load(h[0],h.length>1?Number(h[1]):null)}function renderNav(){let q=$('search').value.trim().toLowerCase();$('books').innerHTML='<h3>本棚</h3>'+books.map(x=>`<button class="book ${book?.id===x.id?'selected':''}" data-book="${esc(x.id)}">📖 ${esc(x.title)}</button>`).join('');document.querySelectorAll('[data-book]').forEach(el=>el.onclick=()=>load(el.dataset.book));if(!book){$('chapters').innerHTML='';return}let by={};book.sections.forEach((s,i)=>{if(q&&!`${book.title} ${s.title} ${(book.themes?.[s.chapter] ?? `第${s.chapter}章`)} ${s.text}`.toLowerCase().includes(q))return;(by[s.chapter]??=[]).push({...s,i})});$('chapters').innerHTML='<h3>章・学習項目</h3>'+Object.entries(by).map(([ch,ss])=>`<details class="chapter" open><summary>第${ch}章｜${esc((book.themes?.[ch] ?? `第${ch}章`))}</summary>${ss.map(s=>`<button class="section ${selected===s.i?'selected':''}" data-section="${s.i}">第${s.number}項｜${esc(s.title)}</button>`).join('')}</details>`).join('');document.querySelectorAll('[data-section]').forEach(el=>el.onclick=()=>show(Number(el.dataset.section)))}async function load(id,i=null){try{let rec=books.find(x=>x.id===id);book=await(await fetch('./'+rec.file+'?v=20261119-3books',{cache:'no-store'})).json();book.themes??={};book.sections??=[];selected=i??0;renderNav();if(i===null){location.hash=id;let groups={};book.sections.forEach((s,j)=>(groups[s.chapter]??=[]).push({...s,j}));$('content').innerHTML=`<div class="eyebrow">書籍一覧 / ${esc(book.author)}</div><h1>${esc(book.title)}</h1><p class="lead">${esc(book.note)}</p>`+Object.entries(groups).map(([ch,ss])=>`<div class="chapter-card"><h2>第${ch}章｜${esc((book.themes?.[ch] ?? `第${ch}章`))}</h2><p>${ss.length}項目</p>${ss.map(s=>`<div><button data-open="${s.j}">第${s.number}項｜${esc(s.title)}</button></div>`).join('')}</div>`).join('');document.querySelectorAll('[data-open]').forEach(el=>el.onclick=()=>show(Number(el.dataset.open)))}else show(i)}catch(e){$('content').innerHTML='<h1>データの読み込みに失敗しました</h1><p>'+esc(e.message)+'</p>'}}function show(i){if(!book||!book.sections[i])return;selected=i;let s=book.sections[i];location.hash=book.id+'/'+i;renderNav();$('content').innerHTML=`<div class="eyebrow">${esc(book.title)} / 第${s.chapter}章 / 第${s.number}項</div><h1>${esc(s.title)}</h1><div class="lead"><b>第${s.chapter}章の大テーマ</b><div>${esc((book.themes?.[s.chapter] ?? `第${s.chapter}章`))}</div></div>`+learningVisual(s)+renderBlocks(s.text)+`<p class="note">${s.pages?'原資料の該当範囲：'+esc(s.pages)+'ページ。':''} 出典参照番号のみ除去し、解説本文を収録しています。${s.source_complete===false?" ※この解説は原PDFが途中で終了しています。":""}</p><div class="actions"><button id="prev" ${i===0?'disabled':''}>← 前の項目</button><button id="next" ${i===book.sections.length-1?'disabled':''}>次の項目 →</button></div>`;$('prev').onclick=()=>show(i-1);$('next').onclick=()=>show(i+1);wireQuiz();window.scrollTo(0,0)}init().catch(e=>$('content').innerHTML='<h1>読み込みエラー</h1><p>'+esc(e.message)+'</p>');