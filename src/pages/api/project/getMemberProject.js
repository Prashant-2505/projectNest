import connectToDb from "../../../../database";
import ProjectModel from "../../../../model/projectModel";

export default async function POST(req, res) {
    try {
        await connectToDb();

        const memberId = req.query.id; 
        console.log("op")

        const existingProjects = await ProjectModel.find({ member: memberId }).populate('member');
       
        if (existingProjects.length === 0) {
            return res.json({
                success: false,
                message: "No projects found"
            });
        } else {
            // Assuming you want to return details of all projects the member is associated with
            const projects = existingProjects.map(project => ({
                _id: project._id,
                name: project.name,
                // Add other project details as needed
            }));
         console.log(projects)
            return res.json({
                success: true,
                message: "Projects found",
                existingProjects: projects
            });
        }
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Error fetching projects"
        });
    }
}
