import connectToDb from "../../../../database";
import JoinReqUserModel from "../../../../model/joinRequestModel";

export default async function GET(req, res) {
    try {
        await connectToDb();
        const { id } = req.query; // Extracting the id parameter from the query
        if (!id) {
            return res.json({ error: "Missing project ID" });
        }
        const userRequests = await JoinReqUserModel.find({ projectId: id }); // Querying the database with projectId
        if (userRequests.length > 0) {
            return res.json({
                success: true,
                message: "User requests fetched successfully",
                userRequests
            });
        } else {
            return res.json({
                success: false,
                message: "There are no user requests for this project ID",
                userRequests: [] // Return an empty array if no user requests are found
            });
        }
    } catch (error) {
        console.error("Error:", error);
        res.json({ error: "Internal Server Error" });
    }
}
