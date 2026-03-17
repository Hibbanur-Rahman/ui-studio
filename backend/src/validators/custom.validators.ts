import { CustomValidator } from 'express-validator';

// Custom validator for checking if email already exists
export const isEmailAvailable: CustomValidator = async (email: string) => {
  const BaseUserModel = (await import('../models/users/base.user.model')).default;
  const user = await BaseUserModel.findOne({ email, isDeleted: false });
  if (user) {
    throw new Error('Email already exists');
  }
  return true;
};

// Custom validator for checking if phone already exists
export const isPhoneAvailable: CustomValidator = async (phone: string) => {
  const BaseUserModel = (await import('../models/users/base.user.model')).default;
  const user = await BaseUserModel.findOne({ phone, isDeleted: false });
  if (user) {
    throw new Error('Phone number already exists');
  }
  return true;
};

// Custom validator for checking if username already exists
export const isUsernameAvailable: CustomValidator = async (username: string) => {
  const BaseUserModel = (await import('../models/users/base.user.model')).default;
  const user = await BaseUserModel.findOne({ username, isDeleted: false });
  if (user) {
    throw new Error('Username already exists');
  }
  return true;
};

// Custom validator for Indian phone numbers
export const isValidIndianPhone: CustomValidator = (phone: string) => {
  const indianPhoneRegex = /^(\+91|91|0)?[6789]\d{9}$/;
  if (!indianPhoneRegex.test(phone)) {
    throw new Error('Please provide a valid Indian phone number');
  }
  return true;
};

// Password strength validator
export const isStrongPassword: CustomValidator = (password: string) => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    throw new Error('Password must contain at least 8 characters including uppercase, lowercase, number and special character');
  }
  return true;
};