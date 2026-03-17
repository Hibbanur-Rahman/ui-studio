import { Request, Response } from "express";
import httpStatusConstant from "../../constant/httpStatus.constant";
import UsersService from "../../services/users/users.service";

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

interface GetUsersRequest extends Request {
  query: {
    status?: string;
    limit?: string;
    page?: string;
    role?: string;
    search?: string;
    verifystatus?: string;
    dateFrom?: string;
    dateTo?: string;
    city?: string;
    [key: string]: any;
  };
}

const GetUsers = async (
  req: GetUsersRequest,
  res: Response<ErrorResponse | SuccessResponse>
): Promise<Response<ErrorResponse | SuccessResponse> | void> => {
  try {
    // If no query parameters at all, return validation message
    if (!req.query || Object.keys(req.query).length === 0) {
      return res.status(httpStatusConstant.BAD_REQUEST).json({
        success: false,
        message: "Please provide a Valid API Parameter",
      });
    }

    const { status, limit, page, role, search, verifystatus, dateFrom, dateTo, city } = req.query;

    // Default to "all" if status is not provided (e.g. when only search is used)
    const normalizedStatus = (status || "all").toString().toLowerCase();
    const allowedStatuses = ["all", "active", "inactive", "visitors"];

    if (!normalizedStatus || !allowedStatuses.includes(normalizedStatus)) {
      return res.status(httpStatusConstant.BAD_REQUEST).json({
        success: false,
        message: "Please provide a Valid API Parameter",
      });
    }

    const parsedLimit = parseInt(limit || "25", 10);
    const parsedPage = parseInt(page || "1", 10);

    const queryKeys = Object.keys(req.query || {});
    const isExport = queryKeys.includes("export");
    let exportSkip = undefined;
    let safeLimit = Number.isNaN(parsedLimit) || parsedLimit <= 0 ? 25 : parsedLimit;
    const safePage = Number.isNaN(parsedPage) || parsedPage <= 0 ? 1 : parsedPage;

    if (isExport) {
      // Find range pattern like "1-200" in keys
      const rangeKey = queryKeys.find((key) => /^\d+-\d+$/.test(key));
      if (rangeKey) {
        const [start, end] = rangeKey.split("-").map(Number);
        if (!Number.isNaN(start) && !Number.isNaN(end)) {
          exportSkip = Math.max(0, start - 1);
          safeLimit = Math.min(200, end - start + 1);
        }
      } else {
        // If export flag present but no range key, cap limit at 200
        safeLimit = Math.min(safeLimit, 200);
      }
    }

    const normalizedRole = (role || "").toString().toUpperCase() || undefined;
    const normalizedVerifyStatus = verifystatus ? verifystatus.toString().toLowerCase() : undefined;

    const result = await UsersService.GetUsers({
      status: normalizedStatus as "all" | "active" | "inactive" | "visitors",
      limit: safeLimit,
      page: safePage,
      role: normalizedRole,
      search: search ? search.toString() : undefined,
      verifystatus: normalizedVerifyStatus,
      dateFrom: dateFrom ? dateFrom.toString() : undefined,
      dateTo: dateTo ? dateTo.toString() : undefined,
      city: city ? city.toString() : undefined,
      skip: exportSkip,
      isExport,
    });

    return res
      .status(result.status)
      .json({ success: result.success, ...result.response });
  } catch (error: any) {
    console.log("error while getting users:", error);
    return res.status(httpStatusConstant.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error?.message,
      message: "something went wrong",
    });
  }
};

const GetUserProfile = async (
  req: Request<{ id: string }>,
  res: Response<ErrorResponse | SuccessResponse>
): Promise<Response<ErrorResponse | SuccessResponse> | void> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(httpStatusConstant.BAD_REQUEST).json({
        success: false,
        message: "User id is required",
      });
    }

    const result = await UsersService.GetUserById(id);

    return res
      .status(result.status)
      .json({ success: result.success, ...result.response });
  } catch (error: any) {
    console.log("error while getting user profile:", error);
    return res.status(httpStatusConstant.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error?.message,
      message: "something went wrong",
    });
  }
};

interface UpdateUserProfileBody {
  username?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  currentEarning?: string;
  dateOfBirth?: string;
  fatherName?: string;
  city?: string;
  pinCode?: string;
  houseNo?: string;
  street?: string;
  landmark?: string;
  reasonForDeactivation?: string;
}

interface AuthRequest extends Request {
  user?: {
    userId: string;
    phoneNumber?: string;
    email?: string;
  };
}

