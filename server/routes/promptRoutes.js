import express from "express";
import Prompt from "../models/Prompt.js";

const router = express.Router();

const SEED_PROMPTS = [
  {
    title: "Senior Full-Stack Code Architect",
    description: "Transforms rough feature ideas into clean, modular Next.js & Express architecture with schema designs.",
    promptText: "Act as a Senior Principal Software Architect. I want to build [feature/system]. Provide: 1. Clean folder structure, 2. Database schema design with relations, 3. API endpoint specifications, 4. Security, error handling and edge cases.",
    category: "Web Dev",
    tags: ["Architecture", "Next.js", "Express", "Backend"],
    author: { name: "Astra Core", picture: "" },
    forkCount: 42,
  },
  {
    title: "Instant Clean Code Refactorer & Bug Hunter",
    description: "Identifies anti-patterns, memory leaks, performance bottlenecks, and rewrites clean code with explanations.",
    promptText: "Analyze the following code for: 1. Edge cases and subtle bugs, 2. Performance bottlenecks, 3. Memory or resource leaks, 4. Modern best practices. Then output a fully refactored, clean, and commented version:\n\n```[language]\n[paste code here]\n```",
    category: "Web Dev",
    tags: ["Refactoring", "Clean Code", "Bug Hunter", "Optimization"],
    author: { name: "Astra Core", picture: "" },
    forkCount: 68,
  },
  {
    title: "Production React Hook Generator",
    description: "Generates battle-tested, robust custom React hooks with full error boundaries and TypeScript types.",
    promptText: "Create a production-ready custom React hook named `[useName]` for [specific functionality]. Include: 1. State & refs with proper cleanup, 2. Error handling & loading states, 3. JSDoc documentation with usage examples, 4. Performance optimization (useCallback / useMemo).",
    category: "Web Dev",
    tags: ["React", "Custom Hooks", "Frontend", "JavaScript"],
    author: { name: "Astra Core", picture: "" },
    forkCount: 35,
  },
  {
    title: "Docker & CI/CD Deployment Master",
    description: "Generates multi-stage Dockerfiles, docker-compose.yml, and GitHub Actions workflow for production apps.",
    promptText: "Generate a production-grade deployment suite for a [Node.js / Python / Go] application: 1. Multi-stage Dockerfile (minimal size & security hardened), 2. docker-compose.yml with caching & health checks, 3. GitHub Actions CI/CD pipeline for automated testing and deployment.",
    category: "DevOps & Cloud",
    tags: ["Docker", "DevOps", "CI/CD", "Cloud"],
    author: { name: "Astra Core", picture: "" },
    forkCount: 29,
  },
  {
    title: "UI/UX Tailwind & Modern Animation Designer",
    description: "Creates stunning, glassmorphism, micro-animated dark mode components with Tailwind CSS.",
    promptText: "Design a modern, high-converting [component, e.g. Pricing Table, Dashboard Card, Hero Section] using Tailwind CSS. Use deep dark mode aesthetics, smooth glassmorphism (backdrop-blur), sleek gradients, and subtle hover animations.",
    category: "UI/UX",
    tags: ["Tailwind", "CSS", "UI/UX", "Animations"],
    author: { name: "Astra Core", picture: "" },
    forkCount: 51,
  },
  {
    title: "LLM Prompt Optimizer & System Prompt Engineer",
    description: "Takes any basic prompt and upgrades it with step-by-step reasoning constraints, few-shot examples, and guardrails.",
    promptText: "You are an elite prompt engineer. Take the following draft prompt and rewrite it to get the highest quality, most structured response from modern LLMs. Include clear role definition, task breakdown, constraints, output format specification, and fallback guidelines:\n\nDraft: [paste draft here]",
    category: "AI & ML",
    tags: ["Prompt Engineering", "LLM", "AI", "Productivity"],
    author: { name: "Astra Core", picture: "" },
    forkCount: 77,
  },
];

const ensureSeedPrompts = async () => {
  try {
    const count = await Prompt.countDocuments();
    if (count === 0) {
      await Prompt.insertMany(SEED_PROMPTS);
    }
  } catch (err) {
    console.error("Error seeding prompts:", err);
  }
};
ensureSeedPrompts();

router.get("/", async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { promptText: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "popular") {
      sortOption = { "stars.length": -1, forkCount: -1 };
    } else if (sort === "forks") {
      sortOption = { forkCount: -1 };
    }

    const prompts = await Prompt.find(query).sort(sortOption);
    res.json({ success: true, prompts });
  } catch (error) {
    console.error("Fetch prompts error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch prompts" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, promptText, category, tags, author } = req.body;
    if (!title || !promptText) {
      return res.status(400).json({ success: false, error: "Title and prompt text are required" });
    }

    const newPrompt = new Prompt({
      title,
      description: description || "",
      promptText,
      category: category || "General",
      tags: Array.isArray(tags) ? tags : [],
      author: {
        userId: author?.userId,
        name: author?.name || "Community Dev",
        picture: author?.picture || "",
      },
    });

    const savedPrompt = await newPrompt.save();
    res.status(201).json({ success: true, prompt: savedPrompt });
  } catch (error) {
    console.error("Create prompt error:", error);
    res.status(500).json({ success: false, error: "Failed to create prompt" });
  }
});

router.post("/:id/star", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID required" });
    }

    const prompt = await Prompt.findById(id);
    if (!prompt) {
      return res.status(404).json({ success: false, error: "Prompt not found" });
    }

    const alreadyStarred = prompt.stars.some((uid) => uid.toString() === userId.toString());
    if (alreadyStarred) {
      prompt.stars = prompt.stars.filter((uid) => uid.toString() !== userId.toString());
    } else {
      prompt.stars.push(userId);
    }

    await prompt.save();
    res.json({ success: true, stars: prompt.stars, isStarred: !alreadyStarred });
  } catch (error) {
    console.error("Star prompt error:", error);
    res.status(500).json({ success: false, error: "Failed to update star" });
  }
});

router.post("/:id/fork", async (req, res) => {
  try {
    const { id } = req.params;
    const prompt = await Prompt.findByIdAndUpdate(
      id,
      { $inc: { forkCount: 1 } },
      { new: true }
    );
    if (!prompt) {
      return res.status(404).json({ success: false, error: "Prompt not found" });
    }
    res.json({ success: true, forkCount: prompt.forkCount });
  } catch (error) {
    console.error("Fork prompt error:", error);
    res.status(500).json({ success: false, error: "Failed to increment fork count" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Prompt.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Prompt deleted" });
  } catch (error) {
    console.error("Delete prompt error:", error);
    res.status(500).json({ success: false, error: "Failed to delete prompt" });
  }
});

export default router;
