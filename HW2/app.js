const courses=[
 {code:'CS401',name:'人工智慧',teacher:'李教授',time:'週一 10:10–12:00',credit:3,type:'專業選修'},
 {code:'CS315',name:'資料庫系統',teacher:'王教授',time:'週二 13:30–16:20',credit:3,type:'專業必修'},
 {code:'CS428',name:'機器學習',teacher:'陳教授',time:'週三 09:10–12:00',credit:3,type:'專業選修'},
 {code:'CS322',name:'網頁程式設計',teacher:'林教授',time:'週四 13:30–16:20',credit:3,type:'專業選修'},
 {code:'CS310',name:'作業系統',teacher:'馮教授',time:'週五 09:10–12:00',credit:3,type:'專業必修'},
 {code:'GE201',name:'科技與社會',teacher:'張教授',time:'週五 13:30–15:20',credit:2,type:'通識課程'}
];
const knowledge=[
 {keys:['畢業','學分','差多少'],answer:'依照 Demo 學生資料，目前已完成 108 學分，設定的畢業門檻為 128 學分，因此尚需 20 學分。建議優先確認必修課是否完成，再安排專業選修與通識課程。'},
 {keys:['獎學金','助學金'],answer:'獎助學金通常會依學業成績、身分資格或經濟條件開放申請。你可以至學務處公告查看最新申請時間、資格與應備文件。本系統目前提供的是示範資料。'},
 {keys:['選課','加選','退選'],answer:'選課前建議先確認必修課、先修條件、學分上限與上課時間是否衝堂。加退選期間可依學校公告進行課程調整。'},
 {keys:['圖書館','開放','時間'],answer:'Demo 資料：圖書館平日開放時間為 08:00–22:00，週末為 09:00–17:00。實際開放時間請以學校最新公告為準。'},
 {keys:['這學期','哪些課','課程'],answer:'本學期 Demo 課程包含：人工智慧、資料庫系統、機器學習、網頁程式設計、作業系統，以及科技與社會。你也可以到左側「課程查詢」搜尋。'},
 {keys:['成績','平均'],answer:'依照 Demo 學習資料，目前平均成績為 89.4，已修 108 學分，整體畢業進度約 84%。'},
 {keys:['你好','嗨','hello','hi'],answer:'你好！我是 NQU AI Campus Assistant。你可以問我畢業學分、課程、成績、獎學金、選課或校園服務相關問題。'}
];
const pages={home:'智慧校務助理',courses:'課程查詢',academic:'學習分析',info:'校務資訊'};
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>{document.querySelectorAll('.nav,.page').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(b.dataset.page).classList.add('active');document.getElementById('pageTitle').textContent=pages[b.dataset.page]});
function renderCourses(filter=''){const grid=document.getElementById('courseGrid');const f=filter.toLowerCase();grid.innerHTML=courses.filter(c=>Object.values(c).join(' ').toLowerCase().includes(f)).map(c=>`<article class="course"><span class="tag">${c.type}</span><h3>${c.name}</h3><p>${c.code} · ${c.teacher}</p><footer><span>🕘 ${c.time}</span><b>${c.credit} 學分</b></footer></article>`).join('')||'<p>找不到符合的課程。</p>'}renderCourses();
document.getElementById('courseSearch').oninput=e=>renderCourses(e.target.value);
function answer(q){let best=null,score=0;for(const k of knowledge){let s=k.keys.filter(x=>q.toLowerCase().includes(x.toLowerCase())).length;if(s>score){score=s;best=k}}return best?best.answer:'目前的本地知識庫找不到完全符合的資料。你可以試著詢問「畢業學分」、「獎學金」、「選課」、「課程」、「成績」或「圖書館開放時間」。正式版本可串接 RAG 與 LLM 擴充回答能力。'}
function ask(q){if(!q.trim())return;const box=document.getElementById('messages');box.insertAdjacentHTML('beforeend',`<div class="msg user"><div><p>${escapeHtml(q)}</p></div></div>`);box.scrollTop=box.scrollHeight;setTimeout(()=>{box.insertAdjacentHTML('beforeend',`<div class="msg ai"><div class="mini">AI</div><div><b>NQU AI Assistant</b><p>${answer(q)}</p></div></div>`);box.scrollTop=box.scrollHeight},350)}
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
document.getElementById('chatForm').onsubmit=e=>{e.preventDefault();const i=document.getElementById('question');ask(i.value);i.value=''};
document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>ask(b.dataset.q));
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;document.getElementById('mic').onclick=()=>{if(!SpeechRecognition){alert('你的瀏覽器目前不支援語音辨識，建議使用最新版 Chrome。');return}const r=new SpeechRecognition();r.lang='zh-TW';r.onresult=e=>{document.getElementById('question').value=e.results[0][0].transcript};r.start()};
