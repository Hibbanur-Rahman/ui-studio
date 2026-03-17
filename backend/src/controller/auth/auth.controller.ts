import httpStatusConstant from "../../constant/httpStatus.constant";
import { Request, Response } from "express";
import AuthService from "../../services/auth/auth.service";
import { LoginService, PasscodeService, RegisterService, SendOTPService, VerifyOTPService } from "../../types/auth.types";

interface LoginRequest extends Request {
    body: LoginService;
}

interface RegisterRequest extends Request {
    body: RegisterService;
}

interface SendOTPRequest extends Request {
    body: SendOTPService;
}

interface VerifyOTPRequest extends Request {
    body: VerifyOTPService;
}

interface CreatePassCodeRequest extends Request {
    body: PasscodeService;
}

interface ErrorResponse {
    success: false;
    error?: string;
    message: string;
}

interface SuccessResponse {
    success: true;
    data?: unknown;
    message?: string;
}

interface GetUserDetailsRequest extends Request {
    user?: {
        userId: string;
    }
}
const Login = async (
    req: LoginRequest,
    res: Response<ErrorResponse | SuccessResponse>
): Promise<Response<ErrorResponse | SuccessResponse> | void> => {
    try {
        const result = await AuthService.Login(req.body);
        return res.status(result.status).json({ success: result.success, ...result.response });
    } catch (error: any) {
        console.log("error while logging:", error);
        return res.status(httpStatusConstant.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: error?.message,
            message: "something went wrong"
        })
    }
}

const Register = async (
    req: RegisterRequest,
    res: Response<ErrorResponse | SuccessResponse>
): Promise<Response<ErrorResponse | SuccessResponse> | void> => {
    try {
        const result = await AuthService.Register(req.body);
        return res.status(result.status).json({ success: result.success, ...result.response });
    } catch (error: any) {
        console.log("error while register:", error);
        return res.status(httpStatusConstant.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: error?.message,
            message: "something went wrong"
        })
    }
}


const CreatePasscode = async (
    req: CreatePassCodeRequest,
    res: Response<ErrorResponse | SuccessResponse>
): Promise<Response<ErrorResponse | SuccessResponse> | void> => {
    try {
        const result = await AuthService.CreatePasscode(req.body);
        return res.status(result.status).json({ success: result.success, ...result.response });
    } catch (error: any) {
        console.log("error while create passcode:", error);
        return res.status(httpStatusConstant.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: error?.message,
            message: 'Something went wrong'
        })
    }
}

const FindUserByEmailOrPhone = async (
    req: Request,
    res: Response<ErrorResponse | SuccessResponse>
): Promise<Response<ErrorResponse | SuccessResponse> | void> => {
    try {
        const result = await AuthService.FindUserByEmailOrPhone(req.body);
        return res.status(result.status).json({ success: result.success, ...result.response });
    } catch (error: any) {
        console.log("error while finding user:", error);
        return res.status(httpStatusConstant.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: error?.message,
            message: 'Something went wrong'
        })
    }
}

const GetUserDetails = async (
    req: GetUserDetailsRequest,
    res: Response<ErrorResponse | SuccessResponse>
): Promise<Response<ErrorResponse | SuccessResponse> | void> => {
    try {
        if (!req?.user?.userId) {
            return res.status(httpStatusConstant.UNAUTHORIZED).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        const result = await AuthService.GetUserDetails({ userId: req.user.userId });
        return res.status(result.status).json({ success: result.success, ...result.response });
    } catch (error: any) {
        console.log("error while getting user details:", error);
        return res.status(httpStatusConstant.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: error?.message,
            message: 'Something went wrong'
        })
    }
}

const ChangePassword = async (
    req: GetUserDetailsRequest,
    res: Response<ErrorResponse | SuccessResponse>
): Promise<Response<ErrorResponse | SuccessResponse> | void> => {
    try {
        if (!req?.user?.userId) {
            return res.status(httpStatusConstant.UNAUTHORIZED).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        const result = await AuthService.ChangePassword({
            userId: req.user.userId,
            ...req.body
        });
        return res.status(result.status).json({ success: result.success, ...result.response });
    } catch (error: any) {
        console.log("error while changing password:", error);
        return res.status(httpStatusConstant.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: error?.message,
            message: 'Something went wrong'
        })
    }
}

const UpdateProfile = async (
    req: GetUserDetailsRequest,
    res: Response<ErrorResponse | SuccessResponse>
): Promise<Response<ErrorResponse | SuccessResponse> | void> => {
    try {
        if (!req?.user?.userId) {
            return res.status(httpStatusConstant.UNAUTHORIZED).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        const result = await AuthService.UpdateProfile({
            userId: req.user.userId,
            ...req.body
        });
        return res.status(result.status).json({ success: result.success, ...result.response });
    } catch (error: any) {
        console.log("error while updating profile:", error);
        return res.status(httpStatusConstant.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: error?.message,
            message: 'Something went wrong'
        })
    }
}

const Logout = async (
    req: GetUserDetailsRequest,
    res: Response<ErrorResponse | SuccessResponse>
): Promise<Response<ErrorResponse | SuccessResponse> | void> => {
    try {
        if (!req?.user?.userId) {
            return res.status(httpStatusConstant.UNAUTHORIZED).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        const result = await AuthService.Logout({
            userId: req.user.userId
        });
        return res.status(result.status).json({ success: result.success, ...result.response });
    } catch (error: any) {
        console.log("error while logout:", error);
        return res.status(httpStatusConstant.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: error?.message,
            message: 'Something went wrong'
        })
    }
}

export {
    Login,
    Register,
    CreatePasscode,
    FindUserByEmailOrPhone,
    GetUserDetails,
    ChangePassword,
    UpdateProfile,
    Logout
}