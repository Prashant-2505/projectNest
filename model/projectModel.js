import mongoose from "mongoose";
import TicketModel from "./ticketModel";
import UserModel from "./userModel";
import TaskModel from "./taskModel";

const projectSchema = mongoose.Schema({
    name: { type: String, required: true },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: UserModel },
    member: [{ type: mongoose.Schema.Types.ObjectId, ref: UserModel }],
    description: { type: String, required: true },
    link: { type: String },
    tech: { type: [String], default: null },
    task: [{ type: mongoose.Schema.Types.ObjectId, ref: TaskModel }], // Reference to TaskModel
    ticket: { type: [mongoose.Schema.Types.ObjectId], ref: TicketModel },
},
    { timestamps: true });

const ProjectModel = mongoose.models.ProjectModel || mongoose.model('ProjectModel', projectSchema);

export default ProjectModel