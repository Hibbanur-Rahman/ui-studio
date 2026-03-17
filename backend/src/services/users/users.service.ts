import httpStatusConstant from "../../constant/httpStatus.constant";
import UserModel, { IUser } from "../../models/users/user.model";
import { UploadToCloudinary } from "../../config/cloudinary.config";
import OTP from "../../models/otp/otp.model";
import { sendSMS } from "../sms.service/sms.processor";
import { generateOTP } from "../../utils/getRandom.utils";
import WalletService from "../wallet/wallet.service";

interface GetUsersPayload {
  status: "all" | "active" | "inactive" | "visitors";
  limit: number;
  page: number;
  role?: string;
  search?: string;
  verifystatus?: string;
  dateFrom?: string;
  dateTo?: string;
  city?: string;
  skip?: number;
  isExport?: boolean;
}

const GetUserById = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId).lean();

    if (!user) {
      return {
        success: false,
        status: httpStatusConstant.NOT_FOUND,
        response: {
          message: "User not found",
        },
      };
    }

    // Normalize verificationStatus (ensure strings) and calculate KYC verification percentage
    const rawVerificationStatus: any = (user as any).verificationStatus || {};

    const verificationStatus = {
      personalInfoStatus: rawVerificationStatus.personalInfoStatus || "NOT_UPLOADED",
      aadharVerificationStatus: rawVerificationStatus.aadharVerificationStatus || "NOT_UPLOADED",
      panVerificationStatus: rawVerificationStatus.panVerificationStatus || "NOT_UPLOADED",
      dlVerificationStatus: rawVerificationStatus.dlVerificationStatus || "NOT_UPLOADED",
      bankVerificationStatus: rawVerificationStatus.bankVerificationStatus || "NOT_UPLOADED",
      overallStatus: rawVerificationStatus.overallStatus || "NOT_UPLOADED",
    };

    const kycSteps = [
      verificationStatus.personalInfoStatus,
      verificationStatus.aadharVerificationStatus,
      verificationStatus.panVerificationStatus,
      verificationStatus.dlVerificationStatus,
      verificationStatus.bankVerificationStatus,
    ];

    const totalSteps = kycSteps.length;
    const completedSteps = kycSteps.filter((step) => step === "VERIFIED").length;

    const kycVerificationPercentage =
      totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    const responseData = {
      ...user,
      verificationStatus: {
        ...verificationStatus,
        overallStatus: verificationStatus.overallStatus === "VERIFIED" ? "Verified" : "Unverified"
      },
      kycVerificationPercentage,
    };

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message:
          verificationStatus.overallStatus === "NOT_UPLOADED"
            ? "All Documents Not Uploaded"
            : "User profile fetched successfully",
        data: responseData,
      },
    };
  } catch (error: any) {
    console.log("error while fetching user profile:", error);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Failed to fetch user profile",
        error: error?.message || error,
      },
    };
  }
};

