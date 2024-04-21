import connectToDb from "../../../../database";
import UserModel from "../../../../model/userModel";
import ProjectModel from "../../../../model/projectModel";
import JoinReqUserModel from "../../../../model/joinRequestModel";

export default async function PUT(req, res) {
    try {
        await connectToDb(); // Make sure to await the database connection

        const { userMail, projectId } = req.body;
        console.log(userMail, projectId);

        if (!userMail || !projectId) {
            return res.json({
                success: false,
                message: "User email or project ID is missing from the request"
            });
        }

        // Check if the user exists
        const user = await UserModel.findOne({ email: userMail });
        if (!user) {
            return res.json({
                success: false,
                message: "Unable to add member. User is not registered with us."
            });
        }

        // Check if the project exists
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return res.json({
                success: false,
                message: "Project not found."
            });
        }

        // Update the project member list

        project.member.push(user._id);
        await project.save();

        const reqUser = await JoinReqUserModel.findOneAndDelete({ email: userMail });
        const existUser = await UserModel.findOne({ email: userMail })
        existUser.projects.push(projectId)
        await existUser.save();

        return res.json({
            success: true,
            message: "User added to the project successfully.",
            project: project // Optionally, you can return the updated project object
        });

    } catch (error) {
        console.error("Error:", error);
        return res.json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
