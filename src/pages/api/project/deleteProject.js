import connectToDb from "../../../../database";
import ProjectModel from "../../../../model/projectModel";
import TaskModel from "../../../../model/taskModel";

export default async function DELETE(req, res) {
    try {
        await connectToDb();

        const projectId = req.query.projectId; // Assuming projectId is sent in the request query

        if (!projectId) {
            return res.status(400).json({ success: false, message: "ProjectId is required" });
        }

        // Delete tasks associated with the project
        await TaskModel.deleteMany({ project: projectId });

        // Delete the project
        const project = await ProjectModel.findByIdAndDelete(projectId);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        return res.json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