const GetUsers = async ({
  status,
  limit,
  page,
  role,
  search,
  verifystatus,
  dateFrom,
  dateTo,
  city,
  skip,
  isExport,
}: GetUsersPayload) => {
  try {
    const query: Record<string, unknown> = {};

    if (status === "active") {
      query.isActive = true;
      query.isPasscodeSet = true; // Only show users who have set passcode
    } else if (status === "inactive") {
      query.isActive = false;
      query.isPasscodeSet = true; // Only show users who have set passcode
    } else if (status === "visitors") {
      // Visitors: users who have NOT set their passcode yet
      query.isPasscodeSet = false;
    } else if (status === "all") {
      // For status=all, only return users who have set their passcode
      query.isPasscodeSet = true;
    }

    if (role) {
      // Store role as provided (e.g. USER, ADMIN). Caller can normalize casing.
      query.role = role;
    }

    // Filter by KYC verification status
    if (verifystatus) {
      if (verifystatus === "verified") {
        query["verificationStatus.overallStatus"] = "VERIFIED";
      } else if (verifystatus === "unverified") {
        query["verificationStatus.overallStatus"] = { $ne: "VERIFIED" };
      }
    }

    // Filter by city
    if (city && city.trim() !== "") {
      query.city = new RegExp(city.trim(), "i");
    }

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      // Match on username, email, phone, or userId
      (query as any).$or = [
        { username: regex },
        { email: regex },
        { phone: { $regex: search.trim() } },
        { userId: { $regex: search.trim(), $options: "i" } },
        { vertevId: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Filter by date range (createdAt field)
    if (dateFrom || dateTo) {
      query.createdAt = {};

      if (dateFrom) {
        // Start of the day for dateFrom
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        (query.createdAt as any).$gte = fromDate;
      }

      if (dateTo) {
        // End of the day for dateTo
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        (query.createdAt as any).$lte = toDate;
      }
    }

    const skipCount = skip !== undefined ? skip : (page - 1) * limit;
    const limitCount = limit;

    // Build select fields - include all fields needed for export if isExport is true
    const baseFields = "_id userId username email phone role isActive isPasscodeSet verificationStatus profileImg createdAt vertevId";
    const exportFields = "currentEarning city pinCode dateOfBirth fatherName houseNo street landmark";

    const baseSelectFields = isExport
      ? `${baseFields} ${exportFields}`
      : baseFields;

    const deactivationFields = "reasonForDeactivation deactivationRequestedAt deactivationApprovedBy";
    const selectFields = status === "inactive"
      ? `${baseSelectFields} ${deactivationFields}`
      : baseSelectFields;

    const [rawUsers, total, [totalUsers, totalVisitors, totalInactive, totalVerified, totalUnverified]] =
      await Promise.all([
        UserModel.find(query)
          .sort({ createdAt: -1 })
          .skip(skipCount)
          .limit(limitCount)
          // Fetch fields including deactivation details for inactive users
          .select(selectFields)
          .lean(),
        UserModel.countDocuments(query),
        // Global summary counts (independent of current status filter)
        Promise.all([
          // Total users who have set their passcode
          UserModel.countDocuments({ isPasscodeSet: true }),
          // Total visitors: passcode not set or explicitly false
          UserModel.countDocuments({
            $or: [
              { isPasscodeSet: false },
              { isPasscodeSet: { $exists: false } },
            ],
          }),
          // Total inactive users (with passcode set)
          UserModel.countDocuments({
            isActive: false,
            isPasscodeSet: true,
          }),
          // Total verified users (KYC verified AND passcode set)
          UserModel.countDocuments({
            "verificationStatus.overallStatus": "VERIFIED",
            isPasscodeSet: true,
          }),
          // Total unverified users (KYC not verified AND passcode set)
          UserModel.countDocuments({
            "verificationStatus.overallStatus": { $ne: "VERIFIED" },
            isPasscodeSet: true,
          }),
        ]),
      ]);

    // S.NO in descending order across the filtered result set
    const startIndex = total - skipCount;

    const users = rawUsers.map((user: any, index: number) => {
      // Calculate KYC percentage
      const vs = user.verificationStatus || {};
      const kycSteps = [
        vs.personalInfoStatus,
        vs.aadharVerificationStatus,
        vs.panVerificationStatus,
        vs.dlVerificationStatus,
        vs.bankVerificationStatus
      ];
      const completedSteps = kycSteps.filter(step => step === "VERIFIED").length;
      const kycVerificationPercentage = Math.round((completedSteps / 5) * 100);

      const baseUser = {
        _id: user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        isPasscodeSet: user.isPasscodeSet,
        profileImg: user.profileImg || null,
        verificationStatus: {
          overallStatus:
            user.verificationStatus?.overallStatus === "VERIFIED" ? "Verified" : "Unverified",
        },
        kycVerificationPercentage,
        sno: startIndex - index > 0 ? startIndex - index : 0,
        createdAt: user.createdAt,
        vertevId: user.vertevId || "",
        ...(isExport && {
          currentEarning: user.currentEarning || "N/A",
          city: user.city || "N/A",
          pinCode: user.pinCode || "N/A",
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("en-IN") : "N/A",
          fatherName: user.fatherName || "N/A",
          address: `${user.houseNo || ''} ${user.street || ''} ${user.landmark || ''}`.trim() || "N/A"
        })
      };

      // Include deactivation details for inactive users
      if (status === "inactive") {
        return {
          ...baseUser,
          reasonForDeactivation: user.reasonForDeactivation || null,
          deactivationRequestedAt: user.deactivationRequestedAt || null,
          deactivationApprovedBy: user.deactivationApprovedBy || null,
        };
      }

      return baseUser;
    });

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "Users fetched successfully",
        data: {
          users,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 0,
          },
          summary: {
            totalUsers,
            totalVisitors,
            totalInactiveUsers: totalInactive,
            totalVerifiedUsers: totalVerified,
            totalUnverifiedUsers: totalUnverified,
          },
        },
      },
    };
  } catch (error: any) {
    console.log("error while fetching users:", error);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Failed to fetch users",
        error: error?.message || error,
      },
    };
  }
};

