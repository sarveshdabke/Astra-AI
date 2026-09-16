# 🚀 Astra AI — Next-Gen Developer AI Workspace & Collaborative Community

<div align="center">

![Astra AI Banner](client/public/favicon.png)

[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Groq](https://img.shields.io/badge/Groq-Ultra--Fast_LLM-f55036?style=for-the-badge&logo=fastapi)](https://groq.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**A full-stack, real-time AI-powered developer hub blending private 1-on-1 AI consultations with collaborative community rooms, live code playgrounds, contextual memory recall, learning roadmaps, prompt marketplace, and room challenges.**

[Live Demo](#-deployment-guide) • [Architecture](#-system-architecture--flow) • [Features](#-unique-selling-propositions-usps) • [Getting Started](#-installation--local-setup) • [API Reference](#-api-reference)

</div>

---

## 📖 Overview

Standard chatbots like ChatGPT, Claude, and Gemini isolate users inside private silos without community interaction, code execution, live collaborative problem solving, or personalized persistent memory across sessions without paid plans.

**Astra AI bridges this gap.** Built for modern engineers, students, and tech creators, it unifies ultra-fast LLM intelligence (powered by Groq) with real-time multi-user discussion rooms, an in-browser live code sandbox, automated code reviews, interactive learning paths, and personal memory cards.

---

## 🏆 Unique Selling Propositions (USPs)

### 1. 👥 Real-Time Collaborative Topic Rooms & `@ai` Summoning
- Dedicated topic channels: `#web-dev`, `#app-dev`, `#ai-tech`, `#ui-ux`, `#cloud-devops`, and `#general`.
- Real-time live presence tracking and instant cross-user messaging via WebSockets (Socket.io).
- **Summon Astra AI**: Type `@ai` anywhere in your message or toggle the AI button to invite Astra into community debates with contextual awareness of recent conversation.

### 2. 💻 In-Browser AI Code Playground & Security Reviewer
- Sandboxed live execution environment for **JavaScript**, **HTML/CSS**, and algorithm benchmarks.
- Live console log interception and isolated iframe execution.
- **AI Code Review**: In-depth static audit delivering actionable feedback on **Security & Vulnerabilities**, **Performance & Efficiency**, **Best Practices**, and a rewritten **Optimized Version**.

### 3. 🧠 Contextual AI Memory Cards & Long-Term Recall
- Auto-extracts or manually saves developer facts, tech stacks, coding preferences, and project facts.
- **Dynamic Context Injection**: Every 1-on-1 conversation automatically retrieves the user's active memory cards, tailoring responses to their preferred libraries, language versions, and architectural patterns.

### 4. 🗺️ AI-Generated Personalized Learning Roadmaps
- Transforms career goals (e.g., *"Become a Senior Full-Stack Engineer"*) into structured, multi-week milestones.
- Milestone tracking with completion checkboxes, skill tags, recommended community rooms, and suggested hands-on capstone projects.

### 5. 📚 Community Prompt Marketplace
- Curated and community-contributed prompt templates with categories, tags, and search.
- One-click **Fork into Chat**, star ratings, and community sharing.

### 6. 🏆 Room Coding Challenges & AI Hackathon Judge
- Real-time developer challenges seeded across tech rooms with difficulty ratings, points, and starter code.
- **AI Automated Judge**: Evaluates submitted code against test cases and criteria, generating a score (0-100), pass/fail status, and line-by-line constructive feedback.

### 7. 🎙️ Dual-Channel Voice Assistant
- Integrated hands-free voice experience with Web Speech API recognition (speech-to-text) and speech synthesis (text-to-speech).
- Auto-speak mode for hands-free coding sessions with intelligent markdown filtering.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom glassmorphism and modern dark aesthetic
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) (Google Identity Services)
- **Real-Time Client**: [Socket.io-client](https://socket.io/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Web Framework**: [Express.js](https://expressjs.com/)
- **Real-Time Server**: [Socket.io](https://socket.io/) (WebSockets + Polling fallback)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) via [Mongoose ODM](https://mongoosejs.com/)
- **AI Inference Engine**: [Groq Cloud SDK](https://console.groq.com/) (`openai/gpt-oss-120b`, `llama-3.3-70b-versatile`, `qwen/qwen3.8-27b`)
- **Security & Utilities**: CORS, dotenv, custom DNS resolution fallback

### DevOps & Keep-Alive Automation
- **Backend Hosting**: [Render](https://render.com/) (Web Service)
- **Frontend Hosting**: [Vercel](https://vercel.com/) / [Netlify](https://www.netlify.com/)
- **Free-Tier Keep-Alive**: GitHub Actions Scheduled Workflow (runs every 14 minutes against `/health` to eliminate cold starts)

---

## 📐 System Architecture & Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                           CLIENT (Vite + React 19)              │
│  ┌───────────────────────┐             ┌──────────────────────┐  │
│  │   Direct 1-on-1 Chat  │             │ Topic Rooms & USPs   │  │
│  │   • Voice I/O         │             │ • Code Playground    │  │
│  │   • Memory Recalls    │             │ • Prompt Market      │  │
│  │   • Markdown / Code   │             │ • Learning Roadmaps  │  │
│  └──────────┬────────────┘             └──────────┬───────────┘  │
└─────────────┼─────────────────────────────────────┼──────────────┘
              │ REST (Axios)                        │ WebSockets (Socket.io)
              ▼                                     ▼
┌──────────────────────────────────────────────────────────────────┐
│                   BACKEND SERVER (Express + Socket.io)          │
│                                                                  │
│   ┌─────────────────────┐               ┌────────────────────┐   │
│   │   REST Controllers  │               │   Socket Handler   │   │
│   │   • /api/chat       │               │   • join_room      │   │
│   │   • /api/memory     │               │   • send_room_msg  │   │
│   │   • /api/roadmaps   │               │   • @ai summoning  │   │
│   │   • /api/challenges │               │   • room_presence  │   │
│   │   • /health (Ping)  │               └─────────┬──────────┘   │
│   └──────────┬──────────┘                         │              │
└──────────────┼────────────────────────────────────┼──────────────┘
               │                                    │
               ├───────────────────┬────────────────┘
               ▼                   ▼
     ┌──────────────────┐ ┌──────────────────┐
     │  MongoDB Atlas   │ │  Groq Cloud SDK  │
     │  (Database)      │ │  (AI Inference)  │
     └──────────────────┘ └──────────────────┘
               ▲
               │ Ping every 14 mins
     ┌──────────────────┐
     │  GitHub Actions  │
     │  (Keep-Alive CI) │
     └──────────────────┘
```

### 1-on-1 Chat with Memory Injection Flow
1. User sends a message via UI or Voice.
2. Express fetches recent conversation history from MongoDB.
3. Express retrieves the user's active **Memory Cards** (preferences, tech stack).
4. A dynamic system prompt is constructed with the user's recalled profile.
5. Groq generates an ultra-fast tailored response and streams it back.
6. The conversation and timestamp are saved in MongoDB.

### Real-Time Topic Room Flow
1. User enters a topic room (e.g. `#web-dev`); Socket.io emits `join_room`.
2. Online presence count updates live for all members in that room.
3. Chat messages broadcast to room members via `new_room_message`.
4. If `@ai` is present, Astra AI analyzes recent messages, generates an expert reply, and emits it to the channel.

---

## 📂 Project Directory Structure

```
my-ai-chatbot/
├── .github/
│   └── workflows/
│       └── render-keep-alive.yml     # GitHub Actions 14-min keep-alive ping
├── client/                           # Frontend (React 19 + Vite)
│   ├── public/
│   │   └── favicon.png               # Custom Astra AI hologram logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatMessage.jsx       # Markdown & syntax highlighted bubbles
│   │   │   ├── CodePlayground.jsx    # Live code editor, iframe sandbox & AI review
│   │   │   ├── EmptyState.jsx        # Onboarding prompt suggestion cards
│   │   │   ├── LearningRoadmaps.jsx  # AI roadmap generator & milestone tracker
│   │   │   ├── MemoryCards.jsx       # Contextual memory cards & auto-extractor
│   │   │   ├── PromptMarketplace.jsx # Prompt sharing, forks & search
│   │   │   ├── RoomChallenges.jsx    # Coding challenges & AI hackathon judge
│   │   │   ├── RoomMessageBubble.jsx # Multi-user room chat bubbles
│   │   │   ├── RoomView.jsx          # Room layout, member count & input bar
│   │   │   ├── Sidebar.jsx           # Dual-mode navigation & chat management
│   │   │   └── TypingIndicator.jsx   # Animated pulsating indicator
│   │   ├── hooks/
│   │   │   └── useVoice.js           # Web Speech API recognition & speech hook
│   │   ├── App.css                   # Glassmorphism & animation styles
│   │   ├── App.jsx                   # Main orchestration & state manager
│   │   ├── config.js                 # Centralized API URL & OAuth environment keys
│   │   ├── index.css                 # Tailwind directives & CSS variables
│   │   ├── Login.jsx                 # Futuristic Google OAuth login page
│   │   └── main.jsx                  # React DOM root with GoogleOAuthProvider
│   ├── .env.example                  # Client environment template
│   ├── index.html                    # Root HTML document
│   ├── package.json                  # Client dependencies & scripts
│   └── vite.config.js                # Vite build configuration
├── server/                           # Backend (Node.js ESM + Express)
│   ├── config/
│   │   └── db.js                     # MongoDB connection with DNS resolvers
│   ├── models/
│   │   ├── Challenge.js              # Challenge & submission schema
│   │   ├── Chat.js                   # 1-on-1 chat history schema
│   │   ├── MemoryCard.js             # User preferences & memory card schema
│   │   ├── Prompt.js                 # Marketplace prompt schema
│   │   ├── Roadmap.js                # Personalized roadmap schema
│   │   ├── RoomMessage.js            # Topic room message schema
│   │   └── User.js                   # User profile & authentication schema
│   ├── routes/
│   │   ├── authRoutes.js             # Google login & session handler
│   │   ├── challengeRoutes.js        # Coding challenge queries & AI grading
│   │   ├── chatRoutes.js             # Chat history, creation & renaming
│   │   ├── memoryRoutes.js           # Memory card CRUD & AI fact extraction
│   │   ├── promptRoutes.js           # Marketplace prompts & star/fork actions
│   │   ├── roadmapRoutes.js          # AI career roadmap generation
│   │   └── roomRoutes.js             # Topic room definitions & message archive
│   ├── .env.example                  # Server environment template
│   ├── index.mjs                     # Express app, Socket.io & Groq orchestration
│   └── package.json                  # Server dependencies & scripts
├── .gitignore                        # Git exclusion rules
└── README.md                         # Project documentation
```

---

## ⚙️ Requirements & Prerequisites

- **Node.js**: Version `18.0.0` or higher
- **npm** or **yarn**
- **MongoDB Atlas Database**: Free cluster connection string (`mongodb+srv://...`)
- **Groq Cloud API Key**: Free API key from [console.groq.com](https://console.groq.com)
- **Google OAuth Client ID**: Client ID from [Google Cloud Console](https://console.cloud.google.com/)

---

## 🔐 Environment Variables Setup

### 1. Server Configuration (`server/.env`)
Create a file named `.env` inside the `server/` directory:

```env
# Groq API Key from console.groq.com
GROQ_API_KEY=gsk_your_groq_api_key_here

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/astraDB?retryWrites=true&w=majority

# Preferred Groq Model (optional fallback: qwen/qwen3.8-27b)
GROQ_MODEL=openai/gpt-oss-120b

# Server port
PORT=5000
```

### 2. Client Configuration (`client/.env`)
Create a file named `.env` inside the `client/` directory:

```env
# URL of your backend server (Local: http://localhost:5000 | Production: https://your-backend.onrender.com)
VITE_API_URL=http://localhost:5000

# Google OAuth 2.0 Web Client ID
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## 🚀 Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/my-ai-chatbot.git
cd my-ai-chatbot
```

### 2. Install & Start Backend Server
```bash
cd server
npm install
npm start
```
*The server will start on `http://localhost:5000` and connect to MongoDB.*

### 3. Install & Start Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
*The client dev server will launch at `http://localhost:5173`.*

---

## 📡 API Reference

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Lightweight keep-alive status returning uptime and ISO timestamp. |

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/google-login` | Authenticate or register a user via Google OAuth payload. |

### 1-on-1 AI Chat
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send message to Astra AI with memory recall context. |
| `POST` | `/api/chat/create` | Create a new conversation session. |
| `GET` | `/api/chat/history/:userId` | Get list of user's past conversations. |
| `GET` | `/api/chat/conversation/:chatId` | Get full message thread for a chat session. |
| `PUT` | `/api/chat/:chatId/rename` | Rename a conversation session. |
| `DELETE`| `/api/chat/:chatId` | Delete a conversation session. |

### Code Playground
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/review-code` | Deep structured code review (Security, Performance, Best Practices, Rewrite). |

### Topic Rooms
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/rooms` | Retrieve available topic rooms. |
| `GET` | `/api/rooms/:roomId/messages`| Retrieve historical messages for a room. |

### Memory Cards
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/memory/:userId` | Get all saved memory cards for a user. |
| `POST` | `/api/memory` | Manually save a new memory card. |
| `POST` | `/api/memory/extract` | Auto-extract structured memory facts from conversation text. |
| `DELETE`| `/api/memory/:id` | Delete a memory card. |

### Prompt Marketplace
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/prompts` | List prompts with search, category, and sorting filters. |
| `POST` | `/api/prompts` | Create a community prompt. |
| `POST` | `/api/prompts/:id/star` | Star or unstar a prompt. |
| `POST` | `/api/prompts/:id/fork` | Increment fork count when loaded into chat. |

### Learning Roadmaps
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/roadmaps/:userId` | Retrieve user's active roadmaps. |
| `POST` | `/api/roadmaps/generate` | Generate customized 5-milestone roadmap using AI. |
| `PATCH`| `/api/roadmaps/:id/milestone/:mId` | Update milestone completion status (`pending`, `in-progress`, `completed`). |
| `DELETE`| `/api/roadmaps/:id` | Delete a roadmap. |

### Room Challenges
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/challenges` | Get coding challenges by room or all. |
| `POST` | `/api/challenges/:id/submit` | Submit code solution for automated AI evaluation and scoring. |

---

## 🚢 Deployment Guide

### 1. Backend on Render (Web Service)
1. In the [Render Dashboard](https://dashboard.render.com/), select **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas URI
   - `GROQ_API_KEY`: Your Groq API key
   - `PORT`: `5000`
5. Click **Create Web Service** and copy your assigned URL (e.g. `https://astra-ai-backend.onrender.com`).

### 2. Frontend on Vercel
1. In the [Vercel Dashboard](https://vercel.com/), click **Add New Project** and import your repository.
2. In Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Under **Environment Variables**, add:
   - `VITE_API_URL`: Your Render backend URL (e.g. `https://astra-ai-backend.onrender.com`)
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
4. Click **Deploy**.

### 3. Keep Render Awake (GitHub Actions)
1. Go to your repository **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret**.
3. Name: `RENDER_BACKEND_URL`
4. Value: `https://your-backend.onrender.com`
5. The scheduled workflow [.github/workflows/render-keep-alive.yml](.github/workflows/render-keep-alive.yml) will ping `/health` every 14 minutes.

### 4. Google Cloud Console Configuration
1. Open [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Edit your OAuth 2.0 Web Client ID.
3. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173` (for local development)
   - `https://your-app.vercel.app` (your production URL)
4. Save changes.

---

## 🤝 Contributing

Contributions, feature suggestions, and bug reports are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ by Developers, for Developers. Powered by Astra AI & Groq Engine.</sub>
</div>
