import mongoose from "mongoose";
import BaseUserModel from "./base.user.model";
import { Roles } from "../../enums/user.enums";

const AdminSchema = new mongoose.Schema({
    permissions: {
        type: [String],
        required: false,
        default: ['ALL']
    },
    lastLogin: {
        type: Date,
        required: false
    }
});

const AdminModel = BaseUserModel.discriminator(Roles.ADMIN, AdminSchema);
export default AdminModel;