const UpdateUserStatus = async (
  userId: string,
  isActive: boolean,
  reasonForDeactivation?: string,
  deactivationApprovedBy?: string
) => {
  try {
    const updatePayload: any = { isActive };

    // When deactivating, save deactivation details
    if (!isActive && reasonForDeactivation && deactivationApprovedBy) {
      updatePayload.reasonForDeactivation = reasonForDeactivation;
      updatePayload.deactivationRequestedAt = new Date();
      updatePayload.deactivationApprovedBy = deactivationApprovedBy;
    }

    // When activating, clear deactivation fields
    if (isActive) {
      updatePayload.reasonForDeactivation = null;
      updatePayload.deactivationRequestedAt = null;
      updatePayload.deactivationApprovedBy = null;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updatePayload,
      { new: true }
    )
      .select(
        "_id userId username email phone role isActive isPasscodeSet verificationStatus.overallStatus reasonForDeactivation deactivationRequestedAt deactivationApprovedBy vertevId"
      )
      .lean();

    if (updatedUser) {
      (updatedUser as any).verificationStatus = {
        overallStatus: updatedUser.verificationStatus?.overallStatus === "VERIFIED" ? "Verified" : "Unverified"
      };
    }

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "User status updated successfully",
        data: updatedUser,
      },
    };
  } catch (error: any) {
    console.log("error while updating user status:", error);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Failed to update user status",
        error: error?.message || error,
      },
    };
  }
};

interface UpdateUserProfilePayload {
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
}

