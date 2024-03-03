import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Achievment } from '../player/types/playerType';

@Injectable()
export class AchievementsService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  upsert(type: string, playerId?: string): Promise<Achievment> {
    if (!type)
      return;

    return this.prisma.achievment.upsert({
      where: {
        type
      },
      create: {
        type,
        palyers: {
          connect: {
            userId: playerId
          }
        }
      },
      update: {
        palyers: {
          connect: {
            userId: playerId
          }
        }
      }
    })
  }

  remove(type: string): Promise<Achievment> {
    return this.prisma.achievment.delete({
      where: {
        type
      }
    })
  }

  async upserMany(achievments: Achievment[], playerId?: string): Promise<Achievment[]> {
    if (!achievments || achievments?.length === 0)
		return ;
	return await Promise.all(achievments.map(async ach => {
      return await this.upsert(ach.type, playerId)
    }))
  }
}
