import connectToDb from "../../../../database";
import ChatModel from "../../../../model/chatModel";


export default async function POST(req, res) {
    try {
        await connectToDb();
        const { chatName, isGroupChat, users } = req.body;

        if (!chatName || typeof isGroupChat !== 'boolean' || !Array.isArray(users)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request body'
            });
        }


        // Checking if a chat already exists between the users
        const isChat = await ChatModel.findOne({
            isGroupChat: false,
            users: { $all: users }
        }).populate("users", "-password")
          .populate("latestMessage.sender");

        if (isChat) {
            return res.json({
                success:true,isChat
            });
        } else {
            const chatData = {
                chatName,
                isGroupChat,
                users
            };

            try {
                const createdChat = await ChatModel.create(chatData);
                const fullChat = await ChatModel.findOne({ _id: createdChat._id }).populate(
                    "users",
                    "-password"
                );
                return res.json({
                    success:true,
                    fullChat
                });
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