const UpdateUserProfile = async (userId: string, payload: UpdateUserProfilePayload, profileImageFile?: Express.Multer.File) => {
  try {
    // First, check if user exists
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return {
        success: false,
        status: httpStatusConstant.NOT_FOUND,
        response: {
          message: "User not found",
        },
      };
    }

    // Check for duplicate email if email is being updated
    if (payload.email !== undefined && payload.email.trim() !== "") {
      const emailExists = await UserModel.findOne({
        email: payload.email,
        _id: { $ne: userId }, // Exclude current user
      });
      if (emailExists) {
        return {
          success: false,
          status: httpStatusConstant.BAD_REQUEST,
          response: {
            message: "Email is Already Exist",
          },
        };
      }
    }

    // Check for duplicate phone if phone is being updated
    if (payload.phone !== undefined && payload.phone.trim() !== "") {
      // Ensure phone has +91 prefix for comparison
      const phoneToCheck = payload.phone.startsWith("+91")
        ? payload.phone
        : `+91${payload.phone}`;

      const phoneExists = await UserModel.findOne({
        phone: phoneToCheck,
        _id: { $ne: userId }, // Exclude current user
      });
      if (phoneExists) {
        return {
          success: false,
          status: httpStatusConstant.BAD_REQUEST,
          response: {
            message: "Mobile number Already Exist",
          },
        };
      }
    }

    const updateData: Record<string, unknown> = {};

    if (payload.username !== undefined) {
      updateData.username = payload.username;
    }
    if (payload.email !== undefined) {
      updateData.email = payload.email;
    }
    if (payload.phone !== undefined) {
      // Ensure phone has +91 prefix
      const phoneToUpdate = payload.phone.startsWith("+91")
        ? payload.phone
        : `+91${payload.phone}`;
      updateData.phone = phoneToUpdate;
    }
    if (payload.isActive !== undefined) {
      updateData.isActive = payload.isActive;
    }
    if (payload.currentEarning !== undefined) {
      updateData.currentEarning = payload.currentEarning;
    }
    if (payload.city !== undefined) {
      updateData.city = payload.city;
    }
    if (payload.pinCode !== undefined) {
      updateData.pinCode = payload.pinCode;
    }
    if (payload.houseNo !== undefined) {
      updateData.houseNo = payload.houseNo;
    }
    if (payload.street !== undefined) {
      updateData.street = payload.street;
    }
    if (payload.landmark !== undefined) {
      updateData.landmark = payload.landmark;
    }
    if (payload.fatherName !== undefined) {
      updateData.fatherName = payload.fatherName;
    }
    if (payload.dateOfBirth !== undefined) {
      // Accept ISO date string and convert to Date
      const dobDate = payload.dateOfBirth ? new Date(payload.dateOfBirth) : undefined;
      updateData.dateOfBirth = dobDate;

      // Auto-calculate age when dateOfBirth is provided
      if (dobDate) {
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        const dayDiff = today.getDate() - dobDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }

        updateData.age = age;
      } else {
        // If dob cleared, also clear age
        updateData.age = undefined;
      }
    }

    // Handle profile image upload if provided
    if (profileImageFile) {
      try {
        const uploadedUrl = await UploadToCloudinary(profileImageFile, "profile-images");
        if (uploadedUrl) {
          updateData.profileImg = uploadedUrl;
        } else {
          return {
            success: false,
            status: httpStatusConstant.INTERNAL_SERVER_ERROR,
            response: {
              message: "Failed to upload profile image",
            },
          };
        }
      } catch (uploadError: any) {
        console.log("Error uploading profile image:", uploadError);
        return {
          success: false,
          status: httpStatusConstant.INTERNAL_SERVER_ERROR,
          response: {
            message: "Failed to upload profile image",
            error: uploadError?.message || uploadError,
          },
        };
      }
    }

    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        status: httpStatusConstant.BAD_REQUEST,
        response: {
          message: "No fields to update",
        },
      };
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    )
      .select(
        "_id userId username email phone role isActive isPasscodeSet verificationStatus.overallStatus vertevId"
      )
      .lean();

    if (updatedUser) {
      (updatedUser as any).verificationStatus = {
        overallStatus: updatedUser.verificationStatus?.overallStatus === "VERIFIED" ? "Verified" : "Unverified"
      };
    }

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "User profile updated successfully",
        data: updatedUser,
      },
    };
  } catch (error: any) {
    console.log("error while updating user profile:", error);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Failed to update user profile",
        error: error?.message || error,
      },
    };
  }
};

interface UpdateNomineePayload {
  name?: string;
  relation?: string;
  phoneNumber?: string;
  isVerified?: boolean;
}

