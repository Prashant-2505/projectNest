import mongoose from "mongoose";
import UserModel from "./userModel";
import ChatModel from "./chatModel";


const messageSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: UserModel },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: UserModel },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: ChatModel },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: UserModel }],
}, { timestamps: true });

const MessageModel = mongoose.models.MessageModel || mongoose.model("MessageModel", messageSchema);

export default MessageModel;
