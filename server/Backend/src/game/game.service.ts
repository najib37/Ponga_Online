import { Injectable, UseFilters } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createGameDto } from './dto/create-game.dto';
import { GameType } from './types/GameType';
import { PlayerType } from './player/types/playerType';
import _ from 'lodash'
import { PlayerService } from './player/player.service';
import { GameSelect } from './types/GameSelectType';

@Injectable()
export class GameService {

  SelectGameFilelds = new GameSelect();
  constructor(
    private readonly prisma: PrismaService,
    private readonly playerService: PlayerService,
  ) { }

  async create(game: createGameDto, winner?: PlayerType, loser?: PlayerType): Promise<GameType> {

    const [dbWinner, dbLoser] = await Promise.all([
      this.playerService.upsert(winner.userId, winner),
      this.playerService.upsert(loser.userId, loser),
    ]);
    return this.prisma.game.create({
      data: {
        ...game,
        winnerId: dbWinner?.userId,
        loserId: dbLoser?.userId,
      },
      select: { ...this.SelectGameFilelds },
    })
  }

  getGameById(gameId: string): Promise<Partial<GameType>> {
    return this.prisma.game.findUnique({
      where: {
        id: gameId
      }
    })
  }

  getAllGame(
    game?: Partial<Omit<GameType, "winner" | "loser">>
  ): Promise<GameType[]> {
    return this.prisma.game.findMany({
      where: {
        ...game
      },
      select: { ...this.SelectGameFilelds },
    })
  }

  getGamesByplayer(playerId: string) {
    return this.prisma.game.findMany({
      where: {
        OR: [
          {
            winnerId: playerId
          },
          {
            loserId: playerId
          }
        ]
      },
      select: {
        ...this.SelectGameFilelds,
        winner: {
          select: {
            user: {
              select: {
                username: true
              }
            }
          }
        },
        loser: {
          select: {
            user: {
              select: {
                username: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getPlayedGamesBetween(
    player1Id: string,
    player2Id: string,
    take?: number
  )/* : Promise<GameType[]> */ {
    // WARN: needs deep testing
    return this.prisma.game.findMany({
      where: {
        OR: [
          {
            winnerId: player1Id,
            loserId: player2Id,
          },
          {
            winnerId: player2Id,
            loserId: player1Id,
          },
        ],
      },
      select: {
        ...this.SelectGameFilelds,
        winner: {
          select: {
            user: {
              select: {
                username: true
              }
            }
          }
        },
        loser: {
          select: {
            user: {
              select: {
                username: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc',
      },
      take,
    });
  }

  serelize(rawData: any): Promise<GameType | null> {

    // INFO: serelize the players 
    const player1 = this.playerService.serelize(rawData?._player1);
    const player2 = this.playerService.serelize(rawData?._player2);

    // INFO: define the winner and the loser
    const winner = rawData?._player1.GameResult === 'WIN!' ? player1 : player2;
    const loser = rawData?._player1.GameResult === 'WIN!' ? player2 : player1;

    // INFO: serelize the game

    const game: GameType = {
      mode: rawData?.GameMode,
      rounds: rawData?.MaxRounds,
      winnerScore: rawData?._player1?.MatchScore >= rawData?._player2?.MatchScore
        ? rawData?._player1?.MatchScore : rawData?._player2?.MatchScore,
      loserScore: rawData?._player1?.MatchScore < rawData?._player2?.MatchScore
        ? rawData?._player1?.MatchScore : rawData?._player2?.MatchScore,
    }

    if (!winner || !loser || !game)
      return;
    return this.create(game, winner, loser);
  }

  remove(gameId: string): Promise<Partial<GameType>> {
    return this.prisma.game.delete({
      where: {
        id: gameId
      }
    })
  }
}
