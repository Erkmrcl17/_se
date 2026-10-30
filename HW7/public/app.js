const $=s=>document.querySelector(s), esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const api=async(url,opts={})=>{const r=await fetch(url,{headers:{"Content-Type":"application/json"},...opts});const d=await r.json();if(!r.ok)throw Error(d.error||"操作失敗");return d};
let employees=[],tasks=[],documents=[];
function toast(s){const t=$("#toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function dateStatus(date){const n=Math.ceil((new Date(date+"T23:59:59")-new Date())/86400000);return n<0?["已逾期","overdue"]:n<=30?["即將到期","soon"]:["有效","valid"]}
function employeeOptions(){return `<option value="">未指定</option>`+employees.map(e=>`<option value="${e.id}">${esc(e.name)}</option>`).join("")}
async function load(){[employees,tasks,documents]=await Promise.all([api("/api/employees"),api("/api/tasks"),api("/api/documents")]);render()}
async function render(){const s=await api("/api/summary");$("#statEmployees").textContent=s.employees;$("#statTasks").textContent=s.tasks;$("#statDocs").textContent=s.docs;$("#statOverdue").textContent=s.overdue;
$("#dashTasks").innerHTML=tasks.slice(0,4).map(t=>`<div class="rowitem"><div>${esc(t.title)}<small>${esc(t.employee_name||"未指定員工")} · ${esc(t.due_date||"未設定期限")}</small></div><span class="pill">${esc(t.status)}</span></div>`).join("")||empty();
$("#dashDocs").innerHTML=documents.slice(0,4).map(d=>{let [st,cl]=dateStatus(d.expiry_date);return `<div class="rowitem"><div>${esc(d.name)}<small>${esc(d.employee_name||"未指定員工")} · ${esc(d.expiry_date)}</small></div><span class="pill ${cl}">${st}</span></div>`}).join("")||empty();
$("#employeeList").innerHTML=table(["姓名","語言","部門","聯絡電話","操作"],employees.map(e=>[esc(e.name),esc(e.language),esc(e.department),esc(e.phone),`<button class="action" data-del-employee="${e.id}">刪除</button>`]));
$("#taskList").innerHTML=table(["任務名稱","負責員工","期限","狀態","操作"],tasks.map(t=>[esc(t.title),esc(t.employee_name||"未指定"),esc(t.due_date||"—"),`<select class="statusSelect" data-task="${t.id}"><option ${t.status==="待處理"?"selected":""}>待處理</option><option ${t.status==="進行中"?"selected":""}>進行中</option><option ${t.status==="已完成"?"selected":""}>已完成</option></select>`,`<button class="action" data-del-task="${t.id}">刪除</button>`]));
$("#documentList").innerHTML=table(["文件名稱","所屬員工","到期日","狀態","操作"],documents.map(d=>{let [st,cl]=dateStatus(d.expiry_date);return [esc(d.name),esc(d.employee_name||"未指定"),esc(d.expiry_date),`<span class="pill ${cl}">${st}</span>`,`<button class="action" data-del-doc="${d.id}">刪除</button>`]}));
}
function empty(){return `<div class="rowitem">目前沒有資料</div>`}
function table(head,rows){return rows.length?`<table><thead><tr>${head.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table>`:`<p style="color:#9aa4b4;font-size:12px;padding:12px">尚無資料，請點選右上方新增。</p>`}
const titles={dashboard:"總覽儀表板",employees:"員工管理",tasks:"工作任務",documents:"文件期限",messages:"雙語訊息範本"};
function go(page){document.querySelectorAll(".page").forEach(x=>x.classList.toggle("active",x.id===page));document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===page));$("#pageTitle").textContent=titles[page]}
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>go(b.dataset.page));document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
const modal=$("#modal"),fields=$("#modalFields");
function openModal(title,html,save){$("#modalTitle").textContent=title;fields.innerHTML=html;modal.showModal();$("#modalForm").onsubmit=async e=>{e.preventDefault();try{await save(Object.fromEntries(new FormData(e.target)));modal.close();await load();toast("資料已儲存")}catch(err){toast(err.message)}}}
function field(label,name,type="text",required=true,extra=""){return `<label>${label}<input name="${name}" type="${type}" ${required?"required":""} ${extra}></label>`}
function selectField(label,name,opts){return `<label>${label}<select name="${name}">${opts}</select></label>`}
function cancel(){modal.close()}$("#closeModal").onclick=cancel;$("#cancelModal").onclick=cancel;
$("#addEmployee").onclick=()=>openModal("新增員工",field("員工姓名","name")+selectField("主要語言","language",'<option>印尼文</option><option>中文</option><option>越南文</option><option>英文</option>')+field("部門","department", "text",false)+field("聯絡電話","phone","tel",false),v=>api("/api/employees",{method:"POST",body:JSON.stringify(v)}));
$("#addTask").onclick=()=>openModal("新增工作任務",field("任務名稱","title")+selectField("負責員工","employee_id",employeeOptions())+field("完成期限","due_date","date",false)+selectField("目前狀態","status",'<option>待處理</option><option>進行中</option><option>已完成</option>')+`<label>備註<textarea name="notes"></textarea></label>`,v=>api("/api/tasks",{method:"POST",body:JSON.stringify(v)}));
$("#addDocument").onclick=()=>openModal("新增文件",field("文件名稱","name")+selectField("所屬員工","employee_id",employeeOptions())+field("到期日期","expiry_date","date"),v=>api("/api/documents",{method:"POST",body:JSON.stringify(v)}));
document.addEventListener("click",async e=>{const t=e.target;if(t.dataset.delEmployee){if(confirm("刪除此員工及其任務、文件？"))await api("/api/employees/"+t.dataset.delEmployee,{method:"DELETE"}).then(load)}if(t.dataset.delTask)await api("/api/tasks/"+t.dataset.delTask,{method:"DELETE"}).then(load);if(t.dataset.delDoc)await api("/api/documents/"+t.dataset.delDoc,{method:"DELETE"}).then(load)});
document.addEventListener("change",async e=>{if(e.target.matches(".statusSelect")){await api("/api/tasks/"+e.target.dataset.task,{method:"PATCH",body:JSON.stringify({status:e.target.value})});await load();toast("任務狀態已更新")}});
const templates=[
["提醒文件到期","您好，提醒您相關文件即將到期，請協助確認並準備更新所需資料。","Halo, kami ingin mengingatkan bahwa dokumen Anda akan segera kedaluwarsa. Mohon bantu periksa dan siapkan dokumen yang diperlukan."],
["請提供簽名文件","您好，請協助簽署相關文件，完成後請將文件交回，謝謝。","Halo, mohon bantu tanda tangani dokumen terkait. Setelah selesai, silakan serahkan kembali dokumen tersebut. Terima kasih."],
["確認工作事項","您好，請確認以上工作事項是否已完成，如有問題請隨時告知。","Halo, mohon konfirmasi apakah tugas di atas sudah selesai. Jika ada kendala, silakan segera informasikan kepada kami."],
["通知資料更新","您好，為了更新公司資料，請提供最新的聯絡資訊，謝謝配合。","Halo, untuk memperbarui data perusahaan, mohon kirimkan informasi kontak terbaru Anda. Terima kasih atas kerja samanya."]
];
$("#templates").innerHTML=templates.map((x,i)=>`<article class="template"><h3>${x[0]}</h3><p><b>中文</b>｜${x[1]}</p><p class="idtext"><b>印尼文</b>｜${x[2]}</p><button class="copy" data-copy="${i}">複製雙語訊息</button></article>`).join("");
document.addEventListener("click",e=>{if(e.target.dataset.copy!==undefined){const x=templates[+e.target.dataset.copy];navigator.clipboard.writeText(`中文：${x[1]}\n印尼文：${x[2]}`).then(()=>toast("雙語訊息已複製"))}});
load().catch(e=>toast(e.message));