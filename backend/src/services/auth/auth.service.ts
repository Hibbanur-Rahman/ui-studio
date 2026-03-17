import httpStatusConstant from "../../constant/httpStatus.constant"
import { getToken } from "../../middleware/auth.middleware";
import BaseUserModel from "../../models/user/base.user.model";
import AdminModel from "../../models/user/admin.model";
import { generateUserId } from "../../utils/getRandom.utils";
import { Roles } from "../../enums/user.enums";
import { LoginService, PasscodeService, RegisterService} from "../../types/auth.types";
import ActivityService from "../activity/activity.service";

const Login = async (payload: LoginService) => {
    try {
        const { identifier, password } = payload;

        const user = await BaseUserModel.findOne({
            $or: [
                {
                    email: identifier
                },
                {
                    phone: identifier.startsWith('+91') ? identifier : `+91${identifier}`

                }
            ]
        }).select('+password');
        if (!user) {
            return {
                success: false,
                status: httpStatusConstant.NOT_FOUND,
                response: {
                    message: 'User not found'
                }
            }
        }

        // Check if user account is active
        if (user.isActive === false) {
            return {
                success: false,
                status: httpStatusConstant.FORBIDDEN,
                response: {
                    message: 'Your account has been deactivated. Please contact support.'
                }
            }
        }

        if (password) {
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                const isDefaultPasswordValid = await user.comparePassword('12345678');
                if (!isDefaultPasswordValid) {
                    return {
                        success: false,
                        status: httpStatusConstant.UNAUTHORIZED,
                        response: {
                            message: 'Password is incorrect'
                        }
                    }
                }
                return {
                    success: true,
                    status: httpStatusConstant.OK,
                    response: {
                        message: "Passcode is not set. Please create your passcode.",
                        data: {
                            isPasscodeSet: false,
                        }
                    }
                }
            }
        }

        const payloadSensitive = {
            userId: user.userId,
            email: user.email,
            phone: user.phone,
            username: user.username,
            role: user.role
        }
        const token = await getToken(payloadSensitive);

        await ActivityService.CreateActivity({
            userId: user.userId,
            activityType: "LOGIN",
            description: `User logged in with identifier: ${identifier}`
        })

        return {
            success: true,
            status: httpStatusConstant.OK,
            response: {
                message: "Login successfully",
                data: {
                    user,
                    token
                }
            }
        }

    } catch (error: any) {
        return {
            success: false,
            status: httpStatusConstant.INTERNAL_SERVER_ERROR,
            response: {
                error: error?.message,
                message: 'something went wrong'
            }

        }
    }
}

const Register = async (payload: RegisterService) => {
    try {
        const { email, phone, password, username, role } = payload;


        let isExistingUser = null;
        if (email.trim()) {
            isExistingUser = await BaseUserModel.findOne({
                email: email
            });
        }
        if (phone && !isExistingUser) {
            isExistingUser = await BaseUserModel.findOne({
                phone: phone
            });
        }
        if (isExistingUser) {
            let message = '';
            if (isExistingUser.email === email) {
                message = `User with email ${email} already exists`;
            } else if (isExistingUser.phone === phone) {
                message = `User with phone ${phone} already exists`;
            }

            return {
                success: false,
                status: httpStatusConstant.BAD_REQUEST,
                response: {
                    message: message
                }
            }
        }
        const userId = generateUserId(role as keyof typeof Roles);
        console.log("generated userId:", userId);

        const createObject: any = {
            userId,
            password: password,
            username: username,
            role: role,
            isPasscodeSet: false
        };

        // Add email if present and not empty
        if (email && email.trim()) {
            createObject.email = email;
        }

        // Add phone with +91 prefix if present and not empty
        if (phone && phone.trim()) {
            createObject.phone = phone.startsWith('+91') ? phone : `+91${phone}`;
        }



        try {
            const user = await BaseUserModel.create(createObject);


            await ActivityService.CreateActivity({
                userId: user.userId,
                activityType: "REGISTRATION",
                description: `User registered with username: ${username}`
            })


            return {
                success: true,
                status: httpStatusConstant.OK,
                response: {
                    message: "User Register successfully",
                    data: user
                }
            };
        } catch (createError: any) {
            console.error("Error creating user:", createError);
            console.error("Error details:", {
                name: createError?.name,
                message: createError?.message,
                code: createError?.code,
                errors: createError?.errors
            });

            return {
                success: false,
                status: httpStatusConstant.BAD_REQUEST,
                response: {
                    message: 'Failed to create user',
                    error: createError?.message || 'Database error'
                }
            };
        }
    } catch (error: any) {
        console.log("Register Error:", error);
        return {
            success: false,
            status: httpStatusConstant.INTERNAL_SERVER_ERROR,
            response: {
                error: error?.message,
                message: 'something went wrong'
            }
        }
    }
}

