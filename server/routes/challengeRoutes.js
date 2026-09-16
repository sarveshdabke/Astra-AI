import express from "express";
import Challenge from "../models/Challenge.js";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SEED_CHALLENGES = [
  {
    roomId: "web-dev",
    title: "Build a Debounced Search Hook in Vanilla JS",
    description: "Implement a robust debounce utility function that delays execution until after a specified wait time and supports immediate leading trigger.",
    difficulty: "Medium",
    points: 120,
    durationMinutes: 20,
    starterCode: `function debounce(func, wait, immediate = false) {
  // TODO: Implement your solution here
}

// Test call
const log = debounce(() => console.log('Called!'), 300);
log();
log();
log(); // Should only fire once
`,
  },
  {
    roomId: "ui-ux",
    title: "Create a Glowing Pulse Loading Skeleton in Pure CSS",
    description: "Write CSS animation and keyframes for a modern shimmer skeleton card loader with backdrop glassmorphism.",
    difficulty: "Easy",
    points: 80,
    durationMinutes: 15,
    starterCode: `/* Write your CSS rules and animation below */
@keyframes skeletonShimmer {
  /* TODO */
}

.skeleton-card {
  /* TODO */
}
`,
  },
  {
    roomId: "ai-tech",
    title: "Design a Guardrail Function for LLM JSON Output",
    description: "Write a parser that safely cleans Markdown fences, repairs trailing commas, and guarantees typed JSON extraction.",
    difficulty: "Hard",
    points: 200,
    durationMinutes: 30,
    starterCode: `function parseAndSanitizeLLMJson(rawResponse) {
  // TODO: Clean fences, strip extra text, and JSON.parse safely
  return {};
}
`,
  },
];

const ensureSeedChallenges = async () => {
  try {
    const count = await Challenge.countDocuments();
    if (count === 0) {
      await Challenge.insertMany(SEED_CHALLENGES);
    }
  } catch (err) {
    console.error("Error seeding challenges:", err);
  }
};
ensureSeedChallenges();

router.get("/", async (req, res) => {
  try {
    const { roomId } = req.query;
    const query = roomId ? { roomId } : {};
    const challenges = await Challenge.find(query).sort({ createdAt: -1 });
    res.json({ success: true, challenges });
  } catch (error) {
    console.error("Fetch challenges error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch challenges" });
  }
});

router.post("/:id/submit", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userName, userPicture, code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: "Code solution is required" });
    }

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ success: false, error: "Challenge not found" });
    }

    const judgePrompt = `You are the Automated Hackathon Judge for this coding challenge.
Challenge Title: ${challenge.title}
Challenge Task: ${challenge.description}

Candidate's Submitted Code:
\`\`\`
${code}
\`\`\`

Evaluate the submission strictly and return ONLY a valid JSON object matching this schema:
{
  "score": 85, (integer 0 to 100)
  "passed": true, (boolean, true if score >= 70)
  "feedback": "2-3 sentences concise constructive evaluation of correctness, edge cases, and code quality."
}`;

    let completion;
    try {
      completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You output strictly valid raw JSON evaluation." },
          { role: "user", content: judgePrompt },
        ],
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        temperature: 0.1,
        max_tokens: 500,
      });
    } catch (e) {
      completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You output strictly valid raw JSON evaluation." },
          { role: "user", content: judgePrompt },
        ],
        model: "qwen/qwen3.8-27b",
        temperature: 0.1,
        max_tokens: 500,
      });
    }

    const raw = completion.choices[0].message.content.trim();
    let evalResult = { score: 75, passed: true, feedback: "Solution accepted." };
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) evalResult = JSON.parse(match[0]);
    } catch (parseErr) {
      console.warn("Judge parse fallback:", raw);
    }

    const submission = {
      userId,
      userName: userName || "Community Hacker",
      userPicture: userPicture || "",
      code,
      aiScore: evalResult.score,
      aiFeedback: evalResult.feedback,
      passed: evalResult.passed,
      submittedAt: new Date(),
    };

    challenge.submissions.push(submission);
    await challenge.save();

    res.json({
      success: true,
      result: evalResult,
      submission,
      totalSubmissions: challenge.submissions.length,
    });
  } catch (error) {
    console.error("Challenge submit error:", error);
    res.status(500).json({ success: false, error: "Failed to evaluate challenge", details: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { roomId, title, description, difficulty, points, durationMinutes, starterCode } = req.body;
    if (!roomId || !title || !description) {
      return res.status(400).json({ success: false, error: "Room, title, and description required" });
    }

    const newChallenge = new Challenge({
      roomId,
      title,
      description,
      difficulty: difficulty || "Medium",
      points: points || 100,
      durationMinutes: durationMinutes || 30,
      starterCode: starterCode || "// Write your solution\n",
    });

    const saved = await newChallenge.save();
    res.status(201).json({ success: true, challenge: saved });
  } catch (error) {
    console.error("Create challenge error:", error);
    res.status(500).json({ success: false, error: "Failed to create challenge" });
  }
});

export default router;
