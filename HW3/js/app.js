const resumeEl=document.getElementById('resume'),jobEl=document.getElementById('job');
const skills=['Python','Java','JavaScript','TypeScript','C++','C#','React','Vue','Angular','Node.js','Express','SQL','MySQL','SQLite','MongoDB','Git','GitHub','Docker','Linux','AWS','Azure','REST API','Machine Learning','AI','RAG','LLM','Unity','Figma','Excel','Power BI'];
const sections={education:['學歷','education','大學','university','學校'],experience:['工作經驗','experience','intern','實習','工作'],project:['專案','project','作品','研究'],skill:['技能','skills','技術','能力'],intro:['自我介紹','profile','summary','about me','簡介']};
function hasAny(text,words){return words.some(w=>text.toLowerCase().includes(w.toLowerCase()))}
function clamp(n,min,max){return Math.max(min,Math.min(max,n))}
function analyze(){const resume=resumeEl.value.trim(),job=jobEl.value.trim();if(resume.length<30){alert('請先輸入較完整的履歷內容（至少 30 個字）。');return}
 const foundSections=Object.values(sections).filter(arr=>hasAny(resume,arr)).length;
 const lengthScore=clamp(resume.length/8,0,35); const complete=Math.round(clamp(foundSections*13+lengthScore,25,100));
 const foundSkills=skills.filter(s=>resume.toLowerCase().includes(s.toLowerCase()));
 const keyword=Math.round(clamp(35+foundSkills.length*8,30,100));
 let match=job?calculateMatch(resume,job):Math.round((complete+keyword)/2);
 const score=Math.round(complete*.4+keyword*.3+match*.3);
 render(score,complete,keyword,match,foundSkills,resume,job,foundSections);
}
function calculateMatch(resume,job){const clean=s=>s.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff+#.]/g,' ');const jobWords=[...new Set(clean(job).split(/\s+/).filter(w=>w.length>1))];if(!jobWords.length)return 60;const r=clean(resume);const hits=jobWords.filter(w=>r.includes(w)).length;return Math.round(clamp(35+(hits/jobWords.length)*65,35,100))}
function render(score,complete,keyword,match,foundSkills,resume,job,foundSections){document.getElementById('emptyState').classList.add('hidden');document.getElementById('results').classList.remove('hidden');document.getElementById('score').textContent=score;setMetric('complete',complete);setMetric('keyword',keyword);setMetric('match',match);
 const skillBox=document.getElementById('skills');skillBox.innerHTML=foundSkills.length?foundSkills.map(s=>`<span class="tag">${s}</span>`).join(''):'<span style="color:#8a93a5;font-size:13px">尚未偵測到常見技術關鍵字</span>';
 const sug=[];if(foundSections<4)sug.push('建議補齊「學歷、工作/實習、專案、技能、自我介紹」等履歷區塊。');if(resume.length<350)sug.push('目前履歷內容偏短，可增加具體專案成果、負責工作與量化成果。');if(foundSkills.length<4)sug.push('技能關鍵字較少，可依實際能力補充程式語言、框架、工具或資料庫名稱。');if(job&&match<70)sug.push('與目標職缺的關鍵字匹配度偏低，可在真實經驗範圍內補充職缺要求的相關技能與經驗。');if(!/\d+%|\d+人|\d+名|\d+筆|\d+次|\d+個/.test(resume))sug.push('可加入量化成果，例如「處理 500 筆資料」、「專題獲第 2 名」等，讓成果更具體。');if(sug.length===0)sug.push('履歷結構與關鍵字表現良好，建議再針對不同職缺微調內容順序與成果描述。');document.getElementById('suggestions').innerHTML=sug.map(x=>`<li>${x}</li>`).join('');document.getElementById('results').scrollIntoView({behavior:'smooth',block:'nearest'})}
function setMetric(id,val){document.getElementById(id+'Text').textContent=val+'%';document.getElementById(id+'Bar').style.width=val+'%'}
document.getElementById('analyzeBtn').addEventListener('click',analyze);
document.getElementById('demoBtn').addEventListener('click',()=>{resumeEl.value=`陳同學｜資訊工程系\n\n自我介紹：具備程式開發、資料分析與系統整合經驗。\n學歷：國立大學資訊工程學系。\n技能：Python、JavaScript、C#、SQL、Git、Unity、RAG、LLM。\n專案：開發 AI 校園助理，使用 Python、Unity、WebSocket 與 RAG 技術整合語音辨識與大型語言模型，負責資料整理、功能開發與系統測試，專題成果獲期末展示第 2 名。\n工作經驗：參與資料整理與系統開發相關工作，具備團隊溝通及問題解決能力。`;jobEl.value=`AI 應用工程師：熟悉 Python、JavaScript、Git、REST API，具備 LLM、RAG、SQL 或資料分析經驗，能參與 AI 應用系統開發與測試。`;});
