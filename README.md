# CareerSync 🎯

**CareerSync** is an AI-powered resume diagnostic and ATS analytics platform designed to bridge the gap between job seekers and target job descriptions. By leveraging LLM-based document analysis powered by Groq (`openai/gpt-oss-120b`), CareerSync provides candidate match scoring, ATS keyword extractions, sentence-level phrase rewrites, skill gap identification, and personalized 7-day learning roadmaps.

---

## 🌟 Key Features

- 🎯 **LLM-Driven Match Scoring**: Evaluates candidate resumes against target job descriptions using structured AI evaluation rubrics, generating breakdown scores for **Skill Match %** and **Experience Alignment %**.
- 📄 **Master Profile & Resume Parsing**: Automatically extracts technical skills, target roles, career summaries, and baseline resume health metrics (Action Verb Usage & Readability scores) from PDF, DOCX, and binary DOC files.
- 💼 **Interactive Live Job Board**: Explore live job postings via JSearch API with a dual-column workspace, instant role filtering, and 1-click in-context job description analysis.
- 🚀 **Skill Gap Detection & Learning Hub**: Automatically highlights priority skill gaps missing from target job descriptions and allows candidates to view recommended courses and generate custom 7-day learning roadmaps.
- 📊 **Analytics & Progress Tracking**: Track match score progression over time with interactive Recharts graphs and maintain a history of past job analyses.
- 🔒 **Secure Authentication**: Built-in user authentication with JWT, bcrypt password hashing, and secure HTTP-Only cookie session management.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand 5
- **Animations**: Framer Motion 12
- **Data Visualization**: Recharts 3
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Express 5 (ES Modules)
- **Database**: MongoDB with Mongoose 9 ORM
- **Authentication**: JSON Web Tokens (JWT in HTTP-Only Cookies) & `bcryptjs`
- **File Processing**: Multer (In-Memory), `pdf-parse`, `mammoth`, `word-extractor`
- **AI Integration**: Groq LLM API (`openai/gpt-oss-120b` via OpenAI SDK)
- **Live Job API**: JSearch API via Axios

---

## 📂 Project Architecture

```
CareerSync/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database connection (db.js)
│   │   ├── controllers/     # Handlers (auth, profile, analysis, job, learning)
│   │   ├── middlewares/     # Auth (auth.middleware.js) & Upload (upload.middleware.js)
│   │   ├── models/          # Schemas (user.model.js, profile.model.js, analysis.model.js, learning.model.js)
│   │   ├── routes/          # Express routes (auth, profile, analysis, job, learning)
│   │   ├── services/        # AI service, parsing service, score service, course service, job service
│   │   ├── utils/           # JWT token helper (utils.js)
│   │   └── index.js         # Backend Express server entry point
│   ├── package.json
│   └── .env
│
└── Frontend/
    ├── src/
    │   ├── components/      # UI components (analysis, dashboard, jobs, learning, common, landing, history)
    │   ├── pages/           # Pages (DashboardPage, AnalysisResultPage, AuthPage, LandingPage, NotFoundPage)
    │   ├── services/        # Axios API client (api.js)
    │   ├── stores/          # Zustand stores (useAuthStore, useProfileStore, useAnalysisStore, useJobStore, useLearningStore)
    │   ├── App.jsx          # React Router entry point
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/careersync`) or MongoDB Atlas URI
- **Groq API Key**: API key for accessing Groq LLM inference endpoints (`GROQ_API_KEY`)

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `Backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/careersync
   JWT_SECRET=your_jwt_secret_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend application will run on `http://localhost:5173`.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/signup` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login user and issue HTTP-only cookie | ❌ |
| `POST` | `/api/auth/logout` | Clear auth session cookie | ❌ |
| `GET` | `/api/auth/check` | Verify active user session | ✅ |
| `GET` | `/api/profile` | Fetch candidate profile | ✅ |
| `POST` | `/api/profile/upload` | Upload and parse master resume (PDF/DOC/DOCX) | ✅ |
| `PUT` | `/api/profile` | Manually update profile skills/target roles | ✅ |
| `POST` | `/api/upload` | Analyze resume against job description | ✅ |
| `GET` | `/api/upload/history` | Fetch past scan history | ✅ |
| `GET` | `/api/jobs/search` | Search live jobs via JSearch API | ✅ |
| `GET` | `/api/jobs/details/:id` | Fetch specific job details | ✅ |
| `POST` | `/api/learning/add` | Add skill to Learning Hub | ✅ |
| `GET` | `/api/learning/list` | Fetch learning queue items | ✅ |
| `POST` | `/api/learning/roadmap` | Generate 7-day AI study roadmap | ✅ |
| `DELETE` | `/api/learning/:id` | Delete skill from learning queue | ✅ |
| `GET` | `/api/learning/courses/:skill` | Fetch recommended courses for skill | ✅ |
| `PATCH` | `/api/learning/:id/status` | Update skill status (To Learn / In Progress / Completed) | ✅ |
