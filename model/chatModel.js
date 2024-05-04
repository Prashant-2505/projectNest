import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserModel" }],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MessageModel',
        },
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
    },
    { timestamps: true }
);

const ChatModel = mongoose.models.ChatModel || mongoose.model("ChatModel", chatSchema);

export default ChatModel;