const UpdateNomineeDetails = async (userId: string, payload: UpdateNomineePayload) => {
  try {


    // First, check if user exists (using custom userId field, not MongoDB _id)
    const existingUser = await UserModel.findOne({ userId: userId });
    if (!existingUser) {
      return {
        success: false,
        status: httpStatusConstant.NOT_FOUND,
        response: {
          message: "User not found",
        },
      };
    }

    const updateData: Record<string, unknown> = {};

    if (payload.name !== undefined) {
      updateData["nominee.name"] = payload.name;
    }
    if (payload.relation !== undefined) {
      updateData["nominee.relation"] = payload.relation;
    }

    // Handle explicit verification status change FIRST
    // This ensures that if admin sets it explicitly, it won't be overridden
    const explicitVerificationSet = payload.isVerified !== undefined;
    if (explicitVerificationSet) {
      updateData["nominee.isVerified"] = payload.isVerified;
    }

    if (payload.phoneNumber !== undefined) {
      // Ensure phone has +91 prefix
      const phoneToUpdate = payload.phoneNumber.startsWith("+91")
        ? payload.phoneNumber
        : `+91${payload.phoneNumber}`;
      updateData["nominee.phoneNumber"] = phoneToUpdate;

      // Only reset verification if isVerified was NOT explicitly set in payload
      if (!explicitVerificationSet) {
        updateData["nominee.isVerified"] = false;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        status: httpStatusConstant.BAD_REQUEST,
        response: {
          message: "No fields to update",
        },
      };
    }



    const updatedUser = await UserModel.findOneAndUpdate(
      { userId: userId },
      updateData,
      { new: true }
    )
      .select(
        "_id userId username nominee"
      )
      .lean();

    if (!updatedUser) {
      return {
        success: false,
        status: httpStatusConstant.NOT_FOUND,
        response: {
          message: "User not found",
        },
      };
    }

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "Nominee details updated successfully",
        data: updatedUser,
      },
    };
  } catch (error: any) {
    console.log("error while updating nominee details:", error);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Failed to update nominee details",
        error: error?.message || error,
      },
    };
  }
};

// Add new user
const AddUser = async (userData: any) => {
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
      isActive,
      profileImage
    } = userData;

    // Check if phone already exists
    const existingUser = await UserModel.findOne({ phone });
    if (existingUser) {
      return {
        success: false,
        status: httpStatusConstant.CONFLICT,
        response: {
          message: "User with this phone number already exists"
        }
      };
    }

    // Generate unique userId
    const generateUserId = async (): Promise<string> => {
      const prefix = "USR";
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
      const userId = `${prefix}${timestamp}${random}`;

      // Check if userId already exists
      const exists = await UserModel.findOne({ userId });
      if (exists) {
        return generateUserId(); // Recursively generate new userId
      }
      return userId;
    };

    const userId = await generateUserId();

    // Upload profile image to Cloudinary if provided
    let profileImgUrl = null;
    if (profileImage) {
      try {
        const uploadResult = await UploadToCloudinary(profileImage, "user-profiles");
        profileImgUrl = uploadResult;
      } catch (uploadError) {
        console.error("Error uploading profile image:", uploadError);
        // Continue without profile image
      }
    }

    // Create user object
    const newUser = new UserModel({
      userId,
      username: name,
      email: email || undefined,
      phone,
      password: passcode, // Will be hashed by pre-save middleware
      role,
      isActive,
      isPasscodeSet: true,
      profileImg: profileImgUrl,
      currentEarning,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      city,
      pinCode,
      houseNo,
      street,
      landmark,
      nominee: nominee ? {
        name: nominee.name,
        relation: nominee.relation,
        phoneNumber: nominee.phoneNumber,
        isVerified: false
      } : undefined
    });

    await newUser.save();

    // Create wallet for the new user
    await WalletService.CreateWallet(newUser.userId);

    // Return user data without password
    const userResponse = await UserModel.findById(newUser._id).select('-password').lean();

    return {
      success: true,
      status: httpStatusConstant.CREATED,
      response: {
        message: "User created successfully",
        data: userResponse
      }
    };
  } catch (error: any) {
    console.error("Error in AddUser service:", error);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Failed to create user",
        error: error?.message || error
      }
    };
  }
};

// Step 1: Verify current passcode only
const VerifyCurrentPasscode = async (
  userId: string,
  currentPasscode: string
) => {
  try {
    // Find user and include password field for verification
    const user = await UserModel.findById(userId).select('+password');

    if (!user) {
      return {
        success: false,
        status: httpStatusConstant.NOT_FOUND,
        response: {
          message: "User not found"
        }
      };
    }

    // Verify current passcode
    const isCurrentPasscodeValid = await user.comparePassword(currentPasscode);
    if (!isCurrentPasscodeValid) {
      return {
        success: false,
        status: httpStatusConstant.UNAUTHORIZED,
        response: {
          message: "Current passcode is incorrect"
        }
      };
    }

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "Current passcode verified successfully"
      }
    };
  } catch (error: any) {
    console.error("Error in VerifyCurrentPasscode service:", error);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Failed to verify passcode",
        error: error?.message || error
      }
    };
  }
};

