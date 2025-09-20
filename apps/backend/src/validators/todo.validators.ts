import { body, param, query } from 'express-validator';
import mongoose from 'mongoose';

export const createTodoValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .escape(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters')
    .escape(),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be one of: pending, in-progress, completed'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value: string) => {
      const date = new Date(value);
      const now = new Date();
      if (date < now) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),
];

export const updateTodoValidation = [
  param('id')
    .notEmpty()
    .withMessage('Todo ID is required')
    .custom((value: string) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid todo ID format');
      }
      return true;
    }),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .escape(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters')
    .escape(),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be one of: pending, in-progress, completed'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value: string) => {
      if (value) {
        const date = new Date(value);
        const now = new Date();
        if (date < now) {
          throw new Error('Due date cannot be in the past');
        }
      }
      return true;
    }),
];

export const deleteTodoValidation = [
  param('id')
    .notEmpty()
    .withMessage('Todo ID is required')
    .custom((value: string) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid todo ID format');
      }
      return true;
    }),
];

export const getTodoValidation = [
  param('id')
    .optional()
    .custom((value: string) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid todo ID format');
      }
      return true;
    }),
];

export const getTodosValidation = [
  query('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'all'])
    .withMessage('Status must be one of: pending, in-progress, completed, all'),

  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'dueDate', 'title', 'priority'])
    .withMessage('Sort by must be one of: createdAt, updatedAt, dueDate, title, priority'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc'),

  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be a number between 1 and 1000'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be a number between 1 and 100'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term cannot exceed 100 characters')
    .escape(),
];
