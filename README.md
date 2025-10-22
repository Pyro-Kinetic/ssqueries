# 🌌 Solar System Queries

A full‑stack Q&A app for all things planetary. Users can register, log in, ask questions, and post answers about planets in our solar system. Built with a modern React + Vite frontend and an Express + MySQL backend.

## ✨ Features

- 🔐 User authentication with sessions
- 📝 Post questions and 💬 add answers
- 🪐 Category browsing by planet
- ⚡ Fast React + Vite frontend
- 🗄️ MySQL persistence
- 🛡️ CORS configured for production deployments

## 🧱 Tech Stack

- Frontend: React 19, Vite 7, Axios, CSS Modules
- Backend: Node.js, Express 5, express-session, bcryptjs, cors
- Database: MySQL (mysql2)
- Config: dotenv
- Optional Session Store: express-mysql-session (or Redis via connect-redis)

## 📁 Project Structure

- backend/ssqueries_be
  - src/server.js, routes/, controllers/, db/
- frontend/ssqueries_fe
  - src/, index.html, vite.config.js

## 🚀 Getting Started (Local)

Prereqs:
- Node.js 18+ (recommended: 20+)
- MySQL running locally or via a cloud instance

1) Clone and install
- git clone <your-repo-url>
- cd backend/ssqueries_be && npm install
- cd ../../frontend/ssqueries_fe && npm install

2) Configure environment variables

Backend (backend/ssqueries_be/.env):
- PORT=8000
- SECRET_KEY=your-strong-random-secret
- MYSQL_URL=mysql://user:pass@localhost:3306/your_db
- NODE_ENV=development

Frontend (frontend/ssqueries_fe/.env):
- VITE_BACKEND_URL=http://localhost:8000

3) Start services

Backend:
- cd backend/ssqueries_be
- npm start
  - or: node src/server.js

Frontend:
- cd frontend/ssqueries_fe
- npm run dev
- Open the printed local URL

## 🗄️ Database Schema (Minimal)
- users table: (id, username, password)
- questions table: (id, user-id, content, created-at, planet)
- answers table: (id, user-id, content, created-at, question-id)