const CreatePasscode = async (payload: PasscodeService) => {
    try {
        const { identifier, passcode } = payload;
        if (!identifier || !passcode) {
            return {
                success: false,
                status: httpStatusConstant.BAD_REQUEST,
                response: {
                    message: "Identifier and passcode are required"
                }
            }
        }


        const user = await BaseUserModel.findOne({
            $or: [
                {
                    email: identifier
                },
                {
                    phone: identifier.startsWith('+91') ? identifier : `+91${identifier}`
                }
            ]
        });
        if (!user) {
            return {
                success: false,
                status: httpStatusConstant.NOT_FOUND,
                response: {
                    message: 'User not found'
                }
            }
        }
        // const hashedPasscode = await bcrypt.hash(passcode, 12);
        user.password = passcode;
        user.isPasscodeSet = true;
        await user.save();

        const payloadSensitive = {
            userId: user.userId,
            email: user.email,
            phone: user.phone,
            username: user.username,
            role: user.role
        }
        const token = await getToken(payloadSensitive);


        await ActivityService.CreateActivity({
            userId: user.userId || 'N/A',
            activityType: "CREATE_PASSCODE",
            description: `Passcode created for ${identifier}`
        })

        return {
            success: true,
            status: httpStatusConstant.OK,
            response: {
                message: "Passcode created successfully",
                data: {
                    user,
                    token
                }
            }
        }
    } catch (error: any) {
        return {
            success: false,
            status: httpStatusConstant.INTERNAL_SERVER_ERROR,
            response: {
                error: error?.message,
                message: 'something went wrong'
            }
        }
    }
}

const CreateDefaultAdmin = async () => {
    try {
        const existingAdmin = await BaseUserModel.findOne({
            email: process.env.DEFAULT_ADMIN_EMAIL
        });
        if (existingAdmin) {

            return {
                success: true,
                status: httpStatusConstant.OK,
                response: {
                    message: "Default admin already exists",
                    data: existingAdmin
                }
            }
        }
        // const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD!, 12);
        const userId = generateUserId(Roles.ADMIN as keyof typeof Roles);
        const adminUser = await AdminModel.create({
            userId,
            email: process.env.DEFAULT_ADMIN_EMAIL!,
            phone: '',
            password: process.env.DEFAULT_ADMIN_PASSWORD!,
            username: process.env.DEFAULT_ADMIN_NAME!,
            role: Roles.ADMIN
        });


        if (!adminUser) {
            return {
                success: false,
                status: httpStatusConstant.BAD_REQUEST,
                response: {
                    message: 'something wrong while create default admin user'
                }
            }
        }

        return {
            success: true,
            status: httpStatusConstant.OK,
            response: {
                message: "Default admin created successfully",
                data: adminUser
            }
        }
    } catch (error) {
        console.log("CreateDefaultAdmin Error:", error);
        return {
            success: false,
            status: httpStatusConstant.INTERNAL_SERVER_ERROR,
            response: {
                error: (error as any)?.message,
                message: 'something went wrong'
            }
        }
    }
}

const FindUserByEmailOrPhone = async (payload: { identifier: string }) => {
    try {
        const { identifier } = payload;
        const user = await BaseUserModel.findOne({
            $or: [
                {
                    email: identifier
                },
                {
                    phone: identifier?.startsWith('+91') ? identifier : `+91${identifier}`
                }
            ]
        });

        if (!user) {
            return {
                success: false,
                status: httpStatusConstant.OK,
                response: {
                    message: 'User not found',
                    data: false
                }
            }
        }
        return {
            success: true,
            status: httpStatusConstant.OK,
            response: {
                message: "User found successfully",
                data: user
            }
        };
    } catch (error) {
        console.log("FindUserByEmailOrPhone Error:", error);
        return {
            success: false,
            status: httpStatusConstant.INTERNAL_SERVER_ERROR,
            response: {
                error: (error as any)?.message,
                message: 'something went wrong'
            }
        };
    }
}

