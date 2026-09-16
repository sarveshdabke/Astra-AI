import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import roomRoutes, { DEFAULT_ROOMS } from "./routes/roomRoutes.js";
import promptRoutes from "./routes/promptRoutes.js";
import memoryRoutes from "./routes/memoryRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import Chat from "./models/Chat.js";
import RoomMessage from "./models/RoomMessage.js";
import MemoryCard from "./models/MemoryCard.js";

dotenv.config();
connectDB();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/prompts", promptRoutes);
app.use("/api/memory", memoryRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/challenges", challengeRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const buildSystemPrompt = (userMemories = []) => {
  let memoryText = "";
  if (userMemories && userMemories.length > 0) {
    memoryText = `\n\n[USER RECALLED CONTEXT & MEMORY CARDS]\nThe following are confirmed facts & preferences about the user you are helping:\n` +
      userMemories.map((m) => `- ${m.topic}: ${m.content} (Confidence: ${m.confidence || 'High'})`).join("\n") +
      `\nAlways tailor your code and recommendations to these saved preferences when relevant.`;
  }

  return {
    role: "system",
    content: `You are Astra AI, an intelligent, helpful, and concise AI coding and knowledge assistant.
  - Provide accurate, well-structured responses.
  - Use clean Markdown formatting (bolding, lists, tables, syntax-highlighted code blocks).
  - Keep a polite, encouraging, and highly technical tone.${memoryText}`
  };
};

app.post("/api/chat", async (req, res) => {
  try {
    const { chatId, message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    if (!chatId) {
      return res.status(400).json({ error: "Chat ID is required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat session not found" });

    let userMemories = [];
    const targetUserId = userId || chat.userId;
    if (targetUserId) {
      userMemories = await MemoryCard.find({ userId: targetUserId }).limit(10);
    }

    const history = chat.messages.slice(-15).map((msg) => ({
      role: msg.role === "bot" ? "assistant" : msg.role,
      content: msg.text,
    }));

    const systemPromptObj = buildSystemPrompt(userMemories);

    const messagesPayload = [
      systemPromptObj,
      ...history,
      { role: "user", content: message },
    ];

    const modelToUse = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
    let chatCompletion;
    try {
      chatCompletion = await groq.chat.completions.create({
        messages: messagesPayload,
        model: modelToUse,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1,
        stream: false,
      });
    } catch (modelErr) {
      console.warn(`Primary model ${modelToUse} failed, falling back to qwen/qwen3.8-27b:`, modelErr.message);
      chatCompletion = await groq.chat.completions.create({
        messages: messagesPayload,
        model: "qwen/qwen3.8-27b",
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1,
        stream: false,
      });
    }

    const reply = chatCompletion.choices[0].message.content;

    chat.messages.push({
      role: "assistant",
      text: reply,
      timestamp: new Date(),
    });
    chat.updatedAt = new Date();
    await chat.save();

    res.json({ reply, recalledMemoryCount: userMemories.length });
  } catch (error) {
    console.error("Direct Chat Error:", error);
    res.status(500).json({
      error: "Groq API failed",
      details: error.message,
    });
  }
});

app.post("/api/ai/review-code", async (req, res) => {
  try {
    const { code, language, instruction } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Code content is required" });
    }

    const prompt = `You are a Principal Software Engineer and Security Auditor. Perform an in-depth, structured review of the following ${language || "JavaScript"} code.

Code to review:
\`\`\`${language || "javascript"}
${code}
\`\`\`

${instruction ? `Specific Focus: ${instruction}` : ""}

Provide your review in this exact clean Markdown structure:
1. 🛡️ **Security & Vulnerabilities**: (Any risks, sanitized inputs, credential leaks, or state issues)
2. ⚡ **Performance & Efficiency**: (Time/Space complexity, memory management, unnecessary renders/loops)
3. 📐 **Code Quality & Best Practices**: (Clean code, idiomatic style, modularity)
4. 🚀 **Optimized & Refactored Version**: (Provide the fully rewritten, superior version with syntax highlighting)
5. 💡 **Key Takeaways**: (2-3 concise summary points)`;

    let completion;
    try {
      completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are an elite code reviewer. Provide structured, actionable code reviews with clear Markdown headers." },
          { role: "user", content: prompt },
        ],
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        temperature: 0.3,
        max_tokens: 2500,
      });
    } catch (err) {
      completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are an elite code reviewer. Provide structured, actionable code reviews with clear Markdown headers." },
          { role: "user", content: prompt },
        ],
        model: "qwen/qwen3.8-27b",
        temperature: 0.3,
        max_tokens: 2500,
      });
    }

    const review = completion.choices[0].message.content;
    res.json({ success: true, review });
  } catch (error) {
    console.error("Code review error:", error);
    res.status(500).json({ success: false, error: "Code review failed", details: error.message });
  }
});

