# Zentha AI — All-in-One AI Platform

Ek hi dashboard mein 5 AI-powered tools:

1. **AI Resume Builder** — Resume banao, AI se professional summary, improved bullet points aur skill suggestions lo.
2. **AI Interview Platform** — Role ke hisaab se 5 mock interview questions, har answer ka AI feedback + score, aur overall performance summary.
3. **AI Chatbot for Websites** — Apni business info se trained chatbot banao, ek `<script>` tag se kisi bhi website par embed karo.
4. **AI Code Reviewer** — Code paste karo, senior-level review milega (bugs, security, performance, readability) + bug score.
5. **AI PDF Chat** — PDF upload karo, uske content ke basis par AI se sawaal-jawab karo (RAG using embeddings).

---

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT
- **AI:** OpenAI API (GPT-4o-mini for chat, text-embedding-3-small for PDF Chat)

---

## Folder Structure

```
zentha-ai/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/          # User, Resume, Interview, Chatbot, CodeReview, PdfDocument
│   │   ├── controllers/     # sab feature ka business logic
│   │   ├── routes/          # sab feature ke API routes
│   │   ├── middleware/      # auth, error handling, file upload
│   │   ├── services/        # aiService.js (OpenAI wrapper), textChunker.js
│   │   └── server.js
│   ├── public/widget.js     # embeddable chatbot widget script
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/            # Landing, Login, Register, Overview + 5 feature pages
    │   ├── components/       # DashboardLayout, ProtectedRoute
    │   ├── context/          # AuthContext
    │   └── api/axios.js
    └── .env.example
```

---

## Setup Instructions

### 1. Prerequisites
- Node.js v18+ installed
- MongoDB running locally (`mongodb://127.0.0.1:27017`) — ya MongoDB Atlas ka free cluster bana lo
- OpenAI API key ([platform.openai.com](https://platform.openai.com/api-keys) se generate karo)

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

`.env` file open karke ye values fill karo:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/zentha-ai
JWT_SECRET=koi_bhi_lambi_random_string_daal_do
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
CLIENT_URL=http://localhost:5173
```

Server chalane ke liye:
```bash
npm run dev
```
Backend `http://localhost:5000` par chalega.

### 3. Frontend Setup

Naye terminal mein:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend `http://localhost:5173` par chalega.

### 4. App Use Karo

1. Browser mein `http://localhost:5173` kholo
2. "Get started" pe click karke account banao (register)
3. Dashboard mein 5 tools available hain — koi bhi try karo

---

## Important Notes

- **MongoDB nahi hai local mein?** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) par free cluster bana kar uska connection string `MONGO_URI` mein daal do.
- **OpenAI credits chahiye** — naye account ko kabhi-kabhi free trial credits milte hain, warna card add karke pay-as-you-go use karo. Chhoti testing mein cost bahut kam aati hai.
- **Chatbot Widget Embed:** Chatbot banane ke baad tumhe ek `<script>` tag milega jo kisi bhi HTML website mein paste karke turant working chatbot mil jayega.
- **PDF Chat:** Bade PDFs (100+ pages) mein embeddings banane mein thoda time lagega — ye normal hai, upload progress dikh jayega.

## Future Improvements (agar aage badhana ho)
- PDF resume ka export (PDF/DOCX download) add karna
- Real-time voice-based mock interviews (Whisper API)
- Chatbot ke liye multi-file knowledge base (PDF/CSV upload)
- Multi-language code review support ke liye syntax highlighting (Monaco Editor)
- Deployment: Backend → Render/Railway, Frontend → Vercel/Netlify, DB → MongoDB Atlas
