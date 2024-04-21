import connectToDb from "../../../../database";
import JoinReqUserModel from "../../../../model/joinRequestModel";
import ProjectModel from "../../../../model/projectModel";

export default async function POST(req, res) {
    try {
        await connectToDb(); // Wait for the database connection to be established

        const { name, email, projectId } = req.body;

        // Check if name and email are provided
        if (!name || !email) {
            return res.json({
                success: false,
                message: "Name or email is missing"
            });
        }

        // Find the project by projectId and populate the member field
        const project = await ProjectModel.findById(projectId).populate('member', 'email');

        // Check if the project exists
        if (!project) {
            return res.json({
                success: false,
                message: "Project not found"
            });
        }

        // Check if the user already exists in the project
        const userExists = project.member.some(member => member.email === email);
        if (userExists) {
            return res.json({
                success: true,
                message: "User already exists in the project"
            });
        }

        // Check if a join request already exists for the user
        const existingJoinRequest = await JoinReqUserModel.findOne({ email });
        if (existingJoinRequest) {
            return res.json({
                success: false,
                message: "Join request already sent"
            });
        }

        // Create a join request for the user
        const userReq = await JoinReqUserModel.create({ name, email,projectId });
        return res.json({
            success: false,
            message: "Joining request sent to project leader"
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
