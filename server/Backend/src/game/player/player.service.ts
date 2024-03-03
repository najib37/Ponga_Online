import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Achievment, PlayerSelectType, PlayerType } from './types/playerType';
import { AchievementsService } from '../achievements/achievements.service';
import { PlayerStatsType } from './types/PlayerStatsType';
import { SelectUser } from 'src/user/entities/user-allowed-fields.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PlayerService {

  playerSelect = new PlayerSelectType()

  private selectUser: SelectUser = new SelectUser

  constructor(
    private readonly prisma: PrismaService,
    private readonly achievementService: AchievementsService,
  ) {
  }

  create(createPlayerDto: CreatePlayerDto): Promise<PlayerType> {
    return this.prisma.player.create({
      data: createPlayerDto
    })
  }

  findAll(player?: PlayerSelectType): Promise<PlayerType[]> {
    return this.prisma.player.findMany({
      select: {
        ...this.playerSelect,
        ...player,
        user: {
          select: {
            username: true
          }
        }
      }
    });
  }

  findPlayerById(playerId: string, player?: PlayerSelectType): Promise<PlayerType> {
    return this.prisma.player.findUnique({
      where: {
        userId: playerId
      },
      select: {
        ...this.playerSelect,
        ...player
      }
    });
  }

  update(
    playerId: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<PlayerType> {
    return this.prisma.player.update({
      where: {
        userId: playerId,
      },
      data: updatePlayerDto,
    });
  }

  async upsert(
    playerId: string,
    player: Omit<PlayerType, "userId"> // INFO: lodash
  ): Promise<PlayerType> {

	if (!player)
		return ;
	
    const dbPlayer = await this.prisma.player.upsert({
      where: {
        userId: playerId,
      },
      update: {
        level: {
          increment: (player.xp / 122) || 0
        },
        xp: {
          increment: player.xp || 0,
        },
      },
      create: {
        userId: playerId,
        xp: player.xp || 0,
        level: player.level || 0
      },
      select: {
        user: true,
        userId: true,
        level: true,
        xp: true,
      }
    });

    this.achievementService.upserMany(player?.achievments, dbPlayer.userId);
    return dbPlayer;
  }

  remove(playerId: string): Promise<PlayerType> {
    // INFO: delete played games in the database
    return this.prisma.player.delete({
      where: { userId: playerId }
    });
  }
  serelize(player: any): PlayerType {

    const rawAchs: string[] = [...player.achievement];
    const achs = rawAchs.map((ach): Achievment => {
      return { type: ach }
    })

    return {
      userId: player.PlayerId,
      xp: player.Xp || 0,
      achievments: achs
    }
  }

  async getPlayerAchievements(playerId: string): Promise<Achievment[]> {
    const player = await this.prisma.player.findUnique({
      where: {
        userId: playerId
      },
      select: {
        achievments: true
      },
    })
    if (!player)
      return [];
    return player.achievments
  }


  async getPalyerStats(playerId: string): Promise<PlayerStatsType> {
    const [player, stats] = await Promise.all([
      this.prisma.player.findUnique({
        where: { userId: playerId },
        select: { level: true, xp: true }
      }),
      this.prisma.player.findUnique({
        where: { userId: playerId },
        include: {
          _count: { select: { wonGames: true, lostGames: true } }
        }
      })])

    const totalGames = stats?._count.wonGames + stats?._count.lostGames || 0;

    return {
      xp: player?.xp || 0,
      level: player?.level || 0,
      wonGames: stats?._count.wonGames || 0,
      lostGames: stats?._count.lostGames || 0,
      totalGames: totalGames,
      winPercentage: totalGames && stats?._count.wonGames * 100 / totalGames,
    }
  }

  getPlayersLeaderBoard(): Promise<{ user: User }[]> {
    return this.prisma.player.findMany({
      select: {
        userId: true,
        ...this.playerSelect,
        user: {
          select: {
            ...this.selectUser
          }
        },
      },
      orderBy: {
        level: 'desc',
      },
      take: 20
    })
  }
}
