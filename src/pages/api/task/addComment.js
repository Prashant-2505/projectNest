import connectToDb from "../../../../database";
import TaskModel from "../../../../model/taskModel";

export default async function POST(req, res) {
    try {
        await connectToDb();

        const { taskId, taskComment } = req.body;
        console.log(taskId, taskComment);

        const task = await TaskModel.findByIdAndUpdate(taskId, {
            comment: taskComment
        });
        await task.save();
        
        if (task) {
            return res.json({
                success: true,
                message: "Comment added successfully"
            });
        } else {
            return res.json({
                success: false, 
                message: "Failed to add comment"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
