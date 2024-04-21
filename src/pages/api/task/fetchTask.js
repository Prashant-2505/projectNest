import mongoose from "mongoose";
import connectToDb from "../../../../database";
import TaskModel from "../../../../model/taskModel";

export default async function GET(req, res) {
    try {
        await connectToDb();
        const projectId = req.query.id; 
        if (!projectId) {
            return res.json({ error: "Missing project ID" });
        }

        const tasks = await TaskModel.find({ project: projectId })
            .populate({
                path: 'assignedMember',
                select: 'name email'
            });

        if (tasks.length > 0) {
            return res.json({
                success: true,
                message: "Tasks fetched successfully",
                tasks
            });
        } else {
            return res.json({
                success: true,
                message: "Currently there are no tasks for this project",
                tasks: [] 
            });
        }
    } catch (error) {
        console.error("Error:", error);
        res.json({ error: "Internal Server Error" });
    }
}