// Step 2: Change to new passcode (without verification)
const ChangeUserPasscode = async (
  userId: string,
  newPasscode: string
) => {
  try {
    // Find user and include password field to compare with new passcode
    const user = await UserModel.findById(userId).select('+password');

    if (!user) {
      return {
        success: false,
        status: httpStatusConstant.NOT_FOUND,
        response: {
          message: "User not found"
        }
      };
    }

    // Check if new passcode is same as current passcode
    const isSameAsCurrentPasscode = await user.comparePassword(newPasscode);
    if (isSameAsCurrentPasscode) {
      return {
        success: false,
        status: httpStatusConstant.BAD_REQUEST,
        response: {
          message: "New passcode cannot be the same as current passcode"
        }
      };
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPasscode;
    await user.save();

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "Passcode changed successfully"
      }
    };
  } catch (error: any) {
    console.error("Error in ChangeUserPasscode service:", error);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Failed to change passcode",
        error: error?.message || error
      }
    };
  }
};

// Send OTP for passcode change
const SendOTPForPasscodeChange = async (userId: string) => {
  try {
    // Find user by userId (not MongoDB _id)
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return {
        success: false,
        status: httpStatusConstant.NOT_FOUND,
        response: {
          message: "User not found"
        }
      };
    }

    if (!user.phone) {
      return {
        success: false,
        status: httpStatusConstant.BAD_REQUEST,
        response: {
          message: "User does not have a phone number registered"
        }
      };
    }

    // Delete existing OTPs for this user's phone and PASSCODE_CHANGE purpose
    await OTP.deleteMany({ identifier: user.phone, purpose: 'PASSCODE_CHANGE' });

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Send OTP via SMS
    const smsResult = await sendSMS(
      user.phone,
      `Your OTP is ${otp}. Please use this to verify your account. -MithilaStack`
    );

    if (smsResult && !smsResult.success) {
      console.error("Failed to send SMS:", smsResult.error);
      return {
        success: false,
        status: httpStatusConstant.BAD_REQUEST,
        response: {
          message: "Failed to send OTP via SMS",
          error: smsResult.error,
        }
      };
    }

    // Save OTP to database
    const otpDoc = await OTP.create({
      identifier: user.phone,
      identifierType: 'phone',
      otp,
      purpose: 'PASSCODE_CHANGE',
      expiresAt,
    });

    if (!otpDoc) {
      return {
        success: false,
        status: httpStatusConstant.INTERNAL_SERVER_ERROR,
        response: {
          message: "Failed to create OTP record",
        }
      };
    }

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: `OTP sent successfully to ${user.phone}`,
        data: {
          phone: user.phone
        }
      }
    };
  } catch (error: any) {
    console.error("Error in SendOTPForPasscodeChange service:", error);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Failed to send OTP",
        error: error?.message || error
      }
    };
  }
};

// Verify OTP for passcode change
const VerifyOTPForPasscodeChange = async (userId: string, otp: string) => {
  try {
    // Find user by userId (not MongoDB _id)
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return {
        success: false,
        status: httpStatusConstant.NOT_FOUND,
        response: {
          message: "User not found"
        }
      };
    }

    if (!user.phone) {
      return {
        success: false,
        status: httpStatusConstant.BAD_REQUEST,
        response: {
          message: "User does not have a phone number registered"
        }
      };
    }

    // Find OTP document
    const otpDoc = await OTP.findOne({
      identifier: user.phone,
      otp,
      purpose: 'PASSCODE_CHANGE',
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      return {
        success: false,
        status: httpStatusConstant.NOT_FOUND,
        response: {
          message: "Invalid or expired OTP"
        }
      };
    }

    if (otpDoc.attempts >= 3) {
      return {
        success: false,
        status: httpStatusConstant.BAD_REQUEST,
        response: {
          message: "Maximum OTP attempts exceeded"
        }
      };
    }

    // Increment attempts and mark as used
    otpDoc.attempts += 1;
    otpDoc.isUsed = true;
    await otpDoc.save();

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "OTP verified successfully"
      }
    };
  } catch (error: any) {
    console.error("Error in VerifyOTPForPasscodeChange service:", error);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Failed to verify OTP",
        error: error?.message || error
      }
    };
  }
};

