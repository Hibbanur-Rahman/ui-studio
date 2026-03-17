import mongoose from 'mongoose';
import BaseUserModel from './base.user.model';
import {  Roles } from '../../enums/user.enums';
import { IUser } from '../../types/auth.types';

// Interface for the model
interface IUserModel extends mongoose.Model<IUser> { }

const UserSchema = new mongoose.Schema({
    profileImg: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    pinCode: {
        type: String,
        required: false,
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },

}, {
    timestamps: true
});

const UserModel = BaseUserModel.discriminator(Roles.USER, UserSchema);
export default UserModel;
export type { IUser, IUserModel };