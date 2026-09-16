import express from "express";
import Chat from "../models/Chat.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID is required" });
    }

    const newChat = await Chat.create({ userId });
    res.status(201).json({ success: true, chat: newChat });
  } catch (error) {
    console.error("Error creating new chat:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID is required" });
    }

    const chats = await Chat.find({ userId })
      .select("_id title updatedAt")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/conversation/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      return res.status(400).json({ success: false, error: "Chat ID is required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/message", async (req, res) => {
  try {
    const { chatId, role, text } = req.body;
    if (!chatId || !role || !text) {
      return res.status(400).json({ success: false, error: "Chat ID, role, and text are required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found" });
    }

    if (chat.messages.length === 0 && role === "user") {
      chat.title = text.substring(0, 40);
    }

    chat.messages.push({
      role: role === "bot" ? "assistant" : role,
      text,
      timestamp: new Date()
    });
    chat.updatedAt = new Date();
    await chat.save();

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/:chatId/rename", async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { title: title.substring(0, 60), updatedAt: new Date() },
      { new: true }
    );
    if (!chat) return res.status(404).json({ success: false, error: "Chat not found" });
    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Error renaming chat:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    await Chat.findByIdAndDelete(chatId);
    res.status(200).json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;