ResumeAI — AI 履歷健檢系統
專案介紹
ResumeAI 是一個以「履歷分析」為主題的網頁專案。使用者可以將履歷文字與目標職缺描述貼入網站，系統會從履歷完整度、技能關鍵字、職缺匹配度等方向進行分析，最後產生履歷分數與改善建議。
本專案作為課程「習題 3：請想出一個有價值的專案程式，並實作出來」的實作成果。
目前版本為前端 Demo，分析演算法直接在瀏覽器執行，不會將履歷上傳到伺服器，也不需要 API Key。

專案價值
使用價值
求職者撰寫履歷後，常常不知道自己的履歷是否完整，也不容易快速判斷履歷與職缺需求之間的差距。ResumeAI 將履歷健檢流程自動化，讓使用者可以在投遞履歷之前先自行檢查內容。
系統可以協助使用者：
- 檢查履歷基本內容是否完整
- 找出履歷中的技能關鍵字
- 分析履歷與目標職缺的匹配程度
- 提供履歷改善方向
- 透過分數與進度條快速了解履歷狀況
商業價值
未來可以採用 Freemium 商業模式：
- 免費版：基本履歷分析、履歷評分、技能偵測
- 進階版：AI 履歷改寫、職缺匹配分析、多版本履歷管理
- Premium：PDF 履歷報告、批次職缺分析、求職紀錄追蹤
- B2B：提供學校就業輔導中心或人力資源公司使用
主要功能
1. 履歷文字輸入
2. 目標職缺描述輸入
3. 履歷完整度分析
4. 技能關鍵字偵測
5. 職缺匹配度分析
6. Resume Score 履歷總分
7. 自動產生改善建議
8. 範例履歷快速 Demo
9. Responsive Web Design
使用技術
- HTML5
- CSS3
- JavaScript
- Responsive Web Design
- Keyword Matching
- Rule-based Resume Analysis
目前不需要後端與資料庫，因此可以直接部署到 GitHub Pages。
專案結構
ai-resume-checker/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    └── app.js
執行方式
方法一：直接開啟
下載專案後，直接使用瀏覽器開啟：
index.html
即可使用。
方法二：使用 VS Code Live Server
1. 使用 VS Code 開啟專案資料夾
2. 安裝 Live Server Extension
3. 在 index.html 按右鍵
4. 選擇 Open with Live Server
瀏覽器會開啟類似：
http://127.0.0.1:5500/index.html
使用方式
1. 進入 ResumeAI 首頁
2. 點擊「開始免費健檢」
3. 貼上履歷內容
4. 選擇性貼上目標職缺描述
5. 點擊「開始分析」
6. 查看 Resume Score、完整度、關鍵字、匹配度與改善建議
若只是展示，可以點擊「載入範例資料」後直接開始分析。
分析原理
目前版本使用 Rule-based Analysis（規則式分析），主要分析：
履歷完整度
檢查是否包含：
- 自我介紹
- 學歷
- 工作 / 實習經驗
- 專案經驗
- 技能
技能分析
系統會搜尋常見技術關鍵字，例如：
Python
JavaScript
C#
Java
React
Node.js
SQL
Git
Docker
Machine Learning
RAG
LLM
職缺匹配
將目標職缺中的文字與履歷內容進行比對，依照共同關鍵字比例計算基本匹配分數。
未來改進
目前為課堂 Demo，未來可以增加：
- OpenAI / Gemini 等 LLM API
- PDF / DOCX 履歷上傳
- AI 自動改寫履歷
- ATS Resume Checker
- 使用者登入系統
- 履歷歷史紀錄
- MySQL / MongoDB 資料庫
- 不同職缺履歷版本管理
- AI 面試問題產生器
GitHub Pages 部署
將專案 Push 到 GitHub Repository 後：
1. 進入 Repository
2. 點擊 Settings
3. 點擊 Pages
4. Build and deployment 選擇 Deploy from a branch
5. Branch 選擇 main
6. Folder 選擇 / (root)
7. 點擊 Save
等待 GitHub 完成部署後，即可取得 HTTPS 網址。
網址通常會是：
https://你的GitHub帳號.github.io/Repository名稱/
Git 上傳指令
git init
git add .
git commit -m "Initial commit: ResumeAI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
請將 YOUR_USERNAME 與 YOUR_REPOSITORY 改成自己的 GitHub 帳號與 Repository 名稱。
注意事項
此版本的「AI 履歷健檢」為課程展示用的前端規則式分析 Demo，並未真正呼叫大型語言模型 API。這樣設計的優點是可以直接使用 GitHub Pages 部署，不需要公開 API Key，也不會產生 API 費用。
若要發展成正式產品，可以增加後端 API，再串接 LLM 進行語意分析與履歷改寫。
作者
Course Project — Exercise 3
AI Resume Checker / ResumeAI