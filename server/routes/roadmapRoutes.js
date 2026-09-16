import express from "express";
import Roadmap from "../models/Roadmap.js";
import Chat from "../models/Chat.js";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const roadmaps = await Roadmap.find({ userId }).sort({ updatedAt: -1 });
    res.json({ success: true, roadmaps });
  } catch (error) {
    console.error("Fetch roadmaps error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch roadmaps" });
  }
});

router.post("/generate", async (req, res) => {
  try {
    const { userId, goal, currentLevel, targetRole } = req.body;
    if (!userId || !goal) {
      return res.status(400).json({ success: false, error: "User ID and goal are required" });
    }

    let recentChatSnippets = "";
    try {
      const recentChats = await Chat.find({ userId }).sort({ updatedAt: -1 }).limit(3);
      const userQuestions = [];
      recentChats.forEach((c) => {
        c.messages.forEach((m) => {
          if (m.role === "user") userQuestions.push(m.text);
        });
      });
      recentChatSnippets = userQuestions.slice(-10).join("; ");
    } catch (e) {
    }

    const prompt = `You are a Principal Engineering Career Mentor. Create a comprehensive, tailored learning roadmap for a developer with the following profile:
Goal: ${goal}
Current Skill Level: ${currentLevel || "Intermediate"}
Target Role: ${targetRole || "Full-Stack Engineer"}
Past topics they have asked about: ${recentChatSnippets || "General Web & App dev"}

Return ONLY a valid JSON object strictly matching this schema (NO markdown formatting or code blocks outside of raw JSON):
{
  "goal": "${goal}",
  "currentLevel": "${currentLevel || 'Intermediate'}",
  "targetRole": "${targetRole || 'Full-Stack Engineer'}",
  "milestones": [
    {
      "id": "m1",
      "title": "Clear milestone title (e.g. Master Advanced TypeScript & Design Patterns)",
      "description": "What to learn and build in this phase",
      "status": "in-progress",
      "estimatedWeeks": 2,
      "skills": ["TypeScript Generics", "Utility Types", "Zod Validation"],
      "recommendedRoomId": "web-dev",
      "projectIdea": "Build a type-safe API wrapper library with runtime validation"
    },
    {
      "id": "m2",
      "title": "Next milestone title",
      "description": "...",
      "status": "pending",
      "estimatedWeeks": 3,
      "skills": ["..."],
      "recommendedRoomId": "cloud-devops",
      "projectIdea": "..."
    }
  ]
}
Include exactly 4 to 5 progressive milestones. Ensure recommendedRoomId is one of: web-dev, app-dev, ai-tech, ui-ux, cloud-devops, general.`;

    let completion;
    try {
      completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You output strictly raw valid JSON." },
          { role: "user", content: prompt },
        ],
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        temperature: 0.3,
        max_tokens: 2048,
      });
    } catch (err) {
      completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You output strictly raw valid JSON." },
          { role: "user", content: prompt },
        ],
        model: "qwen/qwen3.8-27b",
        temperature: 0.3,
        max_tokens: 2048,
      });
    }

    const raw = completion.choices[0].message.content.trim();
    let parsedData = null;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsedData = JSON.parse(jsonMatch[0]);
    }

    if (!parsedData || !parsedData.milestones) {
      throw new Error("Invalid roadmap JSON returned by AI");
    }

    const newRoadmap = new Roadmap({
      userId,
      goal: parsedData.goal || goal,
      currentLevel: parsedData.currentLevel || currentLevel,
      targetRole: parsedData.targetRole || targetRole,
      progressPercent: 10,
      milestones: parsedData.milestones,
    });

    const savedRoadmap = await newRoadmap.save();
    res.status(201).json({ success: true, roadmap: savedRoadmap });
  } catch (error) {
    console.error("Generate roadmap error:", error);
    res.status(500).json({ success: false, error: "Failed to generate roadmap", details: error.message });
  }
});

router.patch("/:id/milestone/:milestoneId", async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    const { status } = req.body;

    const roadmap = await Roadmap.findById(id);
    if (!roadmap) return res.status(404).json({ success: false, error: "Roadmap not found" });

    const milestone = roadmap.milestones.find((m) => m.id === milestoneId || m._id?.toString() === milestoneId);
    if (milestone) {
      milestone.status = status;
    }

    const completedCount = roadmap.milestones.filter((m) => m.status === "completed").length;
    roadmap.progressPercent = Math.round((completedCount / roadmap.milestones.length) * 100);

    await roadmap.save();
    res.json({ success: true, roadmap });
  } catch (error) {
    console.error("Update milestone error:", error);
    res.status(500).json({ success: false, error: "Failed to update milestone" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Roadmap.findByIdAndDelete(id);
    res.json({ success: true, message: "Roadmap deleted" });
  } catch (error) {
    console.error("Delete roadmap error:", error);
    res.status(500).json({ success: false, error: "Failed to delete roadmap" });
  }
});

export default router;
