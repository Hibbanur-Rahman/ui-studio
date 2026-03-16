import Request from "@/config/apiConfig";
import { removeAuthToken } from "@/utils/auth.utils";

interface LoginPayload {
  identifier: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: any;
    token: string;
  };
}

const Login = async (
  payload: LoginPayload
): Promise<{ status: number; data: LoginResponse }> => {
  return Request({
    method: "POST",
    url: "auth/login",
    data: payload,
    skipAuthRedirect: true,
  });
};

const Verify = async (): Promise<{ status: number; data: any }> => {
  return Request({
    method: "GET",
    url: "auth/me",
    secure: true,
  });
};

const Logout = async (): Promise<{ status: number; data: any }> => {
  // Clear token from both localStorage and cookie
  if (typeof window !== 'undefined') {
    removeAuthToken();
  }
  // If backend has a logout endpoint, call it here
  // For now, just clear token storage
  return Promise.resolve({ status: 200, data: { success: true } });
};

const GetAllOtps = async ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}): Promise<{ status: number; data: any }> => {
  return Request({
    method: "GET",
    url: "auth/otps",
    secure: true,
    params: {
      page: page ?? 1,
      limit: limit ?? 25,
    },
  });
};
const ChangePassword = async (payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ status: number; data: any }> => {
  return Request({
    method: "PATCH",
    url: "auth/change-password",
    data: payload,
    secure: true,
  });
};

const UpdateProfile = async (payload: {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
}): Promise<{ status: number; data: any }> => {
  return Request({
    method: "PATCH",
    url: "auth/update-profile",
    data: payload,
    secure: true,
  });
};

// Forgot Password - Send OTP
const SendForgotPasswordOTP = async (payload: {
  email: string;
}): Promise<{ status: number; data: any }> => {
  return Request({
    method: "POST",
    url: "auth/forgot-password/send-otp",
    data: payload,
    skipAuthRedirect: true,
  });
};

// Forgot Password - Verify OTP
const VerifyForgotPasswordOTP = async (payload: {
  email: string;
  otp: string;
}): Promise<{ status: number; data: any }> => {
  return Request({
    method: "POST",
    url: "auth/forgot-password/verify-otp",
    data: payload,
    skipAuthRedirect: true,
  });
};

// Forgot Password - Reset Password
const ResetPassword = async (payload: {
  email: string;
  newPassword: string;
}): Promise<{ status: number; data: any }> => {
  return Request({
    method: "POST",
    url: "auth/forgot-password/reset",
    data: payload,
    skipAuthRedirect: true,
  });
};

const AuthService = {
  Login,
  Verify,
  Logout,
  GetAllOtps,
  ChangePassword,
  UpdateProfile,
  SendForgotPasswordOTP,
  VerifyForgotPasswordOTP,
  ResetPassword
};

export default AuthService;
