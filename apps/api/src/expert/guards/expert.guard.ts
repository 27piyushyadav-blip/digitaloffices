import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Expert Guard
 *
 * Validates that the authenticated user has EXPERT role and is not blocked.
 */
@Injectable()
export class ExpertGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;

    if (!userId) {
      return false;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || (user as any).role !== 'EXPERT' || (user as any).isBlocked) {
      return false;
    }

    return true;
  }
}
