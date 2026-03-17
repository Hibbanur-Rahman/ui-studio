import { body } from "express-validator";

// Validator for sending forgot password OTP
export const sendForgotPasswordOTPValidation = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail()
        .trim()
];

// Validator for verifying forgot password OTP
export const verifyForgotPasswordOTPValidation = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail()
        .trim(),
    body("otp")
        .isString()
        .withMessage("OTP must be a string")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits")
        .trim()
];

// Validator for resetting password
export const resetPasswordValidation = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail()
        .trim(),
    body("newPassword")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .trim()
];