const UpdateUserStatus = async (
  req: AuthRequest & Request<{ id: string }, unknown, UpdateUserProfileBody, { status?: string; profile?: string }>,
  res: Response<ErrorResponse | SuccessResponse>
): Promise<Response<ErrorResponse | SuccessResponse> | void> => {
  try {
    const { id } = req.params;
    const { status, profile } = req.query;

    if (!id) {
      return res.status(httpStatusConstant.BAD_REQUEST).json({
        success: false,
        message: "User id is required",
      });
    }

    // Check if this is a profile update request
    if (profile === "details" || profile === "alldetails") {
      const {
        username,
        email,
        phone,
        isActive,
        currentEarning,
        dateOfBirth,
        fatherName,
        city,
        pinCode,
        houseNo,
        street,
        landmark,
      } = req.body;

      const updatePayload: UpdateUserProfileBody = {};

      if (username !== undefined) updatePayload.username = username;
      if (email !== undefined) updatePayload.email = email;
      if (phone !== undefined) updatePayload.phone = phone;
      if (isActive !== undefined) updatePayload.isActive = isActive;

      // Only allow full profile fields when profile=alldetails
      if (profile === "alldetails") {
        if (currentEarning !== undefined)
          updatePayload.currentEarning = currentEarning;
        if (dateOfBirth !== undefined) updatePayload.dateOfBirth = dateOfBirth;
        if (fatherName !== undefined) updatePayload.fatherName = fatherName;
        if (city !== undefined) updatePayload.city = city;
        if (pinCode !== undefined) updatePayload.pinCode = pinCode;
        if (houseNo !== undefined) updatePayload.houseNo = houseNo;
        if (street !== undefined) updatePayload.street = street;
        if (landmark !== undefined) updatePayload.landmark = landmark;
      }

      // Handle optional profile image upload
      const profileImageFile = req.file;

      const result = await UsersService.UpdateUserProfile(id, updatePayload, profileImageFile);

      return res
        .status(result.status)
        .json({ success: result.success, ...result.response });
    }

    // Otherwise, handle status update (backward compatibility)
    const normalizedStatus = (status || "").toString().toLowerCase();

    if (!normalizedStatus || !["active", "inactive"].includes(normalizedStatus)) {
      return res.status(httpStatusConstant.BAD_REQUEST).json({
        success: false,
        message: "Invalid status. Allowed values are 'active' or 'inactive'. Or use 'profile=details' to update profile.",
      });
    }

    const isActive = normalizedStatus === "active";

    // Validate reason when deactivating
    if (!isActive) {
      // Only destructure reasonForDeactivation when deactivating
      const { reasonForDeactivation } = req.body || {};

      if (!reasonForDeactivation || typeof reasonForDeactivation !== "string") {
        return res.status(httpStatusConstant.BAD_REQUEST).json({
          success: false,
          message: "Reason for deactivation is required when deactivating a user",
        });
      }

      if (reasonForDeactivation.trim().length < 10) {
        return res.status(httpStatusConstant.BAD_REQUEST).json({
          success: false,
          message: "Reason for deactivation must be at least 10 characters",
        });
      }

      // Get admin userId from authenticated user
      const adminUserId = req.user?.userId;
      if (!adminUserId) {
        return res.status(httpStatusConstant.UNAUTHORIZED).json({
          success: false,
          message: "Admin user ID is required for deactivation",
        });
      }

      const result = await UsersService.UpdateUserStatus(
        id,
        isActive,
        reasonForDeactivation.trim(),
        adminUserId
      );

      return res
        .status(result.status)
        .json({ success: result.success, ...result.response });
    }

    // For activation, clear deactivation fields (no body required)
    const result = await UsersService.UpdateUserStatus(id, isActive);

    return res
      .status(result.status)
      .json({ success: result.success, ...result.response });
  } catch (error: any) {
    console.log("error while updating user:", error);
    return res.status(httpStatusConstant.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error?.message,
      message: "something went wrong",
    });
  }
};

