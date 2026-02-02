import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

interface CreateSessionData {
  userId: string;
  score: number;
  waveReached: number;
  duration: number;
}

export class GameService {
  async createGameSession(data: CreateSessionData) {
    const { userId, score, waveReached, duration } = data;

    // Validate score - prevent impossible values
    if (score < 0 || score > 1000000) {
      throw new AppError('Invalid score value', 400);
    }

    if (waveReached < 0 || waveReached > 1000) {
      throw new AppError('Invalid wave value', 400);
    }

    if (duration < 0 || duration > 86400) { // Max 24 hours
      throw new AppError('Invalid duration value', 400);
    }

    // Basic anti-cheat: score should correlate with wave
    // Typical scoring: wave * 100 points base
    const expectedMinScore = waveReached * 50;
    const expectedMaxScore = waveReached * 500;

    if (score < expectedMinScore || score > expectedMaxScore) {
      throw new AppError('Score does not match wave progression', 400);
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Create game session
    const session = await prisma.gameSession.create({
      data: {
        userId,
        score,
        waveReached,
        duration
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    });

    return session;
  }

  async getLeaderboard(limit: number = 50) {
    const leaderboard = await prisma.gameSession.findMany({
      take: limit,
      orderBy: [
        { score: 'desc' },
        { createdAt: 'asc' } // Earlier high scores rank higher
      ],
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    });

    return leaderboard.map((session: any, index: number) => ({
      rank: index + 1,
      username: session.user.username,
      score: session.score,
      waveReached: session.waveReached,
      duration: session.duration,
      createdAt: session.createdAt
    }));
  }

  async getUserGameHistory(userId: string, limit: number = 20) {
    const history = await prisma.gameSession.findMany({
      where: { userId },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return history;
  }

  async getUserStats(userId: string) {
    const sessions = await prisma.gameSession.findMany({
      where: { userId },
      orderBy: {
        score: 'desc'
      }
    });

    if (sessions.length === 0) {
      return {
        totalGames: 0,
        highScore: 0,
        bestWave: 0,
        totalPlayTime: 0
      };
    }

    const totalPlayTime = sessions.reduce((sum: number, s: any) => sum + s.duration, 0);

    return {
      totalGames: sessions.length,
      highScore: sessions[0].score,
      bestWave: Math.max(...sessions.map((s: any) => s.waveReached)),
      totalPlayTime
    };
  }
}

export const gameService = new GameService();