const roomParticipants = new Map();

const getRoomMeta = (roomId) => {
  return DEFAULT_ROOMS.find((r) => r.id === roomId) || {
    name: roomId,
    description: "Community discussion channel",
  };
};

const generateRoomAiReply = async (roomId, userPrompt, recentMessages = []) => {
  const roomMeta = getRoomMeta(roomId);

  const roomSystemPrompt = {
    role: "system",
    content: `You are Astra AI participating as an expert in the community channel #${roomMeta.name} (${roomMeta.description}).
    - The user summoned you with "@ai".
    - Answer questions accurately, concisely, and with actionable code/insights relevant to ${roomMeta.name}.
    - Format code with markdown backticks and language identifiers.
    - Be collaborative and friendly.`
  };

  const contextMessages = recentMessages.slice(-8).map((m) => ({
    role: m.isAi ? "assistant" : "user",
    content: `${m.user?.name || "User"}: ${m.text}`,
  }));

  const payload = [
    roomSystemPrompt,
    ...contextMessages,
    { role: "user", content: userPrompt },
  ];

  const modelToUse = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  try {
    const completion = await groq.chat.completions.create({
      messages: payload,
      model: modelToUse,
      temperature: 0.7,
      max_tokens: 1500,
    });
    return completion.choices[0].message.content;
  } catch (e) {
    console.warn("Groq Room AI fallback trigger:", e.message);
    const fallback = await groq.chat.completions.create({
      messages: payload,
      model: "qwen/qwen3.8-27b",
      temperature: 0.7,
      max_tokens: 1500,
    });
    return fallback.choices[0].message.content;
  }
};

io.on("connection", (socket) => {
  let currentRoom = null;
  let currentUser = null;

  socket.on("join_room", ({ roomId, user }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
      if (roomParticipants.has(currentRoom)) {
        roomParticipants.get(currentRoom).delete(socket.id);
        io.to(currentRoom).emit("room_presence", {
          onlineCount: roomParticipants.get(currentRoom).size,
        });
      }
    }

    currentRoom = roomId;
    currentUser = user;
    socket.join(roomId);

    if (!roomParticipants.has(roomId)) {
      roomParticipants.set(roomId, new Set());
    }
    roomParticipants.get(roomId).add(socket.id);

    io.to(roomId).emit("room_presence", {
      onlineCount: roomParticipants.get(roomId).size,
    });
  });

  socket.on("leave_room", ({ roomId }) => {
    if (roomId) {
      socket.leave(roomId);
      if (roomParticipants.has(roomId)) {
        roomParticipants.get(roomId).delete(socket.id);
        io.to(roomId).emit("room_presence", {
          onlineCount: roomParticipants.get(roomId).size,
        });
      }
    }
    currentRoom = null;
  });

  socket.on("send_room_message", async ({ roomId, user, text, askAi }) => {
    try {
      if (!roomId || !text?.trim()) return;

      const trimmedText = text.trim();

      const userMessage = await RoomMessage.create({
        roomId,
        user: {
          _id: user?._id || "anonymous",
          name: user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Member",
          picture: user?.picture || "",
          email: user?.email || "",
        },
        text: trimmedText,
        isAi: false,
        timestamp: new Date(),
      });

      io.to(roomId).emit("new_room_message", userMessage);

      const shouldTriggerAi = askAi || trimmedText.toLowerCase().includes("@ai");

      if (shouldTriggerAi) {
        io.to(roomId).emit("ai_typing", { roomId, isTyping: true });

        const cleanPrompt = trimmedText.replace(/@ai/gi, "").trim() || trimmedText;

        const recentMessages = await RoomMessage.find({ roomId })
          .sort({ timestamp: -1 })
          .limit(6);

        const aiText = await generateRoomAiReply(roomId, cleanPrompt, recentMessages.reverse());

        const aiMessage = await RoomMessage.create({
          roomId,
          user: {
            _id: "astra_ai_bot",
            name: "Astra AI",
            picture: "",
            email: "ai@astra.bot",
          },
          text: aiText,
          isAi: true,
          timestamp: new Date(),
        });

        io.to(roomId).emit("new_room_message", aiMessage);
        io.to(roomId).emit("ai_typing", { roomId, isTyping: false });
      }
    } catch (err) {
      console.error("Error processing room message:", err);
      io.to(roomId).emit("ai_typing", { roomId, isTyping: false });
    }
  });

  socket.on("disconnect", () => {
    if (currentRoom && roomParticipants.has(currentRoom)) {
      roomParticipants.get(currentRoom).delete(socket.id);
      io.to(currentRoom).emit("room_presence", {
        onlineCount: roomParticipants.get(currentRoom).size,
      });
    }
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Astra Server running with Socket.io on port ${PORT}`);
});