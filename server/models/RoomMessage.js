import mongoose from "mongoose";

const roomMessageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    picture: { type: String, default: "" },
    email: { type: String, default: "" },
  },
  text: {
    type: String,
    required: true,
  },
  isAi: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

roomMessageSchema.index({ roomId: 1, timestamp: -1 });

const RoomMessage = mongoose.model("RoomMessage", roomMessageSchema);
export default RoomMessage;
