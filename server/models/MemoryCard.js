import mongoose from "mongoose";

const memoryCardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Preference",
    },
    confidence: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "High",
    },
    tags: [
      {
        type: String,
      },
    ],
    source: {
      type: String,
      default: "Manual Save",
    },
  },
  { timestamps: true }
);

export default mongoose.model("MemoryCard", memoryCardSchema);
