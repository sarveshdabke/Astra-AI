import express from "express";
import MemoryCard from "../models/MemoryCard.js";
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
    const cards = await MemoryCard.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, cards });
  } catch (error) {
    console.error("Fetch memory cards error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch memory cards" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, topic, content, category, confidence, tags } = req.body;
    if (!userId || !topic || !content) {
      return res.status(400).json({ success: false, error: "User ID, topic, and content are required" });
    }

    const card = new MemoryCard({
      userId,
      topic,
      content,
      category: category || "Preference",
      confidence: confidence || "High",
      tags: Array.isArray(tags) ? tags : [],
      source: "Manual Save",
    });

    const savedCard = await card.save();
    res.status(201).json({ success: true, card: savedCard });
  } catch (error) {
    console.error("Create memory card error:", error);
    res.status(500).json({ success: false, error: "Failed to create memory card" });
  }
});

router.post("/extract", async (req, res) => {
  try {
    const { userId, text } = req.body;
    if (!userId || !text) {
      return res.status(400).json({ success: false, error: "User ID and text are required" });
    }

    const extractionPrompt = `You are a memory extractor for an AI assistant. Analyze the user message/conversation and extract key facts, preferences, tech stacks, or project details about the user that the AI should remember.
Return ONLY a valid JSON array of objects with the following schema:
[
  {
    "topic": "Short title (e.g. Primary Tech Stack, Database Choice, Coding Style)",
    "content": "Specific fact or preference to remember (e.g. Uses React 19 with Tailwind CSS and Vite)",
    "category": "Tech Stack" | "Coding Style" | "Preference" | "Project Fact",
    "confidence": "High" | "Medium",
    "tags": ["tag1", "tag2"]
  }
]
If there are no meaningful personal facts or preferences to extract, return an empty array [].
Text to analyze:
"${text.replace(/"/g, '\\"')}"`;

    let completion;
    try {
      completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You extract structured memory JSON. Always return raw JSON array only." },
          { role: "user", content: extractionPrompt },
        ],
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        temperature: 0.2,
        max_tokens: 1024,
      });
    } catch (groqErr) {
      completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You extract structured memory JSON. Always return raw JSON array only." },
          { role: "user", content: extractionPrompt },
        ],
        model: "qwen/qwen3.8-27b",
        temperature: 0.2,
        max_tokens: 1024,
      });
    }

    const rawResponse = completion.choices[0].message.content.trim();
    let extracted = [];
    try {
      const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        extracted = JSON.parse(jsonMatch[0]);
      }
    } catch (parseErr) {
      console.warn("Memory JSON parse fallback:", rawResponse);
    }

    const savedCards = [];
    for (const item of extracted) {
      if (item.topic && item.content) {
        const newCard = new MemoryCard({
          userId,
          topic: item.topic,
          content: item.content,
          category: item.category || "Preference",
          confidence: item.confidence || "High",
          tags: item.tags || [],
          source: "AI Auto-Extracted",
        });
        const saved = await newCard.save();
        savedCards.push(saved);
      }
    }

    res.json({ success: true, count: savedCards.length, cards: savedCards });
  } catch (error) {
    console.error("AI Memory extract error:", error);
    res.status(500).json({ success: false, error: "Failed to extract memory cards", details: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await MemoryCard.findByIdAndDelete(id);
    res.json({ success: true, message: "Memory card deleted" });
  } catch (error) {
    console.error("Delete memory card error:", error);
    res.status(500).json({ success: false, error: "Failed to delete memory card" });
  }
});

export default router;
