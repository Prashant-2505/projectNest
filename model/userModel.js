import mongoose from "mongoose";

const userModel = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    projects: { type: [Object], default: null }, // Specify type as an array of objects
    pic: {
        type: String,
        required: true,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
}, { timestamps: true });

const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", userModel);

export default UserModel;
