import mongoose, { Document, Model } from "mongoose";

//interface for Api Log document
interface IApiLog extends Document {
    endpoint: string;
    method: string;
    statusCode: number;
    responseTime: number;
    userId?: string;
    ipAddress: string;
}

//interface for model
interface IApiLogModel extends Model<IApiLog> {};

// Api Logs Schema
const ApiLogsSchema = new mongoose.Schema({
    endpoint: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    statusCode: {
        type: Number,
        required: true
    },
    responseTime: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: false
    },
    ipAddress: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const ApiLogsModel = mongoose.model<IApiLog, IApiLogModel>("ApiLog", ApiLogsSchema);
export default ApiLogsModel;