// Add new user
const AddUser = async (
  req: Request,
  res: Response<ErrorResponse | SuccessResponse>
): Promise<Response<ErrorResponse | SuccessResponse> | void> => {
  try {
    const {
      name,
      email,
      phone,
      passcode,
      role,
      currentEarning,
      dateOfBirth,
      city,
      pinCode,
      houseNo,
      street,
      landmark,
      nominee,
      isActive
    } = req.body;

    // Validate required fields
    if (!name || !phone || !passcode || !role) {
      return res.status(httpStatusConstant.BAD_REQUEST).json({
        success: false,
        message: "Name, phone, passcode, and role are required fields"
      });
    }

    // Validate passcode is 4 digits
    if (!/^\d{4}$/.test(passcode)) {
      return res.status(httpStatusConstant.BAD_REQUEST).json({
        success: false,
        message: "Passcode must be exactly 4 digits"
      });
    }

    // Validate role
    const validRoles = ["USER", "STAFF", "ADMIN"];
    if (!validRoles.includes(role.toUpperCase())) {
      return res.status(httpStatusConstant.BAD_REQUEST).json({
        success: false,
        message: "Role must be USER, STAFF, or ADMIN"
      });
    }

    // Prepare user data
    const userData = {
      name,
      email,
      phone,
      passcode,
      role: role.toUpperCase(),
      currentEarning,
      dateOfBirth,
      city,
      pinCode,
      houseNo,
      street,
      landmark,
      nominee,
      isActive: isActive !== undefined ? isActive : true,
      profileImage: req.file
    };

    const result = await UsersService.AddUser(userData);

    return res
      .status(result.status)
      .json({ success: result.success, ...result.response });
  } catch (error: any) {
    console.log("error while adding user:", error);
    return res.status(httpStatusConstant.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error?.message,
      message: "something went wrong"
    });
  }
};

// New API to update profile details or upload photo
const UpdateProfile = async (
  req: AuthRequest & Request<{ id: string }, unknown, UpdateUserProfileBody, { photo?: string }>,
  res: Response<ErrorResponse | SuccessResponse>
): Promise<Response<ErrorResponse | SuccessResponse> | void> => {
  try {
    const { id } = req.params;
    const { photo } = req.query;

    if (!id) {
      return res.status(httpStatusConstant.BAD_REQUEST).json({
        success: false,
        message: "User id is required",
      });
    }

    const updatePayload: UpdateUserProfileBody = {};

    // Check if it's a photo update request
    if (photo === 'update') {
      const profileImageFile = req.file;
      if (!profileImageFile) {
        return res.status(httpStatusConstant.BAD_REQUEST).json({
          success: false,
          message: "Profile image file is required when photo update",
        });
      }

      const result = await UsersService.UpdateUserProfile(id, {}, profileImageFile);
      return res
        .status(result.status)
        .json({ success: result.success, ...result.response });
    }

    // Handle normal profile updates
    const { username, email, dateOfBirth } = req.body;

    if (username !== undefined) updatePayload.username = username;
    if (email !== undefined) updatePayload.email = email;
    if (dateOfBirth !== undefined) updatePayload.dateOfBirth = dateOfBirth;

    if (Object.keys(updatePayload).length === 0) {
      return res.status(httpStatusConstant.BAD_REQUEST).json({
        success: false,
        message: "At least one field (username, email, dateOfBirth) is required",
      });
    }

    const result = await UsersService.UpdateUserProfile(id, updatePayload);

    return res
      .status(result.status)
      .json({ success: result.success, ...result.response });

  } catch (error: any) {
    console.log("error while updating profile:", error);
    return res.status(httpStatusConstant.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error?.message,
      message: "something went wrong",
    });
  }
};





const GetUserList = async (
  req: Request,
  res: Response<ErrorResponse | SuccessResponse>
): Promise<Response<ErrorResponse | SuccessResponse> | void> => {
  try {
    const { limit, page, search, city } = req.query;

    const parsedLimit = parseInt(limit as string || "25", 10);
    const parsedPage = parseInt(page as string || "1", 10);

    const safeLimit = Math.min(
      Number.isNaN(parsedLimit) || parsedLimit <= 0 ? 25 : parsedLimit,
      200
    );
    const safePage =
      Number.isNaN(parsedPage) || parsedPage <= 0 ? 1 : parsedPage;

    const result = await UsersService.GetUserCompactList({
      limit: safeLimit,
      page: safePage,
      search: search ? search.toString() : undefined,
      city: city ? city.toString() : undefined,
    });

    return res
      .status(result.status)
      .json({ success: result.success, ...result.response });
  } catch (error: any) {
    console.log("error while getting user list:", error);
    return res.status(httpStatusConstant.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error?.message,
      message: "something went wrong",
    });
  }
};

export {
  GetUsers,
  GetUserProfile,
  UpdateUserStatus,
  AddUser,
  UpdateProfile,
  GetUserList
};
