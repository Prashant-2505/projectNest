import connectToDb from "../../../../database";
import ChatModel from "../../../../model/chatModel";
import MessageModel from "../../../../model/messgeModel";

export default async function POST(req, res) {
    try {
        await connectToDb();
        const { content, sender, receiver, chatId } = req.body;

        if (!content || !chatId || !receiver || !sender) {
            console.log("Invalid data passed into request");
            return res.sendStatus(400);
        }

        // Create a new message
        const messages = await MessageModel.create({
            sender: sender,
            receiver: receiver,
            content: content,
            chat: chatId,
        });

        // Populate the message with sender's name and picture
        await messages.populate("sender", "name pic")

        // Populate the chat with user details
        await ChatModel.findByIdAndUpdate(chatId, { latestMessage: messages }).populate({
            path: "users",
            select: "name pic email",
        }); 

        return res.json({
            success: true,
            messages,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}
