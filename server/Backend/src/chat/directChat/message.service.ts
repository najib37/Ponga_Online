import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {Conversation, CreateMessageDto, getConversations} from './dto/create-message.dto';
import {Prisma, PrismaClient} from '@prisma/client';
import {createMessageDto} from "./dto/createMessageDto";
import {ChatListDtoPerson, IChatList} from "./dto/ChatListDto";
import {MessagesDto} from "./dto/MessagesDto";
import {DefaultArgs} from "@prisma/client/runtime/library";
import {BlockService} from "../../block/block.service";
import {PrismaService} from "../../prisma/prisma.service";
import {ProfileService} from "../../profile/profile.service";
import {FriendsService} from "../../friends/friends.service";
import {Profile} from "../../profile/entities/Profile";

@Injectable()
export class MessageService {
    constructor(
        private readonly blockService: BlockService,
        private readonly prisma: PrismaService,
        private readonly profileService: ProfileService,
    ) {
    }

    async create(sender: string, createMessageDto: CreateMessageDto)
        : Promise<createMessageDto | undefined> {

        const isBlocked : boolean = await this.blockService.isBlocked(sender, createMessageDto.receiverId)

        if (isBlocked) {
            return undefined
        }

        return this.prisma.message.create({
            data: {
                content: createMessageDto.content,
                senderId: sender,
                receiverId: createMessageDto.receiverId,
                createdAt: createMessageDto.createdAt
            },
            include: {
                sender: {select: {id: true, name: true, avatar: true}},
                receiver: {select: {id: true, name: true, avatar: true}},
            },
        });

    }

    async findAllDmMessages(userId: string, data: Conversation): Promise<MessagesDto> {


        const skip: number = (data.pageNumber - 1) * data.take

        const isBlocked : boolean = await this.blockService.isBlocked(userId, data.otherUserId)


        return this.prisma.message.findMany({
            where: {
                OR: [
                    {senderId: userId, receiverId: data.otherUserId},
                    !isBlocked ? {senderId: data.otherUserId, receiverId: userId} : {},
                ],
            },
            include: {
                sender: {select: {id: true, name: true, avatar: true}},
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip : skip,
            take : data.take

        });
    }


    async unReadedMessage(sender: string, receiver: string): Promise<number> {

        return this.prisma.message.count({
            where: {
                AND: {
                    senderId: sender,
                    receiverId: receiver,
                    readed: false
                }
            }
        });

    }


    async allPrivateConversations(userid: string, data: getConversations): Promise<IChatList> {

        const to_skip: number = (data.page - 1) * data.to_take

        let persons: ChatListDtoPerson[];
        let conversations: IChatList | undefined;

        persons = await this.prisma.user.findMany({
            where: {
                OR: [
                    {
                        sentMessages: {
                            some: {
                                receiverId: userid,
                            },
                        },
                    },
                    {
                        receivedMessages: {
                            some: {
                                senderId: userid,
                            },
                        },
                    },
                ],
                AND: {
                    name: {
                        contains: data.filter,
                        mode: "insensitive"
                    }
                }
            },
            select: {
                id: true,
                name : true,
                avatar : true
            },
            distinct: ['id'],
            skip: to_skip,
            take: data.to_take
        });

        conversations = await Promise.all(persons.map(async (person) => {
            const unReadedMessage = await this.prisma.message.count({
                where: {
                    AND: {
                        senderId: person.id,
                        receiverId: userid,
                        readed: false
                    }
                }
            })
            const lastMessage = await this.prisma.message.findFirst({
                where: {
                    OR: [
                        {senderId: userid, receiverId: person.id},
                        {senderId: person.id, receiverId: userid}
                    ]
                }, orderBy: {
                    createdAt: 'desc'
                }
            })
            return {
                person,
                lastMessage,
                unReadedMessage
            }
        }))

        return conversations.sort((a, b) => {
            if (a.lastMessage.createdAt > b.lastMessage.createdAt) return -1
            else return 0
        })

    }

    async getUser(userId: string, data: Conversation) : Promise<Omit<Profile, "friends">> {
        return this.profileService.getProfileById(userId, data.otherUserId)
    }

    async Block_DeblockUser(userId: string, otherUserId : string) : Promise<string> {

        const isBlocker : boolean  = await this.blockService.isBlocked(userId, otherUserId)

        if (isBlocker) {
            await this.blockService.unblockUser(userId, otherUserId)
            return ("You unBlock")
        }

        await this.blockService.blockUser(userId, otherUserId)
        return ("You Block")
    }

    async ReadMessages(userId: string, otherUser: string) : Promise<void> {

        await this.prisma.message.updateMany({
            where: {
                AND: {
                    senderId: otherUser,
                    receiverId: userId,
                    readed: false
                },
            },
            data: {
                readed: true
            }
        })

    }
}
