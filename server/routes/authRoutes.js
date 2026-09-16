import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/google-login", async (req, res) => {
  try {
    const { firstName, lastName, email, picture, googleId } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId,
        firstName,
        lastName,
        email,
        picture
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;