import UserModel from "../../../../model/userModel"

export default async function PUT(req,res){
    try {
        const userId = req.query.userId
        console.log(userId)

        if(!userId)
            {
                return res.json({
                    success:false,
                    message:"no userId provided"
                })
            }

            const user = await UserModel.findByIdAndUpdate(userId, {
                name,
                
            })
    } catch (error) {
        
    }
}