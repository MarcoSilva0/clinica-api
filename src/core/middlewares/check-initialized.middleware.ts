import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheckInitializedMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const config = await this.prisma.systemConfig.findUnique({
      where: { id: 1 },
    });

    const initialized = config?.initialized ?? false;

    const publicRoutes = ['/setup', '/setup/status'];
    if (publicRoutes.includes(req.baseUrl)) {
      return next();
    }

    if (!initialized) {
      return res.status(403).json({
        message: 'System not initialized.',
      });
    }

    next();
  }
}
