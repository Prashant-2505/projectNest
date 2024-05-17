import connectToDb from "../../../../database";
import ProjectModel from "../../../../model/projectModel";
import TaskModel from "../../../../model/taskModel";

export default async function POST(req, res) {
    try {
        // Establish database connection
        await connectToDb();

        const { taskName, taskDescription, assignedMembers, deadLine, projectId, priority, taskLink } = req.body;
        console.log(taskLink)
        if (!taskDescription || !taskName || !assignedMembers || !projectId || !deadLine || !priority) {
            return res.json({ success: false, message: "Please fill all required fields" });
        }

        // Check if task with the same name already exists
        const existingTask = await TaskModel.findOne({ name: taskName });
        if (existingTask) {
            return res.json({ success: false, message: "Task already exists" });
        }

        // Create the task
        const task = await TaskModel.create({
            name: taskName,
            description: taskDescription,
            project: projectId,
            assignedMember: assignedMembers,
            deadLine: deadLine,
            priority: priority,
            link: taskLink
        });

        if (task) {
            const project = await ProjectModel.findById(projectId);
            if (project) {
                project.task.push(task); // Push the task into the project's task array
                await project.save(); // Save the updated project
            }
            return res.json({ success: true, message: "Task created successfully", task });
        } else {
            return res.json({ success: false, message: "Failed to create task" });
        }
    } catch (error) {
        // Handle errors
        console.error("Error creating task:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
