import connectToDb from "../../../../database";
import ProjectModel from "../../../../model/projectModel";

export default async function POST(req, res) {
    try {
        await connectToDb()

        const { leaderId } = req.body
        const existingProject = await ProjectModel.find({leader: leaderId})
        .select('name _id') // Select only name and _id fields
        .populate('leader', '-password');
        if (!existingProject) {
            return res.json({
                success: false,
                message: "No project found"
            })
        }
        else {
            return res.json({
                success: true,
                message: " project found",
                existingProject
            })
        }
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: "No project found"
        })
    }
}