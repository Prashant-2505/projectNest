import UserModel from "../../../../model/userModel";
import connectToDb from "../../../../database";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie'; // Import serialize function from cookie library

export default async function (req, res) {
    try {

        await connectToDb(); // Ensure database connection

        const { email, leader } = req.body;
        console.log(email, leader)

        // Check if email and password are provided
        if (!email ) {
            return res.json({
                success: false,
                message: "Please fill all required fields"
            });
        } else {
            // Find the user with the provided email
            const existingUser = await UserModel.findOne({ email });
            if (!existingUser) {
                return res.json({
                    success: false,
                    message: "User does not exist. Please register."
                });

            }

            // Generate JWT token for authentication
            const token = jwt.sign({
                id: existingUser._id,
                email: existingUser.email
            }, process.env.JWT_SECRET);

            // Set token in cookie
            const cookieOptions = {
                httpOnly: true,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            };
            const cookieSerialized = serialize('token', token, cookieOptions);
            res.setHeader('Set-Cookie', cookieSerialized);


            return res.json({
                success: true,
                message: "Login successful",
                user: {
                    id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    pic: existingUser.pic,
                    leader
                }
            });
        }
    }

    catch (error) {
        console.log(`Error while logging in. Please try again. ${error}`);

        return res.json({
            success: false,
            message: `Something went wrong! Please try again later. ${error}`
        });
    }
}