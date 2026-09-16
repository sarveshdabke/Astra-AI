import express from "express";
import RoomMessage from "../models/RoomMessage.js";

const router = express.Router();

export const DEFAULT_ROOMS = [
  {
    id: "web-dev",
    name: "Web Development",
    icon: "Globe",
    category: "Development",
    description: "Frontend, Backend, APIs, React, Next.js, Node.js & CSS frameworks.",
    color: "#06b6d4",
  },
  {
    id: "app-dev",
    name: "App Development",
    icon: "Smartphone",
    category: "Mobile",
    description: "React Native, Flutter, iOS, Android, Swift & Kotlin discussions.",
    color: "#8b5cf6",
  },
  {
    id: "ai-tech",
    name: "AI & Emerging Tech",
    icon: "Bot",
    category: "Artificial Intelligence",
    description: "LLMs, Groq, Agents, Prompt Engineering & Neural Networks.",
    color: "#7c3aed",
  },
  {
    id: "ui-ux",
    name: "UI/UX & Design Systems",
    icon: "Palette",
    category: "Design",
    description: "Tailwind, Framer Motion, Figma, modern animations & user experience.",
    color: "#ec4899",
  },
  {
    id: "cloud-devops",
    name: "Cloud & DevOps",
    icon: "Cloud",
    category: "Infrastructure",
    description: "Docker, Kubernetes, AWS, MongoDB Atlas, CI/CD & deployment pipelines.",
    color: "#3b82f6",
  },
  {
    id: "general",
    name: "General Lounge",
    icon: "MessageSquare",
    category: "Community",
    description: "Open community chat, tech news, banter, questions & networking.",
    color: "#10b981",
  },
];

router.get("/", (req, res) => {
  res.json({ success: true, rooms: DEFAULT_ROOMS });
});

router.get("/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const messages = await RoomMessage.find({ roomId })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({ success: true, messages: messages.reverse() });
  } catch (error) {
    console.error("Error fetching room messages:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/:roomId/messages/clear", async (req, res) => {
  try {
    const { roomId } = req.params;
    await RoomMessage.deleteMany({ roomId });
    res.json({ success: true, message: "Room messages cleared" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
