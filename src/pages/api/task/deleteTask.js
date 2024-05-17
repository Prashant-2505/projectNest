import connectToDb from "../../../../database";
import TaskModel from "../../../../model/taskModel";

export default async function DELETE(req, res) {
    try {
        await connectToDb();

        const taskId = req.query.taskId

        const task = await TaskModel.findByIdAndDelete(taskId)
        return res.json({
            success: true,
            message: "Task deleted successfully"
        })

    } catch (error) {
        console.error("Error updating task:", error);
        return res.json({
            success: false,
            message: "Internal server error"
        });
    }
}
