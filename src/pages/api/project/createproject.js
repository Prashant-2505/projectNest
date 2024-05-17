import connectToDb from "../../../../database";
import ProjectModel from "../../../../model/projectModel";
import UserModel from "../../../../model/userModel";

export default async function POST(req, res) {
    try {
        // Destructure request body
        const { projectName, projectDescription, projectLink, projectLeader, projectTech } = req.body;
       console.log(projectLink)
        // Connect to the database
        await connectToDb();

        // Check if required fields are provided
        if (!projectName || !projectDescription || !projectLeader) {
            return res.status(400).json({
                success: false,
                message: "Fill all required fields"
            });
        }

        // Check if the project already exists
        const existingProject = await ProjectModel.findOne({ name: projectName });
        if (existingProject) {
            return res.json({
                success: false,
                message: "Project already exists. Please enter using Project Id"
            });
        }

        // Create a new project
        const newProject = await ProjectModel.create({
            name: projectName,
            description: projectDescription,
            leader: projectLeader,
            tech: projectTech,
            link: projectLink
        });

        // Update user's projects array
        await UserModel.findByIdAndUpdate(projectLeader, {
            $push: { projects: newProject._id } // Push new project ID to projects array
        });

        // Respond with success message and new project data
        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            newProject
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating project"
        });
    }
}
