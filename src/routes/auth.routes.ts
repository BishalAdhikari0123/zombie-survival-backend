import { Router } from 'express';
import type { Router as IRouter } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation.middleware';

const router: IRouter = Router();

// POST /auth/register
router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Must be a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  validateRequest,
  authController.register.bind(authController)
);

// POST /auth/login
router.post(
  '/login',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Must be a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  validateRequest,
  authController.login.bind(authController)
);

export default router;
