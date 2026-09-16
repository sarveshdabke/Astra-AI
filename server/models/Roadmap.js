import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    goal: {
      type: String,
      required: true,
      trim: true,
    },
    currentLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    targetRole: {
      type: String,
      default: "Full-Stack Engineer",
    },
    progressPercent: {
      type: Number,
      default: 0,
    },
    milestones: [
      {
        id: String,
        title: String,
        description: String,
        status: {
          type: String,
          enum: ["pending", "in-progress", "completed"],
          default: "pending",
        },
        estimatedWeeks: Number,
        skills: [String],
        recommendedRoomId: String,
        projectIdea: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Roadmap", roadmapSchema);
