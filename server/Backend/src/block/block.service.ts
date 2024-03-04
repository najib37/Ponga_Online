import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { FriendsService } from 'src/friends/friends.service';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { FormatedQueryType, PaginationQueryType } from 'src/user/dto/query-validation.dto';
import { SelectUser } from 'src/user/entities/user-allowed-fields.entity';
import { User } from 'src/user/entities/user.entity';
import { BlockStateType } from './types/BlockStateType';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class BlockService {

  private selectUser: SelectUser = new SelectUser

  constructor(
    @Inject(forwardRef(() => FriendsService)) // to avoid circular dependencies issues
    private readonly friendsService: FriendsService,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) { }

  async blockUser(userId: string, blockedId: string) {

    await Promise.all([
      this.friendsService.deleteFriend(userId, blockedId),
      this.friendsService.deleteFriend(blockedId, userId),
      this.notificationService.removeRequest(blockedId, userId),
      this.notificationService.removeRequest(userId, blockedId),
    ]);
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        blocklist: {
          connect: {
            id: blockedId
          }
        }
      },
      select: {
        ...this.selectUser
      }
    })
  }

  async isBlocked(userId: string, isBlockedId: string): Promise<boolean> {

    const user: User = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            id: userId,
            blocklist: {
              some: {
                id: isBlockedId,
              }
            },
          },
          {
            id: userId,
            blockedBy: {
              some: {
                id: isBlockedId,
              }
            },
          }
        ]
      },
      select: {
        blocklist: {
          select: {
            id: true,
          }
        },
        blockedBy: {
          select: {
            id: true,
          }
        },
      }
    })

    if (user?.blocklist.length || user?.blockedBy.length)
      return true
    return false;
  }

  async unblockUser(userId: string, friendId: string) {

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        blocklist: {
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

  async getBlockState(userId: string, isBlockedId: string): Promise<BlockStateType> {
    const user: User = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            id: userId,
            blocklist: {
              some: {
                id: isBlockedId,
              }
            },
          },
          {
            id: userId,
            blockedBy: {
              some: {
                id: isBlockedId,
              }
            },
          }
        ]
      },
      select: {
        blocklist: {
          select: {
            id: true,
          }
        },
        blockedBy: {
          select: {
            id: true,
          }
        },
      }
    })

    if (user?.blocklist.length)
      return { isBlocked: true, blockedBy: false }
    else if (user?.blockedBy.length)
      return { isBlocked: false, blockedBy: true}

    return {isBlocked: false, blockedBy: false}
  }

  async getBlockList(
    userId: string,
    // paginationQueries: PaginationQueryType
  ): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        blocklist: {
          select: {
            id: true
          },
        },
        blockedBy: {
          select: {
            id: true
          }
        }
      },
    })
    const block: string[] = [
      ...user?.blocklist.map(blocked => blocked.id),
      ...user?.blockedBy.map(blocked => blocked.id),
    ];

    return block;
    // return block.map(friend => {
    //   this.notification.isOnline(friend.id) ? friend.status = 'online' : friend.status = 'offline';
    //   return friend;
    // });
  }
}