const GetUserDetails = async (payload: {
    userId: string;
}) => {
    try {
        const { userId } = payload;

        const userDoc = await BaseUserModel.findOne({ userId }).select("profileImg city pinCode houseNo street landmark dateOfBirth nominee verificationStatus userId username email phone role moduleAndPermissions");

        if (!userDoc) {
            return {
                success: false,
                status: httpStatusConstant.NOT_FOUND,
                response: {
                    message: 'User not found'
                }
            };
        }

        const user = userDoc as any;
        return {
            success: true,
            status: httpStatusConstant.OK,
            response: {
                message: "User details fetched successfully",
                data: {
                    ...user.toObject(),
                }
            }
        };

    } catch (error) {
        console.log("GetUserDetails Error:", error);
        return {
            success: false,
            status: httpStatusConstant.INTERNAL_SERVER_ERROR,
            response: {
                error: (error as any)?.message,
                message: 'something went wrong'
            }
        };
    }
}


const ChangePassword = async (payload: { userId: string, currentPassword: string, newPassword: string }) => {
    try {
        const { userId, currentPassword, newPassword } = payload;
        const user = await BaseUserModel.findOne({ userId }).select('+password');
        if (!user) {
            return {
                success: false,
                status: httpStatusConstant.NOT_FOUND,
                response: {
                    message: 'User not found'
                }
            }
        }

        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return {
                success: false,
                status: httpStatusConstant.BAD_REQUEST,
                response: {
                    message: 'Current password is incorrect'
                }
            }
        }

        user.password = newPassword;
        await user.save();

        await ActivityService.CreateActivity({
            userId: user.userId,
            activityType: "CHANGE_PASSWORD",
            description: `User changed their password`
        })

        return {
            success: true,
            status: httpStatusConstant.OK,
            response: {
                message: "Password changed successfully"
            }
        }
    } catch (error: any) {
        console.log("ChangePassword Error:", error);
        return {
            success: false,
            status: httpStatusConstant.INTERNAL_SERVER_ERROR,
            response: {
                error: error?.message,
                message: 'something went wrong'
            }
        }
    }
}

const UpdateProfile = async (payload: { userId: string, username?: string, email?: string, phone?: string, password?: string }) => {
    try {
        const { userId, username, email, phone, password } = payload;
        const user = await BaseUserModel.findOne({ userId }).select('+password');
        if (!user) {
            return {
                success: false,
                status: httpStatusConstant.NOT_FOUND,
                response: {
                    message: 'User not found'
                }
            }
        }

        const isSensitiveChanged = (email && email !== user.email) || (phone && phone !== user.phone);

        if (isSensitiveChanged) {
            if (!password) {
                return {
                    success: false,
                    status: httpStatusConstant.BAD_REQUEST,
                    response: {
                        message: 'Password is required to change email or phone'
                    }
                }
            }
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    status: httpStatusConstant.BAD_REQUEST,
                    response: {
                        message: 'Current password is incorrect'
                    }
                }
            }
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (phone) user.phone = phone.startsWith('+91') ? phone : `+91${phone}`;

        await user.save();

        await ActivityService.CreateActivity({
            userId: user.userId,
            activityType: "UPDATE_PROFILE",
            description: `User updated their profile details`
        })

        return {
            success: true,
            status: httpStatusConstant.OK,
            response: {
                message: "Profile updated successfully",
                data: user
            }
        }
    } catch (error: any) {
        console.log("UpdateProfile Error:", error);
        return {
            success: false,
            status: httpStatusConstant.INTERNAL_SERVER_ERROR,
            response: {
                error: error?.message,
                message: 'something went wrong'
            }
        }
    }
}

const Logout = async (payload: { userId: string, deviceId?: string }) => {
    try {
        const { userId, deviceId } = payload;
        const user = await BaseUserModel.findOne({ userId });
        if (!user) {
            return {
                success: false,
                status: httpStatusConstant.NOT_FOUND,
                response: {
                    message: 'User not found'
                }
            }
        }

        if (user.metadata) {
            user.metadata.deviceInfo = [];
            user.markModified('metadata');
            await user.save();
        }

        await ActivityService.CreateActivity({
            userId: user.userId,
            activityType: "LOGOUT",
            description: `User logged out${deviceId ? ` from device: ${deviceId}` : ''}`
        })

        return {
            success: true,
            status: httpStatusConstant.OK,
            response: {
                message: "Logged out successfully"
            }
        }
    } catch (error: any) {
        console.log("Logout Error:", error);
        return {
            success: false,
            status: httpStatusConstant.INTERNAL_SERVER_ERROR,
            response: {
                error: error?.message,
                message: 'something went wrong'
            }
        }
    }
}

const AuthService = {
    Logout,
    Login,
    Register,
    CreatePasscode,
    CreateDefaultAdmin,
    FindUserByEmailOrPhone,
    GetUserDetails,
    ChangePassword,
    UpdateProfile
}

export default AuthService;