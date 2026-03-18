import mongoose from "mongoose";
const ProjectSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
  },
  {
    timestamps: true,
  },
);
const ProjectModel = mongoose.model("Project", ProjectSchema);
export default ProjectModel;