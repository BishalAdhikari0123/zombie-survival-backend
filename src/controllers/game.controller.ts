import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { gameService } from '../services/game.service';

export class GameController {
  async createSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { score, waveReached, duration } = req.body;

      const session = await gameService.createGameSession({
        userId: req.userId,
        score,
        waveReached,
        duration
      });

      res.status(201).json({
        message: 'Game session saved successfully',
        session: {
          id: session.id,
          score: session.score,
          waveReached: session.waveReached,
          duration: session.duration,
          createdAt: session.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getLeaderboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const maxLimit = Math.min(limit, 100); // Cap at 100

      const leaderboard = await gameService.getLeaderboard(maxLimit);

      res.status(200).json({
        leaderboard
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const limit = parseInt(req.query.limit as string) || 20;
      const maxLimit = Math.min(limit, 50); // Cap at 50

      const history = await gameService.getUserGameHistory(req.userId, maxLimit);
      const stats = await gameService.getUserStats(req.userId);

      res.status(200).json({
        stats,
        history
      });
    } catch (error) {
      next(error);
    }
  }
}

export const gameController = new GameController();
