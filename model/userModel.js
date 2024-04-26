import mongoose from "mongoose";


const userModel = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    projects: { type: [mongoose.Schema.Types.ObjectId], ref: 'ProjectModel' },
    task: { type: [mongoose.Schema.Types.ObjectId], ref: 'TaskModel' },
    ticket: { type: [mongoose.Schema.Types.ObjectId], ref: 'TicketModel' },
    pic: {
        type: String,
        required: true,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
}, { timestamps: true });

const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", userModel);

export default UserModel;
