import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  isGroup: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String, // only for group chats
  },
  recipients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  unreadCounts: {
    type: Map,
    of: Number, // userId -> unread count
    default: {},
  },
});

export default mongoose.model("Chat", chatSchema);
