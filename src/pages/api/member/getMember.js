import connectToDb from "../../../../database";
import UserModel from "../../../../model/userModel";

export default async function GET(req, res) {
    try {
        connectToDb();

        const projectId = req.query.id; // Access the id directly from req.query
        console.log(projectId)
        if (!projectId) {
            return res.json({
                success: false,
                message: "Project ID not found"
            });
        }

        const members = await UserModel.find({ projects: { $in: [projectId] } })
            .select('name email _id'); // Specify the fields to select

        if (members && members.length > 0) {
            return res.json({
                success: true,
                message: "Members of the project fetched successfully",
                members
            });
        } else {
            return res.json({
                success: false,
                message: "No members found for the provided project ID"
            });
        }
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Internal server error"
        });
    }
}
