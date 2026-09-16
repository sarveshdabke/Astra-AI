import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    points: {
      type: Number,
      default: 100,
    },
    durationMinutes: {
      type: Number,
      default: 30,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    starterCode: {
      type: String,
      default: "// Write your solution here\n",
    },
    submissions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        userName: String,
        userPicture: String,
        code: String,
        aiScore: Number,
        aiFeedback: String,
        passed: Boolean,
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Challenge", challengeSchema);
