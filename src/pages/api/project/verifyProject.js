import connectToDb from "../../../../database";
import ProjectModel from "../../../../model/projectModel";

export default async function POST(req, res) {
    try {
        await connectToDb()

        const { projectId } = req.body
        const existingProject = await ProjectModel.findById(projectId)
        .populate('leader', '-password')
        .populate('task')
        .populate('member','-password')
        //  .populate('ticket')
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