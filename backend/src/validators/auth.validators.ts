import { body } from 'express-validator';
import { isEmailAvailable, isPhoneAvailable, isUsernameAvailable } from './custom.validators';

// Login validation
export const loginValidation = [
  body('identifier')
    .notEmpty()
    .withMessage('Please provide a valid identifier'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters long')
];

// Registration validation
export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email is required')
    .custom(isEmailAvailable),

  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .withMessage('Please provide a valid phone number')
    .custom(isPhoneAvailable),

  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens')
    .custom(isUsernameAvailable),

  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['USER', 'ADMIN'])
    .withMessage('Role must be one of: user, admin, moderator')
];

// Send OTP validation
export const sendOTPValidation = [
  body('identifier')
    .notEmpty()
    .withMessage('Email or phone number is required')
    .custom((value) => {
      // Check if it's either a valid email or phone number
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;

      if (!emailRegex.test(value) && !phoneRegex.test(value)) {
        throw new Error('Identifier must be a valid email or phone number');
      }
      return true;
    }),

  body('purpose')
    .notEmpty()
    .withMessage('Purpose is required')
    .isIn(['REGISTRATION', 'LOGIN', 'FORGOT_PASSWORD', 'NOMINEE_VERIFICATION'])
    .withMessage('Purpose must be one of: REGISTRATION, LOGIN, FORGOT_PASSWORD, NOMINEE_VERIFICATION'),

  body('identifierType')
    .optional()
    .isIn(['email', 'phone'])
    .withMessage('Identifier type must be either email or phone')
];

// Verify OTP validation
export const verifyOTPValidation = [
  body('identifier')
    .notEmpty()
    .withMessage('Email or phone number is required')
    .custom((value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;

      if (!emailRegex.test(value) && !phoneRegex.test(value)) {
        throw new Error('Identifier must be a valid email or phone number');
      }
      return true;
    }),

  body('otp')
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),

  body('purpose')
    .notEmpty()
    .withMessage('Purpose is required')
    .isIn(['REGISTRATION', 'LOGIN', 'FORGOT_PASSWORD', 'NOMINEE_VERIFICATION'])
    .withMessage('Purpose must be one of: REGISTRATION, LOGIN, FORGOT_PASSWORD, NOMINEE_VERIFICATION')
];

export const verifyPasscodeValidation = [
  body('identifier')
    .notEmpty()
    .withMessage('Email or phone number is required')
    .custom((value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!emailRegex.test(value) && !phoneRegex.test(value)) {
        throw new Error('Identifier must be a valid email or phone number');
      }
      return true;
    }),

  body('passcode')
    .notEmpty()
    .withMessage('Passcode is required')
    .isLength({ min: 4, max: 4 })
    .withMessage('Passcode must be exactly 4 characters long')
    .isAlphanumeric()
    .withMessage('Passcode must contain only letters and numbers')
];

export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
];

export const updateProfileValidation = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional()
    .notEmpty()
    .withMessage('Phone number cannot be empty'),

  body('password')
    .optional()
    .notEmpty()
    .withMessage('Password cannot be empty if provided')
];