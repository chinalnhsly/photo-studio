import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { POINTS_PER_PURCHASE, LEVEL_THRESHOLDS } from '../common/constants';

@Injectable()
export class PointsService {
  constructor(private prisma: PrismaService) {}

  async addPointsForPurchase(userId: number, amount: number) {
    const pointsToAdd = Math.floor(amount * POINTS_PER_PURCHASE);
    
    const memberPoints = await this.prisma.membershipPoints.upsert({
      where: { userId },
      update: {
        points: { increment: pointsToAdd }
      },
      create: {
        userId,
        points: pointsToAdd
      }
    });

    // Update member level
    const newLevel = this.calculateLevel(memberPoints.points);
    if (newLevel !== memberPoints.level) {
      await this.prisma.membershipPoints.update({
        where: { userId },
        data: { level: newLevel }
      });
    }

    return memberPoints;
  }

  private calculateLevel(points: number): number {
    const levels = Object.entries(LEVEL_THRESHOLDS)
      .sort(([, a], [, b]) => b - a);
    
    for (const [level, threshold] of levels) {
      if (points >= threshold) {
        return parseInt(level);
      }
    }
    return 1;
  }
}
