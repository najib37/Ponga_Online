import { Injectable } from '@nestjs/common';
import {
  dataOperation,
  getRoomMessages,
  operationRoom,
  RoomInfos,
  RoomMessage,
  searchForGroup,
} from './dto/create-room-chat.dto';
import { RoomChat, UserRoom } from "./entities/room-chat.entity";
import { PrismaClient, RoomType, RoomUserState } from "@prisma/client";
import * as argon2 from "argon2";
import { RoomUsers } from "./dto/RoomUserDto";
import { CheckMember, Room } from "./dto/RoomDtos";
import { unReadedMsgs, UsersToSendEvent } from "./entities/UsersUnreadedMsgs";
import { MessagesDto } from "./dto/MessagesDto";
import { RoomListDto } from "./dto/RoomListDto";
import { GroupSearchList, GroupSearchListChild } from "./dto/GroupListSearchDto";
import { roomUsersAndAdmins } from "./entities/roomUsersAndAdmins";
import { GroupMember, GroupMemberRoomUsers } from "./dto/GroupMember";
import { RoomData, RoomDataAdmins, RoomDataRoomUsers } from "./dto/RoomData";
import { roomMessageDto } from "./dto/roomMessageDto";
import { GroupResponse } from "./dto/JoinChannelDto";
import { JoinChannelDto } from "./entities/JoinChannelDto";
import { PrismaService } from "../../prisma/prisma.service";


@Injectable()
export class RoomChatService {

  constructor(
    private readonly prisma: PrismaService,
  ) {
  }



  async createChannel(userId: string, ChannelInfos: RoomChat): Promise<Room> {

    let password: string | null = null

    if (ChannelInfos.type === RoomType.PROTECTEDROOM) {
      password = await argon2.hash(ChannelInfos.password);
    }

    return this.prisma.room.create({
      data: {
        name: ChannelInfos.name,
        type: ChannelInfos.type,

        admins: {
          connect: { id: userId }
        },
        roomOwner: userId,
        password: password,

      },
      select: {
        id: true,
        name: true,
        roomOwner: true,
        type: true
      }
    });

  }


  async addAdminsToRoom(sender: string, data: dataOperation): Promise<string> {
    const role: RoomData = await this.channelRole(data.roomId);

    if ((role.RoomUsers.filter(admin => admin.userId === sender)).length) {
      return "You cannot Add admins to this room"
    }


    await this.prisma.roomUsers.deleteMany({
      where: {
        roomId: data.roomId,
        userId: data.userId
      }
    })

    await this.prisma.room.update({
      where: { id: data.roomId },
      data: {
        admins: {
          connect: {
            id: data.userId
          }
        }
      }
    })

    return "Operation Done"

  }

