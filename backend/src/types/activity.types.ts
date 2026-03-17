import { Document } from "mongoose";

export interface IActivity extends Document {
    userId: string;
    activityType: string;
    description: string;
}

export interface CreateActivityPayload {
    userId: string;
    activityType: string;
    description: string;
}

export interface CreateAPILogPayload{
    endpoint: string;
    method: string;
    statusCode: number;
    responseTime: number;
    userId?: string;
    ipAddress: string;
}

