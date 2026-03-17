import mongoose, { Model } from "mongoose";
import { IActivity } from "../../types/activity.types";

//interface for model
interface IActivityModel extends Model<IActivity> {};

// Activity Schema
const ActivitySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    activityType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const ActivityModel = mongoose.model<IActivity, IActivityModel>("Activity", ActivitySchema);
export default ActivityModel;