  async createRoomMessage(userId: string, RoomMessage: RoomMessage): Promise<string | roomMessageDto> {


    const check: CheckMember = await this.checkIsMember(userId, RoomMessage.roomId)



    if (check.UserStatus === 'BANNED' || check.UserStatus === 'Not Member' || check.UserStatus === 'MUTED') {
      return 'You cant Write Message to This Room'
    }


    return this.prisma.roomsMessages.create({
      data: {
        content: RoomMessage.content,
        senderId: userId,
        roomId: RoomMessage.roomId,
        createdAt: RoomMessage.createdAt,
      },
      include: {
        roomUserId: {
          select: {
            name: true
          }
        },
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });
  }

  async addUsers(userToAdd: string, RoomData: JoinChannelDto): Promise<GroupResponse | string> {

    const roomData = await this.prisma.room.findUnique({
      where: {
        id: RoomData.roomId
      },
      select: {
        type: true,
        password: true,
        admins: true,
        RoomUsers: {
          select: {
            userId: true
          }
        }
      }
    })

    if (!roomData ||
      !roomData.RoomUsers.filter(room => room.userId === userToAdd) ||
      !roomData.admins.filter(room => room.id === userToAdd)
    ) {
      return "You cannot Join this Channel"
    }

    if (roomData.type === RoomType.PROTECTEDROOM) {
      const result: boolean = await argon2.verify(roomData.password, RoomData.password)
      if (!result) {
        return "Wrong Password"
      }
    }





    const user: GroupMemberRoomUsers = await this.prisma.roomUsers.create({
      data: {
        roomId: RoomData.roomId,
        userId: userToAdd
      }
    });

    if (!user) {
      return "You cannot Join this Channel"
    }


    return this.prisma.room.findUnique({
      where: {
        id: RoomData.roomId
      },
      include: {
        _count: {
          select: {
            RoomsMessages: {
              where: {
                ReadedMessage: {
                  none: {
                    id: userToAdd
                  }
                }
              }
            }
          }
        },
        RoomsMessages: {
          select: {
            content: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });
  }

  async kickUsers(data: dataOperation, sender?: string): Promise<string> {
    const role: RoomData = await this.channelRole(data.roomId);

    if ((role.RoomUsers.filter(admin => admin.userId === sender)).length) {
      return "You cannot kick users"
    }

    await this.prisma.roomUsers.deleteMany({
      where: {
        roomId: data.roomId,
        userId: data.userId,
      },
    })

    return 'Operation Done'
  }

  async Mute_Unmute_User(data: operationRoom, sender?: string): Promise<string> {

    const role: RoomData = await this.channelRole(data.roomId);
    if ((role.RoomUsers.filter(admin => admin.userId === sender)).length) {
      return "You cannot mute users"
    }

    let currentDate: Date = new Date()

    switch (data.muteDuration) {
      case '5min':
        currentDate.setMinutes(currentDate.getMinutes() + 5)
        break;
      case '1hour':
        currentDate.setHours(currentDate.getHours() + 1)
        break;
      case 'day':
        currentDate.setHours(currentDate.getHours() + 24)
        break;
      case 'week':
        currentDate.setHours(currentDate.getHours() + 168)
        break;
      default:
        currentDate = null
    }


    await this.prisma.roomUsers.update({
      data: {
        state: data.state,
        muteDuration: currentDate
      }, where: {
        userId_roomId: {
          userId: data.userId,
          roomId: data.roomId
        }
      }
    })

    return "Operation Done"
  }

  async getRoomUsers(roomId: string) {
    return this.prisma.room.findUnique({
      where: {
        id: roomId
      },
      select: {
        admins: {
          select: {
            id: true
          }
        },
        RoomUsers: {
          where: {
            roomId: roomId,
            state: {
              not: 'BANNED'
            }
          },
          select: {
            userId: true
          }
        }
      }
    }
    )
  }


  async usersAndAdminsRoom(roomId: string): Promise<GroupMember> {
    return this.prisma.room.findUnique({
      where: {
        id: roomId
      },
      include: {
        admins: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        RoomUsers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            room: {
              include: {
                RoomUsers: {
                  select: {
                    state: true
                  }
                }
              }
            },
          }
        }
      },

    }
    )
  }


  async roomsList(userId: string, userRoom: UserRoom): Promise<RoomListDto> {


    const to_skip: number = (userRoom.page - 1) * userRoom.to_take


    let groups: RoomListDto = await this.prisma.room.findMany({
      where: {
        OR: [
          {
            RoomUsers: {
              some: {
                userId: userId,
                state: {
                  not: 'BANNED'
                }
              }
            }
          },
          {
            admins: {
              some: { id: userId }
            }
          }
        ],
        AND: {
          name: {
            contains: userRoom.filter,
            mode: "insensitive"
          }
        }
      },
      include: {
        RoomsMessages: {
          select: {
            content: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        },
        _count: {
          select: {
            RoomsMessages: {
              where: {
                AND: [
                  {
                    sender: {
                      NOT: {
                        id: userId
                      }
                    }
                  },
                  {
                    ReadedMessage: {
                      none: {
                        id: userId
                      }
                    }
                  }

                ]
              }
            }
          }
        },
      },

      skip: to_skip,
      take: userRoom.to_take
    });

    groups = groups.sort((a, b) => {

      if (!b.RoomsMessages[0]?.createdAt) {
        return -1
      }

      if (a.RoomsMessages[0]?.createdAt > b.RoomsMessages[0]?.createdAt) return -1;
      else return 0;
    })

    return groups


  }


  async roomsSearchList(userId: string, searchRoom: searchForGroup): Promise<GroupSearchList> {

    const to_skip: number = (searchRoom.page - 1) * searchRoom.to_take

    return this.prisma.room.findMany({
      where: {
        AND: [
          {
            RoomUsers: {
              none: { userId: userId }
            }
          },
          {
            admins: {
              none: { id: userId }
            }
          },
          {
            name: {
              contains: searchRoom.filter,
              mode: "insensitive"
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        roomOwner: true,
        type: true,
      },
      skip: to_skip,
      take: searchRoom.to_take
    });


  }


  async allRoomMessages(userId: string, Room: getRoomMessages): Promise<MessagesDto> {

    const check: CheckMember = await this.checkIsMember(userId, Room.roomId)
    if (check.UserStatus === 'BANNED'
      || !check.RoomType
      || (check.UserStatus === 'Not Member' && check.RoomType !== 'PUBLICROOM')) {
      return []
    }

    const to_skip: number = (Room.page - 1) * Room.to_take


    return this.prisma.roomsMessages.findMany({
      where: {
        roomId: Room.roomId
      },
      orderBy: {
        createdAt: 'desc'
      }
      ,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        ReadedMessage: {
          where: {
            id: {
              not: userId
            }
          },
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      skip: to_skip,
      take: Room.to_take
    })

  }

  async checKMutedUsers(): Promise<RoomUsers> {
    return this.prisma.roomUsers.findMany({
      where: {
        state: 'MUTED'
      }
    });
  }


  async checkIsMember(userId: string, roomId: string): Promise<CheckMember> {

    const room: roomUsersAndAdmins = await this.prisma.room.findUnique({
      where: {
        id: roomId
      },
      select: {
        type: true,
        RoomUsers: {
          select: {
            userId: true,
            state: true
          }
        },
        admins: {
          select: {
            id: true
          }
        }
      }
    })

    if (!room) {
      return null
    }

    let role: string = "Not Member";

    if (room?.admins.filter(admin => admin.id === userId).length) {
      role = 'Admin'
    } else if (room?.RoomUsers.filter(user => user.userId === userId).length) {
      const index: number = room.RoomUsers.findIndex(user => user.userId === userId)
      if (index != -1)
        role = room["RoomUsers"][index]?.state
    }

    return {
      UserStatus: role,
      RoomType: room?.type
    };
  }

  async leaveChannel(userId: string, roomId: string): Promise<number> {

    const room: RoomData = await this.channelRole(roomId)


    if (userId === room.roomOwner) {
      await this.prisma.room.update({
        where: {
          id: roomId
        },
        data: {
          owner: {
            disconnect: {
              id: userId
            }
          },
          admins: {
            disconnect: {
              id: userId
            }
          }
        }
      })
    } else if (room.admins.filter((user: RoomDataAdmins): boolean => user.id === userId).length) {
      await this.prisma.room.update({
        where: {
          id: roomId
        },
        data: {
          admins: {
            disconnect: {
              id: userId
            }
          }
        }
      });
    } else if (room.RoomUsers.filter((user: RoomDataRoomUsers): boolean => user.userId === userId).length) {

      await this.prisma.roomUsers.deleteMany({
        where: {
          userId: userId,
          roomId: roomId
        }
      })
    }

    const num: number = await this.numOfMembers(roomId).then(
      (value: { adminCount: number, roomUserCount: number }) => {
        return value.adminCount + value.roomUserCount
      }
    )

    if (num === 0) {
      await this.prisma.room.delete({
        where: {
          id: roomId
        },
        select: {
          id: true
        }
      })
    }

    return num;
  }


  async numOfMembers(roomId: string): Promise<{ adminCount: number, roomUserCount: number }> {
    const room: RoomData = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        admins: true,
        RoomUsers: true
      },
    });

    const adminCount: number = room.admins.length;
    const roomUserCount: number = room.RoomUsers.length;

    return { adminCount, roomUserCount };
  }

  async channelRole(channelId: string): Promise<RoomData> {

    return this.prisma.room.findUnique({
      where: {
        id: channelId
      },
      select: {
        roomOwner: true,
        admins: {
          select: {
            id: true
          }
        },
        RoomUsers: {
          select: {
            userId: true
          }
        },
      }
    })
  }

  async deleteChannel(userId: string, roomId: string): Promise<string | RoomData> {

    const owner: RoomData = await this.channelRole(roomId)


    if (owner?.roomOwner === userId) {
      return this.prisma.room.delete({
        where: {
          id: roomId
        },
        select: {
          id: true,
          RoomUsers: {
            select: {
              userId: true
            }
          },
          admins: {
            select: {
              id: true
            }
          }
        }
      })
    }

    return "Only the channel owner can delete the room"


  }

  async UpdateChannelInfos(sender: string, infos: RoomInfos): Promise<GroupSearchListChild | string> {

    const role: RoomData = await this.channelRole(infos.roomId);
    if (role?.roomOwner !== sender) {
      return "You cannot Update the channel"
    }


    let password: string | null = null;

    if (infos.type === 'PROTECTEDROOM') {
      password = await argon2.hash(infos.Password)
    }


    return this.prisma.room.update({
      where: {
        id: infos.roomId
      },
      data: {
        name: infos.name,
        type: infos.type,
        password: password
      },
      select: {
        id: true,
        name: true,
        roomOwner: true,
        type: true
      }
    });

  }

  async Ban_UnBann_User(data: operationRoom, sender?: string): Promise<string> {

    const role: RoomData = await this.channelRole(data.roomId);
    if ((role.RoomUsers.filter(admin => admin.userId === sender)).length) {
      return "You cannot Ban users"
    }


    await this.prisma.roomUsers.update({
      data: {
        state: data.state,
        muteDuration: null
      }, where: {
        userId_roomId: {
          userId: data.userId,
          roomId: data.roomId
        }
      },
    })

    this.prisma.room.findUnique({
      where: {
        id: data.roomId
      },
      select: {
        id: true,
        name: true,
        roomOwner: true,
        type: true
      }
    })

    return "Operation Done"


  }

  async senderGroupToEmit(userID: string, roomId: string): Promise<UsersToSendEvent> {
    return this.prisma.roomsMessages.findMany({
      where: {
        AND: [
          { roomId: roomId },
          {
            sender: {
              NOT: {
                id: userID
              }
            }
          },
          {
            ReadedMessage: {
              none: {
                id: userID
              }
            }
          }

        ]
      },
      select: {
        senderId: true
      },
      distinct: ['senderId']
    })
  }

  async readRoomMessage(userID: string, roomId: string): Promise<Promise<unReadedMsgs>[]> {

    const messages: { id: string }[] = await this.prisma.roomsMessages.findMany({
      where: {
        AND: [
          { roomId: roomId },
          {
            sender: {
              NOT: {
                id: userID
              }
            }
          },
          {
            ReadedMessage: {
              none: {
                id: userID
              }
            }
          }

        ]
      },
      select: {
        id: true,
      }
    })

    return messages.map(async (msg: { id: string }): Promise<unReadedMsgs> => {


      return this.prisma.roomsMessages.update({
        where: {
          id: msg.id
        },
        data: {
          ReadedMessage: {
            connect: {
              id: userID
            },
          }
        },
        select: {
          id: true,
          senderId: true,
        }
      })
    })


  }
}
