import connectToDb from "../../../../database";
import TaskModel from "../../../../model/taskModel";

export default async function POST(req, res) {
    try {
        await connectToDb();

        const { taskId, finishedDate, removeSubmitRequest, completion_Date } = req.body;
        console.log(completion_Date)
        var task
        if (removeSubmitRequest) {
            task = await TaskModel.findByIdAndUpdate(taskId, { finishedDate, comment: null });
        }
        if (completion_Date) {
            task = await TaskModel.findByIdAndUpdate(taskId, { complete: completion_Date, comment: null });
        }
        else {
            task = await TaskModel.findByIdAndUpdate(taskId, { finishedDate });

        }
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
