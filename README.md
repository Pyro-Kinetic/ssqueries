<div style="text-align: center;">
  <img src="frontend/ssqueries_fe/src/assets/astronaut.svg" width="80" height="80" alt="Astronaut Logo" />
  <h1>🌌 Solar System Queries</h1>
  <p>
    <a href="https://queries-static.onrender.com">
      <img src="https://img.shields.io/badge/Live%20Demo-🚀%20Visit%20Site-blueviolet?style=for-the-badge&logo=render&logoColor=white" alt="Live Demo" />
    </a>
  </p>
</div>

A full‑stack Q&A app for all things planetary. Users can register, log in, ask questions, and post answers about planets in our solar system. Built with a modern React + Vite frontend and an Express + PostgreSQL backend.

## ✨ Features

- 🔐 User authentication with sessions
- 📝 Post questions and 💬 add answers
- 🗑️ Delete questions and answers (with cascading delete)
- 🪐 Category browsing by planet
- ⚡ Fast React + Vite frontend
- 🕙 View the most recent questions and answers first
- 🗄️ PostgreSQL persistence
- 🛡️ CORS configured for production deployments

## 🧱 Tech Stack

- Frontend: React 19, Vite 7, Axios, CSS Modules
- Backend: Node.js, Express 5, express-session, bcryptjs, cors, validator
- Database: PostgreSQL (pg)
- Config: dotenv
- Optional Session Store: Redis (via connect-redis)

## 📁 Project Structure

- `backend/ssqueries_be`: Express backend server, routes, controllers, and database configuration.
- `frontend/ssqueries_fe`: React/Vite frontend source code and configuration.

## 🚀 Getting Started (Local)

Prereqs:
- Node.js 18+ (recommended: 20+)
- PostgreSQL running locally or via a cloud instance
- (Optional) Redis server for session storage

1) Clone and install
- `git clone <your-repo-url>`
- `cd backend/ssqueries_be && npm install`
- `cd ../../frontend/ssqueries_fe && npm install`

2) Configure environment variables

Use the provided `.env.example` files as templates for your `.env` configuration.

Backend (`backend/ssqueries_be/.env`):
- `PORT=8000`
- `NODE_ENV=development`
- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_USER=your_user`
- `DB_PASSWORD=your_password`
- `DB_NAME=your_db`
- `SESSION_SECRET=a_very_long_random_string`
- `REDIS_URL=redis://localhost:6379`

Frontend (`frontend/ssqueries_fe/.env`):
- `VITE_BACKEND_URL=http://localhost:8000`
- `NODE_ENV=development`

3) Start services

Backend:
- `cd backend/ssqueries_be`
- `npm start`

Frontend:
- `cd frontend/ssqueries_fe`
- `npm run dev`
- Open the printed local URL (typically http://localhost:5173)

## 🗄️ Database Schema (Minimal)
- `users` table: (id, username, password)
- `questions` table: (id, user-id, content, created_at, planet)
- `answers` table: (id, user-id, content, created_at, question-id)
