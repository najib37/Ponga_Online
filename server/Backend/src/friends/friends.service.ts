import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BlockService } from 'src/block/block.service';
import { GameConnection } from 'src/game/gameConnection.service';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { FormatedQueryType, PaginationQueryType } from 'src/user/dto/query-validation.dto';
import { SelectUser } from 'src/user/entities/user-allowed-fields.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FriendsService {

  private selectUser: SelectUser = new SelectUser

  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationGateway,
    private readonly blockService: BlockService,
    private readonly gameConnection: GameConnection,
  ) { }

  async addFriend(userId: string, friendId: string) {


    // check if the user is blocked
    const isBlocked = await this.blockService.isBlocked(userId, friendId);
    if (isBlocked)
      return {}

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          connect: {
            id: friendId
          }
        }
      },
      select: {
        ...this.selectUser
      }
    })
  }

  async isFriends(userId: string, isFriendId: string): Promise<boolean> {

    const user: User[] = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            id: userId,
            friends: {
              some: {
                id: isFriendId,
              }
            },
          },
          {
            id: userId,
            friendOf: {
              some: {
                id: isFriendId
              }
            },
          }
        ]
      },
      select: {
        friends: {
          select: {
            id: true,
            name: true,
          }
        },
        friendOf: {
          select: {
            id: true,
            name: true,
          }
        },
      }
    })

    return (user[0]?.friends.length || user[0]?.friendOf.length) ? true : false;
  }

  async deleteFriend(userId: string, friendId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          disconnect: {
            id: friendId,
          }
        }
      },
      select: {
        ...this.selectUser
      }
    })
  }

  async getAllFriends(
    userId: string,
    paginationQueries?: PaginationQueryType
  ): Promise<User[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        friends: {
          select: {
            ...this.selectUser,
            email: false,
          },
        },
        friendOf: {
          select: {
            ...this.selectUser,
            email: false,
          }
        }
      },
    })
    const friends: User[] = [...user.friends, ...user.friendOf];

    return friends.map(friend => {
      this.notification.isOnline(friend.id) ? friend.status = 'online' : friend.status = 'offline';
      const room = this.gameConnection.GetRoomByUserId(friend.id);
      if (room && room.IsOnline(friend.id))
        friend.status = 'ingame'
      return friend;
    });
  }

  // async testat(userId: string, petantialfrndId: string): Promise<User[]> {
  //   const users = this.prisma.user.findMany({
  //     where: {
  //     },
  //     select: {
  //       ...this.selectUser
  //     },
  //     //...paginationQueries
  //   })
  //
  //   return users;
  // }
}

