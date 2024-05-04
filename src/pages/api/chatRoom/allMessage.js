import connectToDb from "../../../../database";
import MessageModel from "../../../../model/messgeModel";

export default async function GET(req, res) {
    try {
        await connectToDb();
        const chatId =  req.query.chatId;
        
        // Check if chatId is not found
        if (!chatId) {
            return res.json({ success: false, message: "Chat ID not found" });
        }

        // Find messages associated with the given chatId
        const messages = await MessageModel.find({ chat: chatId })
            .populate("sender", "name pic email")
            .populate("chat");
 
        return res.json({
            success: true,
            messages: messages
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(400).json({ success: false, error: error.message });
    }
}
