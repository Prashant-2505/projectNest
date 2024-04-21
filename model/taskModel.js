import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    project: { type: Schema.Types.ObjectId, ref: 'ProjectModel' }, // Reference to ProjectModel
    assignedMember: { type: Schema.Types.ObjectId, ref: 'UserModel' }, // Reference to UserModel
    deadLine: { type: String, default: null },
    finishedDate: { type: String, default: "" },
    complete: { type: Boolean, default: false },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low"
    }
}, { timestamps: true });

// Create and export TaskModel
const TaskModel = mongoose.models.TaskModel || mongoose.model('TaskModel', taskSchema);
export default TaskModel;