// Change passcode with OTP verification only
const ChangePasscodeWithVerification = async (
  userId: string,
  newPasscode: string,
  otp: string
) => {
  try {
    // Find user by userId (not MongoDB _id) and include password field
    const user = await UserModel.findOne({ userId }).select('+password');

    if (!user) {
      return {
        success: false,
        status: httpStatusConstant.NOT_FOUND,
        response: {
          message: "User not found"
        }
      };
    }

    if (!user.phone) {
      return {
        success: false,
        status: httpStatusConstant.BAD_REQUEST,
        response: {
          message: "User does not have a phone number registered"
        }
      };
    }

    // Verify OTP
    const otpDoc = await OTP.findOne({
      identifier: user.phone,
      otp,
      purpose: 'PASSCODE_CHANGE',
      isUsed: true, // Should be already marked as used by VerifyOTPForPasscodeChange
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      return {
        success: false,
        status: httpStatusConstant.UNAUTHORIZED,
        response: {
          message: "Invalid or expired OTP. Please verify OTP first."
        }
      };
    }

    // Check if new passcode is same as current passcode
    const isSameAsCurrentPasscode = await user.comparePassword(newPasscode);
    if (isSameAsCurrentPasscode) {
      return {
        success: false,
        status: httpStatusConstant.BAD_REQUEST,
        response: {
          message: "New passcode cannot be the same as current passcode"
        }
      };
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPasscode;
    await user.save();

    // Delete all OTPs for this user after successful passcode change
    await OTP.deleteMany({ identifier: user.phone, purpose: 'PASSCODE_CHANGE' });

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "Passcode changed successfully"
      }
    };
  } catch (error: any) {
    console.error("Error in ChangePasscodeWithVerification service:", error);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Failed to change passcode",
        error: error?.message || error
      }
    };
  }
};

const GetUserCompactList = async ({
  limit = 25,
  page = 1,
  search,
  city
}: {
  limit?: number;
  page?: number;
  search?: string;
  city?: string;
}) => {
  try {
    const query: Record<string, unknown> = {};

    if (search && search.trim() !== "") {
      const searchStr = search.trim();
      const regex = new RegExp(searchStr, "i");
      query.$or = [
        { username: regex },
        { phone: { $regex: searchStr } },
        { userId: { $regex: searchStr, $options: "i" } },
        { vertevId: { $regex: searchStr, $options: "i" } },
      ];
    }

    if (city && city.trim() !== "") {
      query.city = new RegExp(city.trim(), "i");
    }

    const maxLimit = Math.min(limit, 200);
    const skip = (page - 1) * maxLimit;

    const [users, total] = await Promise.all([
      UserModel.find(query)
        .select("_id profileImg userId username phone vertevId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(maxLimit)
        .lean(),
      UserModel.countDocuments(query),
    ]);

    const hasNextPage = total > skip + users.length;

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "Users compact list fetched successfully",
        data: {
          users: users.map((u: any) => ({
            ...u,
            vertevId: u.vertevId || "VRPP00000"
          })),
          pagination: {
            total,
            page,
            limit: maxLimit,
            hasNextPage,
          },
        },
      },
    };
  } catch (error: any) {
    console.log("error while fetching compact users list:", error);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Failed to fetch compact users list",
        error: error?.message || error,
      },
    };
  }
};

const UsersService = {
  GetUsers,
  GetUserById,
  UpdateUserStatus,
  UpdateUserProfile,
  UpdateNomineeDetails,
  AddUser,
  VerifyCurrentPasscode,
  ChangeUserPasscode,
  SendOTPForPasscodeChange,
  VerifyOTPForPasscodeChange,
  ChangePasscodeWithVerification,
  GetUserCompactList,
};

export default UsersService;

