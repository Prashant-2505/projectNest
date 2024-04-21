import connectToDb from "../../../../database";
import TaskModel from "../../../../model/taskModel";

export default async function POST(req, res) {
    try {
        await connectToDb();

        const { taskId, finishedDate } = req.body;

        const task = await TaskModel.findByIdAndUpdate(taskId, { finishedDate });
        if (task) {
            return res.json({
                success: true,
                message: "Task is completed"
            });
        } else {
            return res.json({
                success: false,
                message: "Task not found"
            });
        }
    } catch (error) {
        console.error("Error updating task:", error);
        return res.json({
            success: false,
            message: "Internal server error"
        });
    }
}
