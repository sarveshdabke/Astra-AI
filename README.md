# 🌌 Astra AI — Next-Gen Real-Time AI Developer Workspace & Collaborative Community

<div align="center">

<img src="client/public/favicon.png" alt="Astra AI Hologram Logo" width="110" height="110" />

### **Supercharge your code with Ultra-Fast Groq AI, Live Sandboxes, and Real-Time Multi-User Collaboration.**

[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Groq LPU](https://img.shields.io/badge/Groq-LPU_Inference-f55036?style=for-the-badge&logo=fastapi)](https://groq.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

[🌟 Key Features](#-key-features) • [🖼️ UI Showcase](#-ui-showcase-gallery) • [📐 Architecture](#-system-architecture--data-flow) • [📂 Project Structure](#-project-directory-structure) • [⚙️ Requirements](#-system-requirements--prerequisites) • [🔐 Environment Setup](#-environment-variables-configuration) • [🚀 Quickstart](#-installation--local-setup) • [📡 API Reference](#-api--websocket-reference) • [🚢 Deployment](#-production-deployment-guide) • [⭐ Star Repo](#-community--call-to-action)

</div>

---

## 📌 Executive Overview

Conventional AI chatbots (ChatGPT, Claude, Gemini) confine developers within isolated, one-on-one silos. They lack **live collaborative multiplayer workspaces**, **real-time sandboxed code execution**, **persistent user-tailored memory recall across sessions**, and **structured developer growth systems**.

**Astra AI bridges this chasm.** Built specifically for software engineers, tech creators, and students, Astra AI pairs sub-second **Groq LPU LLM inference** (`gpt-oss-120b`, `llama-3.3-70b`, `qwen3.8-27b`) with **real-time Socket.io topic channels**, an **in-browser live execution playground & security auditor**, **developer memory vaults**, **AI-crafted learning roadmaps**, and **competitive room hackathons with an automated AI judge**.

Designed with **glassmorphism dark aesthetics** and fully responsive across mobile (iOS/Android), tablets, laptops, and ultra-wide desktop monitors.

---

## 🖼️ UI Showcase Gallery

Explore the modern, dark-mode glassmorphic user experience of Astra AI across its primary workspaces:

| 🔐 Modern Authentication & Guest Portal | 🌐 Google OAuth 2.0 Web Client |
| :---: | :---: |
| <img src="Demo%20Images/Screenshot%20(246).png" alt="Astra AI Login Screen" width="100%" /> | <img src="Demo%20Images/Screenshot%20(247).png" alt="Google OAuth Sign-In" width="100%" /> |
| *Split-screen cyberpunk auth, live Groq status badge, interactive feature preview tabs & guest sandbox.* | *Fast, frictionless Google One-Tap & standard OAuth 2.0 authentication flow.* |

| 💬 1-on-1 AI Assistant & Voice Hub | 👥 Real-Time Topic Rooms (`@ai` Summoning) |
| :---: | :---: |
| <img src="Demo%20Images/Screenshot%20(248).png" alt="1-on-1 AI Assistant" width="100%" /> | <img src="Demo%20Images/Screenshot%20(249).png" alt="Collaborative Topic Rooms" width="100%" /> |
| *Streaming LPU reasoning, interactive quick prompts, speech-to-text voice input, and markdown code blocks.* | *WebSocket channels (`#web-dev`, `#ai-tech`, etc.), live presence, and contextual `@ai` bot summoning.* |

| 💻 In-Browser Code Playground | 📚 Community Prompt Marketplace |
| :---: | :---: |
| <img src="Demo%20Images/Screenshot%20(252).png" alt="Live Code Playground" width="100%" /> | <img src="Demo%20Images/Screenshot%20(250).png" alt="Prompt Marketplace" width="100%" /> |
| *Sandboxed JS/HTML live runner, isolated iframe console, presets, and AI security & performance auditor.* | *Explore, search, star, copy, and fork battle-tested developer prompts straight into chat.* |

| 🧠 Contextual Memory Cards Vault | 🗺️ AI-Generated Learning Roadmaps |
| :---: | :---: |
| <img src="Demo%20Images/Screenshot%20(251).png" alt="Memory Cards Vault" width="100%" /> | <img src="Demo%20Images/Screenshot%20(253).png" alt="Learning Roadmaps" width="100%" /> |
| *Long-term developer memory cards (tech stack, coding preferences) auto-injected into every prompt context.* | *Turn career aspirations into 5-milestone actionable roadmaps with progress tracking.* |

| 🏆 Room Coding Challenges | 🤖 Automated AI Hackathon Judge |
| :---: | :---: |
| <img src="Demo%20Images/Screenshot%20(254).png" alt="Room Challenges" width="100%" /> | <img src="Demo%20Images/Screenshot%20(255).png" alt="AI Hackathon Judge" width="100%" /> |
| *Timed algorithmic and architectural challenges seeded across channels with starter code and XP.* | *Instant code evaluation scoring (0-100), pass/fail criteria validation, and actionable optimization feedback.* |

---

## ✨ Key Features & Technical USPs

### 1. ⚡ Ultra-Fast AI Reasoning (Powered by Groq Cloud)
- **Sub-250ms Median Latency**: Powered by Groq's Tensor Streaming Processors (LPUs) delivering 480+ tokens per second.
- **Top Open LLM Architectures**: Out-of-the-box support for `openai/gpt-oss-120b`, `llama-3.3-70b-versatile`, and `qwen/qwen3.8-27b`.
- **Intelligent Fallbacks**: Automatic fallback handling ensures continuous uptime even during upstream API surges.

### 2. 👥 Real-Time Collaborative Topic Channels & `@ai` Summoning
- **Pre-Configured Tech Channels**: `#web-dev`, `#app-dev`, `#ai-tech`, `#ui-ux`, `#cloud-devops`, and `#general`.
- **Live Multiplayer Presence**: Instant tracking of online engineers per room via persistent WebSocket connections.
- **`@ai` Intelligent Summoning**: Type `@ai` anywhere in your message or click the Summon button. Astra AI ingests the channel's recent conversation thread and injects high-context solutions into the group debate.

### 3. 💻 In-Browser Live Code Sandbox & AI Auditor
- **Sandboxed Execution Engine**: Run modern JavaScript, HTML5, Canvas, and CSS directly in an isolated browser iframe.
- **Live Console Log Interception**: Captures `console.log`, `warn`, and `error` outputs with interactive execution timing.
- **4-Pillar AI Code Review**:
  - 🛡️ **Security & Vulnerabilities**: Detects XSS, injection vectors, and prototype pollution risks.
  - ⚡ **Performance & Big-O**: Identifies memory leaks, unindexed lookups, and algorithmic bottlenecks.
  - 💎 **Modern Best Practices**: Enforces clean architecture, typing, and readability.
  - 🔄 **Production Rewrite**: Complete drop-in optimized refactoring.

### 4. 🧠 Contextual Memory Cards & Developer Profile Vault
- **Dynamic Context Injection**: Every 1-on-1 query automatically retrieves the user's saved preferences, favorite frameworks, runtime versions, and style guidelines.
- **AI Auto-Extraction**: Click "AI Auto-Extract" to let Astra parse your recent conversations and automatically harvest key facts into structured cards.
- **Zero Repetition**: Never tell the AI what stack or styling system you use again.

### 5. 🗺️ AI-Powered Learning Roadmaps
- **Goal-to-Curriculum Generation**: Enter any target role or technology (e.g., *"Cloud Native Go Developer"*, *"Zero-Knowledge Cryptography"*).
- **Milestone Tracking**: Interactive 5-phase breakdown with status indicators (`pending`, `in-progress`, `completed`), skill tags, and capstone project assignments.

### 6. 📚 Community Prompt Marketplace
- **Curated Developer Prompts**: Categories spanning AI & ML, Clean Code Refactoring, UI/UX Glassmorphism, React Hooks, and CI/CD Automation.
- **1-Click Forking**: Click "Use Prompt" to instantly hydrate the prompt directly into your active chat session.

### 7. 🏆 Topic Room Challenges & Automated AI Hackathon Judge
- **Channel-Specific Contests**: Timed problem solving tied to channel topics with XP rewards and starter boilerplates.
- **Automated AI Grading**: Submissions undergo instant test verification, receiving a score out of 100, pass/fail status, and line-by-line constructive critique.

### 8. 🎙️ Dual-Channel Voice Assistant
- **Speech-to-Text Recognition**: Built-in Web Speech API microphone dictation for hands-free coding queries.
- **Smart Text-to-Speech Synthesis**: Reads AI responses aloud with automatic markdown, code block, and emoji filtering.

### 9. 📱 100% Fully Responsive Design
- Crafted from the ground up to render flawlessly on **iOS Safari**, **Android Chrome**, iPads, foldable devices, and 4K desktop screens.
- Utilizes CSS dynamic viewport units (`100dvh`), iOS safe-area insets (`env(safe-area-inset-bottom)`), and responsive mobile split-view drawers.

---

## 📐 System Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                  CLIENT LAYER (React 19 + Vite)                         │
│                                                                                         │
│   ┌──────────────────────────┐  ┌───────────────────────────┐  ┌────────────────────┐   │
│   │   1-on-1 AI Assistant    │  │   Topic Channels & @ai    │  │  Live Code Sandbox │   │
│   │   • Voice Dictation / TTS│  │   • Live Presence Tracker │  │  • Iframe Runner   │   │
│   │   • Context Recall Inject│  │   • Multi-User WebSockets │  │  • AI Code Auditor │   │
│   └─────────────┬────────────┘  └─────────────┬─────────────┘  └──────────┬─────────┘   │
└─────────────────┼─────────────────────────────┼───────────────────────────┼─────────────┘
                  │ REST (Axios)                │ WebSockets (Socket.io)    │ REST
                  ▼                             ▼                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           SERVER LAYER (Node.js ESM + Express)                          │
│                                                                                         │
│   ┌──────────────────────────────┐                ┌─────────────────────────────────┐   │
│   │       REST Controllers       │                │      Socket.io Event Server     │   │
│   │  • /api/chat   • /api/memory │                │  • join_room    • room_presence │   │
│   │  • /api/roadmaps • /api/judge│                │  • send_room_msg• ai_summoning  │   │
│   │  • /api/prompts • /health    │                │  • disconnect   • room_messages │   │
│   └──────────────┬───────────────┘                └────────────────┬────────────────┘   │
└──────────────────┼─────────────────────────────────────────────────┼────────────────────┘
                   │                                                 │
                   ├───────────────────────┬─────────────────────────┘
                   ▼                       ▼
       ┌──────────────────────┐ ┌──────────────────────┐
       │    MongoDB Atlas     │ │    Groq Cloud LPU    │
       │   (State & Stores)   │ │  (Sub-Second LLMs)   │
       │                      │ │                      │
       │ • Users & OAuth      │ │ • gpt-oss-120b       │
       │ • Chat Histories     │ │ • llama-3.3-70b      │
       │ • Memory Cards Vault │ │ • qwen3.8-27b        │
       │ • Roadmaps & Prompts │ └──────────────────────┘
       │ • Room Transcripts   │            ▲
       └──────────────────────┘            │ Keep-alive ping (every 14 mins)
                                ┌──────────────────────┐
                                │ GitHub Actions Cron  │
                                └──────────────────────┘
```

---

## 📂 Project Directory Structure

```
Astra-AI/
├── .github/
│   └── workflows/
│       └── render-keep-alive.yml      # Automated 14-min cron ping to eliminate cold starts
├── Demo Images/                       # High-resolution application screenshots
│   ├── Screenshot (246).png           # Futuristic Auth & Login UI
│   ├── Screenshot (247).png           # Google OAuth 2.0 Sign-In modal
│   ├── Screenshot (248).png           # 1-on-1 AI Assistant onboarding screen
│   ├── Screenshot (249).png           # Collaborative topic channels with @ai
│   ├── Screenshot (250).png           # Community Prompt Marketplace
│   ├── Screenshot (251).png           # Contextual AI Memory Cards Vault
│   ├── Screenshot (252).png           # In-Browser Live Code Sandbox & AI Auditor
│   ├── Screenshot (253).png           # AI Learning Roadmaps & Milestones
│   ├── Screenshot (254).png           # Room Challenges & Starter Code
│   └── Screenshot (255).png           # AI Hackathon Judge & Scoring Report
├── client/                            # Frontend Single Page Application
│   ├── public/
│   │   ├── favicon.png                # Holographic Astra AI logo
│   │   ├── favicon.svg                # Vector SVG icon
│   │   └── icons.svg                  # SVG symbol sprite definitions
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatMessage.jsx        # Markdown rendering, code highlighting & copy button
│   │   │   ├── CodePlayground.jsx     # Live code editor, sandboxed iframe & AI review report
│   │   │   ├── EmptyState.jsx         # Onboarding cards & quick prompt starters
│   │   │   ├── LearningRoadmaps.jsx   # AI personalized career path generator & milestones
│   │   │   ├── MemoryCards.jsx        # Developer context memory vault & AI auto-extractor
│   │   │   ├── PromptMarketplace.jsx  # Prompt discovery, search, tags, stars & forking
│   │   │   ├── RoomChallenges.jsx     # Coding contests & automated AI hackathon judge
│   │   │   ├── RoomMessageBubble.jsx  # Multi-user message bubbles with bot badges
│   │   │   ├── RoomView.jsx           # Channel header, online count, chat thread & @ai button
│   │   │   ├── Sidebar.jsx            # Responsive navigation drawer & session manager
│   │   │   └── TypingIndicator.jsx    # Pulsing neon animated AI typing indicator
│   │   ├── hooks/
│   │   │   └── useVoice.js            # Web Speech API recognition & speech synthesis hook
│   │   ├── App.css                    # Glassmorphism, animations, responsive layout rules
│   │   ├── App.jsx                    # Root state coordinator & tab router
│   │   ├── config.js                  # Centralized API URLs & Google OAuth Client ID
│   │   ├── index.css                  # Global Tailwind directives, CSS variables & resets
│   │   ├── Login.jsx                  # Futuristic split-screen authentication screen
│   │   └── main.jsx                   # React 19 entry point with GoogleOAuthProvider
│   ├── .env.example                   # Client environment variables blueprint
│   ├── index.html                     # HTML5 entry with mobile viewport-fit=cover
│   ├── package.json                   # Client dependencies & scripts
│   ├── tailwind.config.js             # Tailwind design system configuration
│   └── vite.config.js                 # Vite bundler configuration
├── server/                            # Backend Node.js Server & APIs
│   ├── config/
│   │   └── db.js                      # Resilient MongoDB Atlas connection with DNS fallback
│   ├── models/
│   │   ├── Challenge.js               # Challenge schema with starter code & submissions
│   │   ├── Chat.js                    # 1-on-1 chat history schema with nested messages
│   │   ├── MemoryCard.js              # Context memory schema with category & tags
│   │   ├── Prompt.js                  # Marketplace prompt schema with star/fork counters
│   │   ├── Roadmap.js                 # Career roadmap schema with milestones
│   │   ├── RoomMessage.js             # Topic channel message schema
│   │   └── User.js                    # User profile schema with Google identity info
│   ├── routes/
│   │   ├── auth.mjs                   # Google OAuth verification & guest login endpoint
│   │   ├── challenges.mjs             # Challenge listing & AI judge evaluation route
│   │   ├── chat.mjs                   # Chat sessions, streaming inference & history CRUD
│   │   ├── memory.mjs                 # Memory card CRUD & AI fact extraction route
│   │   ├── prompts.mjs                # Marketplace prompt search, stars, and forks
│   │   ├── roadmaps.mjs               # AI curriculum generation & milestone status update
│   │   └── rooms.mjs                  # Topic room metadata & archive retrieval
│   ├── .env.example                   # Server environment variables blueprint
│   ├── index.mjs                      # Express app setup, Socket.io broker & Groq client
│   └── package.json                   # Server dependencies & scripts
├── .gitignore                         # Comprehensive git exclusion rules
├── LICENSE                            # MIT Open Source License
└── README.md                          # Complete project documentation & guide
```

---

## ⚙️ System Requirements & Prerequisites

Ensure the following tools and services are available before running Astra AI:

- **Node.js**: `v18.0.0` or higher (Recommended: LTS `v20.x`)
- **Package Manager**: `npm` (v9+), `yarn`, or `pnpm`
- **MongoDB Database**: Free cloud cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) or a local instance
- **Groq Cloud API Key**: Free API key from [console.groq.com](https://console.groq.com/keys)
- **Google Cloud Console Credentials**: OAuth 2.0 Web Client ID from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

---

## 🔐 Environment Variables Configuration

Astra AI requires environment configuration files for both the frontend (`client/.env`) and backend (`server/.env`).

### 1. Client Environment (`client/.env`)

Copy the client template and configure:

```bash
cd client
cp .env.example .env
```

| Variable | Required | Description | Example Value |
|---|:---:|---|---|
| `VITE_API_URL` | **Yes** | URL of your Express & Socket.io backend (no trailing slash) | `http://localhost:5000` |
| `VITE_GOOGLE_CLIENT_ID` | **Yes** | Google OAuth 2.0 Web Client ID for Google Single Sign-On | `your_id.apps.googleusercontent.com` |

> [!TIP]
> Make sure to add `http://localhost:5173` to your **Authorized JavaScript origins** in Google Cloud Console.

### 2. Server Environment (`server/.env`)

Copy the server template and configure:

```bash
cd ../server
cp .env.example .env
```

| Variable | Required | Description | Example Value |
|---|:---:|---|---|
| `PORT` | Optional | Port for the Express server to listen on | `5000` |
| `MONGO_URI` | **Yes** | MongoDB connection string (Atlas or Local) | `mongodb+srv://user:pass@cluster.mongodb.net/astraDB` |
| `GROQ_API_KEY` | **Yes** | Groq Cloud API key for ultra-fast LPU inference | `gsk_your_groq_api_key_here` |
| `GROQ_MODEL` | Optional | Target LLM model (default: `openai/gpt-oss-120b`) | `openai/gpt-oss-120b` |
| `GOOGLE_CLIENT_ID` | **Yes** | Google OAuth Client ID for server token verification | `your_id.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth Client Secret | `your_client_secret_here` |

---

## 🚀 Installation & Local Setup

Get Astra AI up and running locally in under 3 minutes:

### Step 1: Clone the Repository
```bash
git clone https://github.com/sarveshdabke/Astra-AI.git
cd Astra-AI
```

### Step 2: Setup and Run the Server
Open a terminal for the backend:
```bash
cd server
npm install
npm start
```
*The server will start listening at `http://localhost:5000` and connect to your MongoDB database.*

### Step 3: Setup and Run the Client
Open a second terminal for the frontend:
```bash
cd client
npm install
npm run dev
```
*Vite will launch the hot-reloading development server at `http://localhost:5173`.*

### Step 4: Open in Browser
Visit **`http://localhost:5173`** in your browser. You can immediately click **"Explore as Guest Developer"** to test everything with zero setup, or log in with your Google account!

---

## 📡 API & WebSocket Reference

### 🌐 REST API Endpoints

#### Health & Diagnostics
| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/health` | Server uptime status and ping check for keep-alive monitoring. |

#### Authentication
| Method | Endpoint | Description |
|:---:|---|---|
| `POST` | `/api/auth/google` | Verifies Google OAuth token, creates/retrieves user profile. |
| `POST` | `/api/auth/guest` | Generates a quick temporary guest session. |

#### 1-on-1 AI Chat
| Method | Endpoint | Description |
|:---:|---|---|
| `POST` | `/api/chat` | Send prompt to Astra AI with contextual memory injection. |
| `POST` | `/api/chat/new` | Create a new isolated chat session. |
| `GET` | `/api/chat/history/:userId` | Fetch all historical conversations for a user. |
| `GET` | `/api/chat/:chatId` | Retrieve full message thread for a chat session. |
| `DELETE` | `/api/chat/:chatId` | Delete a specific conversation session. |

#### Code Playground & AI Auditor
| Method | Endpoint | Description |
|:---:|---|---|
| `POST` | `/api/ai/review-code` | Performs 4-pillar static security & performance code audit. |

#### Contextual Memory Cards
| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/api/memory/:userId` | Retrieve all active memory cards for a user. |
| `POST` | `/api/memory` | Create a new memory card manually. |
| `POST` | `/api/memory/extract` | Auto-extract facts & preferences from chat history. |
| `DELETE` | `/api/memory/:id` | Delete an existing memory card. |

#### AI Learning Roadmaps
| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/api/roadmaps/:userId` | Get user's learning roadmaps. |
| `POST` | `/api/roadmaps/generate` | Generate a 5-milestone roadmap for a specific tech goal. |
| `PATCH` | `/api/roadmaps/:id/milestone/:mId` | Update milestone completion status. |
| `DELETE` | `/api/roadmaps/:id` | Remove a roadmap. |

#### Prompt Marketplace
| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/api/prompts` | List marketplace prompts with search and tag filters. |
| `POST` | `/api/prompts` | Publish a new community prompt. |
| `POST` | `/api/prompts/:id/star` | Star or unstar a prompt card. |
| `POST` | `/api/prompts/:id/fork` | Increment fork counter when loaded into chat. |

#### Room Challenges & AI Judge
| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/api/challenges` | List coding challenges by room or difficulty. |
| `POST` | `/api/challenges/:id/submit` | Submit code solution for automated AI evaluation and scoring. |

---

### ⚡ WebSocket Events (Socket.io)

| Event Name | Direction | Payload | Description |
|---|:---:|---|---|
| `join_room` | Client ➔ Server | `{ roomId, user }` | Joins a designated topic channel. |
| `leave_room` | Client ➔ Server | `{ roomId }` | Leaves the designated topic channel. |
| `send_room_message` | Client ➔ Server | `{ roomId, text, user }` | Broadcasts message; triggers `@ai` logic if present. |
| `new_room_message` | Server ➔ Client | Message Object | Delivers new message to all members in room. |
| `ai_room_response` | Server ➔ Client | Message Object | Delivers Astra AI's contextual response to room. |
| `room_presence` | Server ➔ Client | `{ roomId, onlineCount }` | Real-time active member count in the channel. |

---

## 🚢 Production Deployment Guide

### Deploying the Backend on Render
1. Go to [Render.com](https://render.com) and create a **New Web Service**.
2. Connect your GitHub repository (`sarveshdabke/Astra-AI`).
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `node index.mjs`.
6. Add your environment variables:
   - `MONGO_URI`
   - `GROQ_API_KEY`
   - `GROQ_MODEL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
7. Click **Deploy Web Service** and copy your live backend URL (`https://your-backend.onrender.com`).

### Deploying the Frontend on Vercel
1. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Import the `sarveshdabke/Astra-AI` repository.
3. Configure the build settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, provide:
   - `VITE_API_URL`: Your Render backend URL (e.g. `https://your-backend.onrender.com`)
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
5. Click **Deploy**.

### Prevent Render Free-Tier Sleep (GitHub Actions)
The included workflow [`.github/workflows/render-keep-alive.yml`](.github/workflows/render-keep-alive.yml) automatically pings your server's `/health` endpoint every 14 minutes.
1. In your GitHub repository, navigate to **Settings** ➔ **Secrets and variables** ➔ **Actions**.
2. Click **New repository secret**.
3. Name: `RENDER_BACKEND_URL`
4. Value: `https://your-backend.onrender.com`

---

## 🤝 Contributing & Community

Contributions are what make the open-source community an incredible place to learn, inspire, and create! Any contributions you make are **greatly appreciated**.

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'feat: Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

---

## 📄 License

Distributed under the **MIT License**. See the [`LICENSE`](LICENSE) file for complete details.

---

## 🌟 Community & Call To Action

<div align="center">

### **Enjoying Astra AI? Give it a Star! ⭐**

If Astra AI helped you learn, code faster, or build real-time AI apps, please consider starring the repository to support its development!

<br/>

[![GitHub Stars](https://img.shields.io/github/stars/sarveshdabke/Astra-AI?style=social)](https://github.com/sarveshdabke/Astra-AI)
[![GitHub Forks](https://img.shields.io/github/forks/sarveshdabke/Astra-AI?style=social)](https://github.com/sarveshdabke/Astra-AI)
[![GitHub Watchers](https://img.shields.io/github/watchers/sarveshdabke/Astra-AI?style=social)](https://github.com/sarveshdabke/Astra-AI)

<br/>

<a href="https://github.com/sarveshdabke/Astra-AI/issues/new?template=bug_report.md">
  <img src="https://img.shields.io/badge/Report%20Bug-EA4335?style=for-the-badge&logo=github&logoColor=white" alt="Report Bug" />
</a>
&nbsp;&nbsp;
<a href="https://github.com/sarveshdabke/Astra-AI/issues/new?template=feature_request.md">
  <img src="https://img.shields.io/badge/Request%20Feature-4285F4?style=for-the-badge&logo=github&logoColor=white" alt="Request Feature" />
</a>
&nbsp;&nbsp;
<a href="https://github.com/sarveshdabke/Astra-AI/pulls">
  <img src="https://img.shields.io/badge/Submit%20PR-34A853?style=for-the-badge&logo=github&logoColor=white" alt="Submit PR" />
</a>

<br/><br/>

### 👨‍💻 Created & Maintained by **[Sarvesh Dabke](https://github.com/sarveshdabke)**

*Full-Stack Engineer & AI Systems Developer*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/sarvesh-dabke)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sarveshdabke)
[![Email](https://img.shields.io/badge/Contact-dabkesarvesh7@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:dabkesarvesh7@gmail.com)

<br/>

<sub>Built with passion for the global open-source developer community. Powered by React 19, Socket.io, Express, MongoDB Atlas, and Groq Cloud.</sub>

</div>
