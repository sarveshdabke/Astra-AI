import mongoose from "mongoose";

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    promptText: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Web Dev", "App Dev", "AI & ML", "DevOps & Cloud", "UI/UX", "Productivity", "General"],
      default: "General",
    },
    tags: [
      {
        type: String,
      },
    ],
    author: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        default: "Community Contributor",
      },
      picture: {
        type: String,
        default: "",
      },
    },
    stars: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    forkCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Prompt", promptSchema);
