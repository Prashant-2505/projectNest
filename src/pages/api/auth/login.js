import UserModel from "../../../../model/userModel";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie'; // Import serialize function from cookie library
import connectToDb from "../../../../database";

export default async function (req, res) {
    try {
        await connectToDb(); // Ensure database connection

        const { email, password, leader } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
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
            } else {
                // Check if the provided password matches the hashed password in the database
                const checkPassword = bcrypt.compareSync(password, existingUser.password);
                if (!checkPassword) {
                    return res.json({
                        success: false,
                        message: "Wrong Password or Email. Please use valid details."
                    });
                } else {
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

                    // Return success message along with user details and token
                    return res.json({
                        success: true,
                        message: "Login successful",
                        user: {
                            email: existingUser.email,
                            name: existingUser.name,
                            id: existingUser._id,
                            leader,
                            token: token
                        }
                    });
                }
            }
        }
    } catch (error) {
        console.log(`Error while logging in. Please try again. ${error}`);

        return res.json({
            success: false,
            message: `Something went wrong! Please try again later. ${error}`
        });
    }
}
