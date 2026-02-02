import { Router } from 'express';
import type { Router as IRouter } from 'express';
import { body } from 'express-validator';
import { gameController } from '../controllers/game.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';

const router: IRouter = Router();

// All game routes require authentication
router.use(authMiddleware);

// POST /game/session
router.post(
  '/session',
  [
    body('score')
      .isInt({ min: 0, max: 1000000 })
      .withMessage('Score must be between 0 and 1,000,000'),
    body('waveReached')
      .isInt({ min: 0, max: 1000 })
      .withMessage('Wave must be between 0 and 1,000'),
    body('duration')
      .isInt({ min: 0, max: 86400 })
      .withMessage('Duration must be between 0 and 86,400 seconds (24 hours)')
  ],
  validateRequest,
  gameController.createSession.bind(gameController)
);

// GET /game/leaderboard
router.get(
  '/leaderboard',
  gameController.getLeaderboard.bind(gameController)
);

// GET /game/history
router.get(
  '/history',
  gameController.getUserHistory.bind(gameController)
);

export default router;
