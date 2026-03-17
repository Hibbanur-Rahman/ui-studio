import { body, param } from 'express-validator';

// Create activity validation
export const createActivityValidation = [
  body('activityType')
    .notEmpty()
    .withMessage('Activity type is required')
    .isString()
    .withMessage('Activity type must be a string'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .isLength({ min: 3, max: 500 })
    .withMessage('Description must be between 3 and 500 characters')
];

// Update activity validation
export const updateActivityValidation = [
  param('activityId')
    .notEmpty()
    .withMessage('Activity ID is required')
    .isMongoId()
    .withMessage('Invalid activity ID'),
  
  body('activityType')
    .optional()
    .isString()
    .withMessage('Activity type must be a string'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ min: 3, max: 500 })
    .withMessage('Description must be between 3 and 500 characters')
];

// Activity ID validation
export const activityIdValidation = [
  param('activityId')
    .notEmpty()
    .withMessage('Activity ID is required')
    .isMongoId()
    .withMessage('Invalid activity ID')
];
