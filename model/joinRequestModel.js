import mongoose from "mongoose";


const joinReqUserSschema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    projectId :{ type: String, required: true, unique: true }
}, { timestamps: true });

const JoinReqUserModel = mongoose.models.JoinReqUserModel || mongoose.model("JoinReqUserModel", joinReqUserSschema);

export default JoinReqUserModel;
