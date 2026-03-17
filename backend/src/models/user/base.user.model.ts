import bcrypt from "bcryptjs";
import mongoose, { Document, Model } from "mongoose";

// Interface for the user document
interface IBaseUser extends Document {
    userId: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    isActive: boolean;
    moduleAndPermissions: Array<{
        module?: string;
        permission?: string[];
    }>;
    metadata?: {
        lastLoginAt?: Date;
        loginCount?: number;
        passwordChangedAt?: Date;
        deviceInfo?: Array<{
            deviceId?: string;
            platform?: string;
            fcmToken?: string;
            deviceName?: string;
            lastActiveAt?: Date;
        }>;
    };
    isPasscodeSet?: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
    reasonForDeactivation?: string;
    deactivationRequestedAt?: Date;
    deactivationApprovedBy?: string;
}

// Interface for the model
interface IBaseUserModel extends Model<IBaseUser> { }

const BaseUserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        required: false,
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    reasonForDeactivation: {
        type: String,
        required: false
    },
    deactivationRequestedAt: {
        type: Date,
        required: false
    },
    deactivationApprovedBy: {
        type: String, //use the userId of admin who approved
        required: false
    },
    moduleAndPermissions: [
        {
            module: {
                type: String,
                required: false
            },
            permission: [
                {
                    type: String,
                    required: false
                }
            ]
        }
    ],
    metadata: {
        lastLoginAt: Date,
        loginCount: { type: Number, default: 0 },
        passwordChangedAt: Date,
        deviceInfo: [{
            deviceId: String,
            platform: String,
            fcmToken: String,
            deviceName: String,
            lastActiveAt: Date
        }]
    },
    isPasscodeSet: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    discriminatorKey: 'role'
});

// Pre-save middleware to format phone number
BaseUserSchema.pre('save', function (next) {
    // Format phone number with +91 if not already present
    if (this.phone && this.isModified('phone')) {
        // Remove any whitespace
        const cleanPhone = this.phone.trim();

        // Add +91 if not already present
        if (!cleanPhone.startsWith('+91')) {
            this.phone = `+91${cleanPhone}`;
        }
    }
    next();
});

// Pre-save middleware to hash password
BaseUserSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Hash password with cost of 12
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);

        // Set password changed timestamp
        if (!this.isNew) {
            if (!this.metadata) {
                this.set('metadata', {
                    loginCount: 0,
                    deviceInfo: []
                });
            } else {
                this.metadata.passwordChangedAt = new Date();
            }
        }

        next();
    } catch (error: any) {
        next(error);
    }
});

//Instance method to compare password
BaseUserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
}


const BaseUserModel = mongoose.model<IBaseUser, IBaseUserModel>('User', BaseUserSchema);
export default BaseUserModel;
export type { IBaseUser };