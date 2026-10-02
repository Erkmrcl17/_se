# NQU AI Campus Assistant — 智慧校務助理系統

## 專案介紹

NQU AI Campus Assistant 是一個以「智慧校務服務」為主題的 Web 專案，概念延伸自校園 AI Assistant。系統希望讓學生不需要在不同校務頁面中反覆尋找資訊，而是透過自然語言直接詢問課程、畢業學分、成績、獎助學金、選課與校園服務。

本版本為課堂作業 Demo，使用 HTML、CSS 與 JavaScript 完成，不需要後端伺服器或 API Key，即可直接執行並部署至 GitHub Pages。

## 專案價值

傳統校務系統通常以功能選單為主，學生需要知道資料位於哪一個頁面。本專案加入 AI Assistant 的互動概念，讓使用者可以直接以問題描述需求，例如「我還差多少畢業學分？」或「獎學金如何申請？」。

Demo 以本地 Knowledge Base 模擬 RAG（Retrieval-Augmented Generation）的檢索與回答流程。未來可以進一步串接真正的校務資料庫、向量資料庫與大型語言模型。

## 主要功能

- AI 校務問答：以自然語言查詢常見校務問題。
- Quick Questions：提供畢業學分、獎學金、選課與校園服務快捷問題。
- 語音輸入：支援 Web Speech API 的瀏覽器可使用麥克風輸入問題。
- 課程查詢：可依課程名稱、課號、教師或課程類型搜尋。
- 學習分析：顯示已修學分、平均成績、畢業進度與各類學分完成狀況。
- 校務資訊：整理註冊、獎學金、重要日程、校園服務與最新公告。
- Responsive Web Design：支援桌面與手機版面。

## 使用技術

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Local Knowledge Base
- Keyword Retrieval
- Web Speech API
- Responsive Web Design (RWD)

## 專案結構

```text
nqu-ai-campus-assistant/
├── index.html      # 網站主要頁面
├── style.css       # UI 與 RWD 樣式
├── app.js          # AI 問答、搜尋、語音等互動功能
└── README.md       # 專案說明
```

## 如何執行

### 方法一：直接執行

下載專案後，直接使用瀏覽器開啟 `index.html`。

### 方法二：VS Code + Live Server

1. 使用 VS Code 開啟專案資料夾。
2. 安裝 Live Server Extension。
3. 在 `index.html` 上按右鍵。
4. 選擇 `Open with Live Server`。
5. 瀏覽器會開啟類似 `http://127.0.0.1:5500/` 的網址。

## AI 問答測試

可以嘗試輸入：

- 我還差多少畢業學分？
- 獎學金如何申請？
- 選課要注意什麼？
- 這學期有哪些課？
- 我的平均成績是多少？
- 圖書館開放時間？

目前回答來自 `app.js` 中建立的本地知識庫，因此不需要 OpenAI API Key。

## GitHub Pages 部署

建立 GitHub Repository 後，在專案資料夾執行：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nqu-ai-campus-assistant.git
git push -u origin main
```

接著進入 GitHub Repository：

`Settings → Pages → Deploy from a branch → main → /(root) → Save`

部署完成後即可透過 GitHub Pages HTTPS 網址瀏覽。

## 系統設計概念

```text
Student
   ↓
Web Interface
   ↓
Question / Voice Input
   ↓
Keyword Retrieval
   ↓
Local Knowledge Base
   ↓
AI-style Response
```

正式系統未來可擴充為：

```text
Student
   ↓
Web / Voice Interface
   ↓
STT
   ↓
RAG Retrieval
   ↓
Vector Database + Campus Knowledge Base
   ↓
LLM
   ↓
Answer
   ↓
TTS
```

## 未來擴充方向

1. 串接真實校務資料庫與學生登入系統。
2. 使用 Embedding + Vector Database 建立真正的 RAG。
3. 串接 LLM API，提升自然語言理解與回答能力。
4. 加入完整 STT / TTS 語音互動。
5. 根據學生修課紀錄提供智慧選課推薦。
6. 加入校園公告自動整理與摘要。
7. 增加管理員後台維護 Knowledge Base。

## 注意事項

本專案為課程作業與展示用途，畫面中的學生、課程、成績、學分、公告與校務資訊皆為 Demo 資料，不代表國立金門大學官方資訊。

## Author

NQU AI Campus Assistant — Final Project Web Edition
