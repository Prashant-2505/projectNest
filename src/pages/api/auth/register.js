import connectToDb from "../../../../database";
import UserModel from "../../../../model/userModel";
import bcrypt from 'bcryptjs';

export default async function POST(req, res) {
    try {
        await connectToDb();
        const { name, email, password, pic } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        // Check if user with the provided email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists, please login"
            });
        } else {
            var salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(password, salt)

            // Create the new user
            const user = await UserModel.create({
                name,
                email,
                password: hashedPassword, // Use the hashed password
                pic: pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" // Use provided pic or default value
            });

            if (user) {
                return res.status(200).json({
                    success: true,
                    message: "User registered successfully"
                });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Unable to register user"
        });
    }
}
