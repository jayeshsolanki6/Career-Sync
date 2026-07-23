# CareerSync 🎯

**CareerSync** is an AI-powered resume diagnostic and ATS analytics platform designed to bridge the gap between job seekers and target job descriptions. By leveraging LLM-based document analysis, CareerSync provides candidate match scoring, ATS keyword extractions, skill gap identification, and personalized 7-day learning roadmaps.

---

## 🌟 Key Features

- 🎯 **LLM-Driven Match Scoring**: Evaluates candidate resumes against target job descriptions using structured AI evaluation rubrics, generating breakdown scores for **Skill Match %** and **Experience Alignment %**.
- 📄 **Master Profile & Resume Parsing**: Automatically extracts technical skills, target roles, career summaries, and baseline resume health metrics (Action Verb Usage & Readability scores) from PDF and DOCX files.
- 💼 **Interactive Live Job Board**: Explore live job postings with a fixed dual-column workspace, instant role filtering, and 1-click in-context job description analysis.
- 🚀 **Skill Gap Detection & Learning Hub**: Automatically highlights priority skill gaps missing from target job descriptions and allows candidates to generate custom 7-day learning roadmaps.
- 📊 **Analytics & Progress Tracking**: Track score progression over time with interactive Recharts graphs and maintain a history of past job analyses.
- 🔒 **Secure Authentication**: Built-in user authentication with JWT, bcrypt password hashing, and cookie session management.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Express 5 (ES Modules)
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT)
- **File Processing**: Multer, `pdf-parse`, `mammoth`
- **AI Integration**: Groq OpenAI API (`openai/gpt-oss-120b`)

---

## 📂 Project Architecture

```
CareerSync/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Request handlers (Auth, Profile, Analysis, Jobs, Learning)
│   │   ├── middlewares/     # Auth and file upload middlewares
│   │   ├── models/          # MongoDB Schemas (User, Profile, Analysis, Job, Skill)
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # AI service, parsing service, score service
│   │   ├── utils/           # Helper functions
│   │   └── index.js         # Backend server entry point
│   ├── package.json
│   └── .env
│
└── Frontend/
    ├── src/
    │   ├── components/      # Modular UI components (Analysis, Dashboard, Jobs, History, Profile)
    │   ├── pages/           # App pages (Dashboard, AnalysisResultPage, Login, Register)
    │   ├── services/        # Axios API client setup
    │   ├── stores/          # Zustand state stores (useAuthStore, useAnalysisStore, useProfileStore)
    │   ├── App.jsx          # React Router entry point
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas URI
- **Groq API Key**: API key for accessing Groq LLM inference endpoints

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
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login user | ❌ |
| `POST` | `/api/auth/logout` | Logout user | ❌ |
| `GET` | `/api/profile/me` | Fetch candidate profile | ✅ |
| `POST` | `/api/upload/profile` | Upload and parse master resume | ✅ |
| `POST` | `/api/upload/analyze` | Analyze resume against a job description | ✅ |
| `GET` | `/api/analysis/history` | Get past analysis history | ✅ |
| `GET` | `/api/analysis/:id` | Get specific analysis report | ✅ |
| `GET` | `/api/jobs` | Fetch live job listings with filters | ✅ |
| `POST` | `/api/learning/add-skill` | Add skill to Learning Hub | ✅ |
| `POST` | `/api/learning/roadmap` | Generate 7-day AI learning roadmap | ✅ |

---

