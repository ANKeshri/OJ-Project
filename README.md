# 🚀 Online Judge (OJ) Platform

A full-stack, scalable online coding platform inspired by LeetCode/HackerRank, built with the **MERN stack** and a microservices approach. Features real-time code compilation, AI-powered code analysis, problem management, and user authentication.

---

## 🗂️ Project Structure

```
OJ_Project/
│
├── backend/      # Express.js API server (auth, problems, AI analysis)
├── frontend/     # React + Vite SPA (user interface)
├── compiler/     # Code execution microservice (Dockerized, multi-language)
└── README.md     # Project documentation
```

---

## ✨ Features

- **Multi-language Code Compilation:** C++, Java, Python
- **Real-time Code Execution:** Isolated, secure, Dockerized
- **Problem Management:** CRUD for coding problems, test cases, constraints
- **User Authentication:** JWT, Google OAuth
- **Interactive Code Editor:** Syntax highlighting, language templates
- **AI Code Analysis:** Google Gemini 2.0 Flash for time/space complexity
- **Submission Tracking:** Detailed results, pass/fail feedback
- **Modern UI/UX:** Responsive, dark mode, toast notifications
- **Profile & Progress:** User profiles, completion status, LeetCode integration
- **Security:** JWT, bcrypt, CORS, input validation

---

## 🏗️ Architecture

- **Frontend:** React 19, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Google OAuth
- **Compiler:** Node.js, Express, Docker, g++, Python, Java
- **AI Integration:** Google Gemini 2.0 Flash (via @google/generative-ai)

---

## ⚡ Quickstart

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Docker (for compiler service)
- g++, JDK, Python 3 (on host or in Docker)
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone <repository-url>
cd OJ_Project
```

### 2. Backend Setup

```bash
cd backend
npm install
```
Create `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/oj_platform
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Compiler Service Setup

```bash
cd ../compiler
npm install
# To run with Docker:
docker build -t oj-compiler .
docker run -p 8000:8000 oj-compiler
# Or run locally:
node index.js
```

### 5. Start All Services

- **MongoDB:** `mongod`
- **Backend:** `cd backend && npm start`
- **Frontend:** `cd frontend && npm run dev`
- **Compiler:** (see above)

---

## 🧪 Database Seeding

To add sample problems:
```bash
cd backend
node scripts/seedProblems.js
```

---

## 🔗 API Endpoints

**Authentication**
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `POST /api/auth/google` — Google OAuth

**Problems**
- `GET /api/problems` — List problems
- `GET /api/problems/:id` — Problem details
- `POST /api/problems/:id/run` — Run code on sample test cases
- `POST /api/problems/:id/submit` — Submit code for all test cases

**Compiler**
- `POST /run` — Execute code (via compiler microservice)

**AI Analysis**
- `POST /api/ai/analyse` — Get time/space complexity from Gemini

---

## 🛡️ Security
- JWT authentication
- Password hashing (bcrypt)
- CORS configuration
- Input validation
- Environment variables for secrets

---

## 🧰 Technologies Used
- React, Vite, Tailwind CSS
- Node.js, Express, MongoDB, Mongoose
- Docker
- Google Gemini 2.0 Flash (AI)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using the MERN Stack** 