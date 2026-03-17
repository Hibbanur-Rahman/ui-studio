import express from "express";
import httpStatusConstant from "../../constant/httpStatus.constant";
import {
    GetUsers,
    GetUserProfile,
    UpdateUserStatus,
    AddUser,
    UpdateProfile,
    GetUserList
} from "../../controller/users/users.controller";

import { verifyToken } from "../../middleware/auth.middleware";
import { handleValidationErrors } from "../../middleware/validation.middleware";
import multer from "multer";
import { handleMulterError } from "../../middleware/multer.middleware";
import { userAndIpRateLimiter, generalRateLimiter } from "../../middleware/rateLimiter.middleware";


const Router = express.Router();

// Configure multer for profile image uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
});


Router.get("/health", (req, res) => {
    return res.status(httpStatusConstant.OK).json({
        success: true,
        message: "users route is running well",
    });
});

// /users?status=all&limit=25&page=1
// /users?status=active&limit=25&page=1
// /users?status=inactive&limit=25&page=1
// /users?status=visitors&limit=25&page=1       -> users where isPasscodeSet is not set or false
// GET /users?status=all&role=USER&limit=25&page=1
// GET /users?status=active&role=STAFF&limit=25&page=1
// GET /users?search=NAME_OR_EMAIL_OR_MOBILE_OR_USERID&limit=25&page=1
// GET /users?verifystatus=verified&limit=25&page=1    -> users with overallStatus = VERIFIED
// GET /users?verifystatus=unverified&limit=25&page=1  -> users with overallStatus = NOT_UPLOADED or other than VERIFIED
// GET /users?dateFrom=2025-01-01&dateTo=2025-01-31&limit=25&page=1  -> users created between dates (YYYY-MM-DD format)
// GET /users/list - simplified user list for selection components
// GET /users/list?search=phone,userid,username&limit=25&page=1
Router.get("/list", userAndIpRateLimiter, verifyToken, handleValidationErrors, GetUserList);

// GET /users?city=PATNA&limit=25&page=1              -> users filtered by city
// GET /users?dateFrom=2025-01-01&dateTo=2025-01-31&limit=25&page=1  -> users created between dates (YYYY-MM-DD format)
Router.get("/", userAndIpRateLimiter, verifyToken, handleValidationErrors, GetUsers);

// POST /users/add - create new user with optional profile image
Router.post("/add", userAndIpRateLimiter, verifyToken, upload.single('profileImage'), handleMulterError, AddUser);

// GET /users/profile/:id - full user details
Router.get("/profile/:id", userAndIpRateLimiter, verifyToken, GetUserProfile);

// PATCH /users/update/:id?status=active|inactive - update user isActive status
// PATCH /users/update/:id?profile=details - update user profile (name, email, phone, status)
// PATCH /users/update/:id?profile=allDetails - update user personal info (name, email, phone, status, currentEarning, dateOfBirth, fatherName, city, pinCode, houseNo, street, landmark, profileImage[optional])
Router.patch("/update/:id", userAndIpRateLimiter, verifyToken, upload.single('profileImage'), handleMulterError, UpdateUserStatus);


// This API for App User to Update Profile
// PATCH /users/:id/profile - update user profile details (username, email, dob)
// PATCH /users/:id/profile?photo=update - update user profile photo
Router.patch("/:id/profile", generalRateLimiter, verifyToken, upload.single('profileImage'), handleMulterError, UpdateProfile);


export default Router;




