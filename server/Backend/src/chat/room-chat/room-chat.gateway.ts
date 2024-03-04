import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import {RoomChatService} from './room-chat.service';
import {
    CreateRoomChatDto,
    dataOperation,
    emitToRoomUsers,
    getRoomMessages,
    operationRoom,
    RoomInfos,
    RoomMessage,
    searchForGroup,
} from './dto/create-room-chat.dto';
import {Server} from "socket.io";
import {Interval} from "@nestjs/schedule";
import {RoomUserState} from "@prisma/client";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {SocketAuthMiddleware} from "../../auth/socket-auth/socket-auth.middleware";
import {AuthSocket} from "../../notification/types/AuthSocket";
import {UserRoom} from "./entities/room-chat.entity";
import {RoomData, RoomDataAdmins, RoomDataRoomUsers} from "./dto/RoomData";
import {UseFilters, UsePipes, ValidationPipe} from "@nestjs/common";
import {AllExceptionsFilter} from "../filterWsException";
import {RoomUserDto, RoomUsers} from "./dto/RoomUserDto";
import {CheckMember, Room} from "./dto/RoomDtos";
import {unReadedMsgs, UsersToSendEvent} from "./entities/UsersUnreadedMsgs";
import {MessagesDto} from "./dto/MessagesDto";
import {RoomListDto} from "./dto/RoomListDto";
import {GroupSearchList, GroupSearchListChild} from "./dto/GroupListSearchDto";
import {GroupMember} from "./dto/GroupMember";
import {roomMessageDto} from "./dto/roomMessageDto";
import {GroupResponse} from "./dto/JoinChannelDto";
import {JoinChannelDto} from "./entities/JoinChannelDto";
import {UserService} from "../../user/user.service";
import {User} from "../../user/entities/user.entity";


@UseFilters(AllExceptionsFilter)
@UsePipes(ValidationPipe)
@WebSocketGateway({
    cors: {
        origin: true,
        credentials: true,
    },
    namespace: '/Rooms-Chat'
})
export class RoomChatGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    private socketAuthMiddleware;

    constructor(
        private readonly roomChatService: RoomChatService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
        private readonly userservice: UserService

    ) {
        this.socketAuthMiddleware = SocketAuthMiddleware(jwtService, config);
    }

    connectedSocket: Map<string, AuthSocket> = new Map<string, AuthSocket>();


    afterInit(client: AuthSocket) {
        this.server.use(this.socketAuthMiddleware);
    }

    @Interval(10000)
    async CheckMutedUser(): Promise<void> {
        const currentDate: Date = new Date()
        const users: RoomUsers = await this.roomChatService.checKMutedUsers();

        if (users.length > 0) {
            let toMuted: boolean = false

            console.log("enter to find one : ", currentDate)


            const Rooms: Promise<string>[] = users.map(async (user: RoomUserDto): Promise<string> => {

                if (currentDate > user.muteDuration) {
                    toMuted = true
                    console.log("jate sa3to ")

                    await this.roomChatService.Mute_Unmute_User({
                        userId: user.userId,
                        roomId: user.roomId,
                        state: RoomUserState.NORMAL,
                        muteDuration: null
                    })
                    return user.roomId
                }

            })
            if (toMuted) {
                console.log("Go to Frontend")
                const RoomsToEmit: string[] = await Promise.all(Rooms)
                RoomsToEmit.map((room: string): void => {

                    this.emitToRoomUsers({
                        roomId: room,
                        event: 'ListOperation',
                        data: room
                    })

                })
            }
        }

    }


    @SubscribeMessage('readRoomMessage')
    async readRoomMessage(client: AuthSocket, roomId: string): Promise<void> {

        const user : User = await this.userservice.findOne(client.user.sub, {
            id : true,
            name : true,
            avatar: true
        })

        const users: UsersToSendEvent = await this.roomChatService.senderGroupToEmit(client.user.sub, roomId)


        const messages: Promise<unReadedMsgs>[] = await this.roomChatService.readRoomMessage(client.user.sub, roomId)
        if (messages.length === 0) {
            return
        }

        let readedMsgs: unReadedMsgs[] = await Promise.all(messages)

        users.map((userTosend): void => {
            const socket: AuthSocket = this.connectedSocket.get(userTosend.senderId);
            if (socket) {
                const msgs: unReadedMsgs[] = readedMsgs.filter((msg: unReadedMsgs) => msg.senderId === userTosend.senderId)
                msgs.map(msg => {
                    msg.ReadedMessage = {
                        id : user.id,
                        name : user.name,
                        avatar : user.avatar
                    }
                })
                socket.emit('readedRoomMessageEvent', {msgs, roomId})
            }
        })
    }


    @SubscribeMessage('checkIsMember')
    async checkIsMember(client: AuthSocket, roomId: string): Promise<CheckMember> {
        const result : CheckMember = await this.roomChatService.checkIsMember(client.user.sub, roomId)

        if (!result) {
            client.emit("Error", 'Room Not Found')
            return
        }
        return result
    }


    @SubscribeMessage('createRoomChat')
    async create(client: AuthSocket, createRoomChatDto: CreateRoomChatDto): Promise<string> {

        const room: Room = await this.roomChatService.createChannel(client.user.sub, createRoomChatDto);

        if (room) {
            client.emit('NewChannel', room);
            return "Room Created Successfully"
        }
    }

    @SubscribeMessage('usersAndAdminsRoom')
    async usersAndAdminsRoom(@MessageBody() roomId: string): Promise<GroupMember> {
        return this.roomChatService.usersAndAdminsRoom(roomId);
    }

    @SubscribeMessage('addAdminToRoom')
    async addAdminsToRoom(client: AuthSocket, data: dataOperation): Promise<string> {

        const result: string = await this.roomChatService.addAdminsToRoom(client.user.sub, data);

        if (result === 'Operation Done') {
            await this.emitToRoomUsers({
                roomId: data.roomId,
                event: 'ListOperation',
                data: data.roomId
            });
        }

        return result
    }

    async emitToRoomUsers(arg: emitToRoomUsers, room?: RoomData, secondEvent?: string | undefined): Promise<void> {

        let roomUsers: RoomData



        if (room === undefined) {
            roomUsers = await this.roomChatService.getRoomUsers(arg.roomId)
        }
        else
            roomUsers = room

        roomUsers?.admins.map(async (admin: RoomDataAdmins): Promise<void> => {
            if (admin.id === arg.toExclude)
                return

            const socket: AuthSocket = this.connectedSocket.get(admin.id)
            if (socket) {
                console.log("Event : ", arg.event)
                console.log("admin : ", admin.id)

                socket.emit(arg.event, arg.data)
                if (secondEvent) {
                    socket.emit(secondEvent, arg.data)
                }
            }
        })

        roomUsers?.RoomUsers.map((user: RoomDataRoomUsers): Promise<void> => {
            if (user.userId === arg.toExclude)
                return

            const socket: AuthSocket = this.connectedSocket.get(user.userId)
            if (socket) {
                console.log("Event : ", arg.event)
                console.log("user : ", user.userId)


                socket.emit(arg.event, arg.data)
                if (secondEvent) {
                    socket.emit(secondEvent, arg.data)
                }
            }
        })
        console.log("*********************************************")


    }

    @SubscribeMessage('createRoomMessage')
    async createRoomMessage(client: AuthSocket, roomMessage: RoomMessage): Promise<string | roomMessageDto> {

        const message: string | roomMessageDto = await this.roomChatService.createRoomMessage(client.user.sub, roomMessage);

        console.log("Message : ", message)

        if (message === 'You cant Write Message to This Room') {
            client.emit('Error', 'You can not send message in this room')
            return
        }

        client.emit('listRoomMessage', message)

        await this.emitToRoomUsers({
                roomId: roomMessage.roomId,
                event: 'roomMessage',
                data: message,
                toExclude: client.user.sub,
            }, undefined,
            "newRoomMessageList"
        );

        return message

    }

    @SubscribeMessage('allRoomMessages')
    async allRoomMessages(client: AuthSocket, Room: getRoomMessages): Promise<MessagesDto> {
        return await this.roomChatService.allRoomMessages(client.user.sub, Room);
    }


    @SubscribeMessage('JoinRoom')
    async addUsers(@ConnectedSocket() client: AuthSocket, @MessageBody() RoomData : JoinChannelDto): Promise<string> {

        console.log("Password : ", RoomData.password)

        const room : string | GroupResponse = await this.roomChatService.addUsers(client.user.sub, RoomData);

        if (room === "You cannot Join this Channel" || room === "Wrong Password") {
            return room
        }


        await this.readRoomMessage(client, RoomData.roomId)


        client.emit('JoinedEvent', room);
        client.emit('JoinedEventListChannels', room)

        await this.emitToRoomUsers({
            roomId: RoomData.roomId,
            event: 'ListOperation',
            toExclude: client.user.sub,
            data: RoomData.roomId
        })


        return "Joined Channel successfully"

    }

    @SubscribeMessage('leaveChannel')
    async leaveChannel(client: AuthSocket, roomId: string): Promise<string> {


        const n: number = await this.roomChatService.leaveChannel(client.user.sub, roomId)


        if (n === 0) {
            client.emit('ChannelDeleted', roomId)
            client.emit('ChannelDeletedList', roomId)
        } else {
            client.emit('KickedFromRoom', roomId, n)
            client.emit("leaveChannelEventList", roomId)

            await this.emitToRoomUsers(
                {
                    roomId: roomId,
                    event: 'ListOperation',
                    toExclude: client.user.sub,
                    data: roomId
                }
            )
        }

        return "You leave Channel"
    }


    @SubscribeMessage('UpdateChannelInfos')
    async UpdateChannelInfos(client: AuthSocket, infos: RoomInfos): Promise<string> {

        const Updated: string | GroupSearchListChild = await this.roomChatService.UpdateChannelInfos(client.user.sub, infos)

        if (Updated !== 'You cannot Update the channel') {
            await this.emitToRoomUsers(
                {
                    roomId: infos.roomId,
                    event: "UpdateChannel",
                    data: Updated,
                },
                undefined,
                'UpdateChannelList'
            );

            return "Operation Done"
        }

        return Updated

    }


    @SubscribeMessage('DeleteChannel')
    async deleteChannel(client: AuthSocket, roomId: string): Promise<string> {
        const result: RoomData | string = await this.roomChatService.deleteChannel(client.user.sub, roomId)


        if (!(typeof result === 'string')) {
            await this.emitToRoomUsers(
                {
                    roomId: roomId,
                    event: 'ChannelDeleted',
                    data: roomId
                },
                result,
                "ChannelDeletedList"
            );

            return "Channel Deleted successfully";
        }
        return result
    }


    @SubscribeMessage('kickUser')
    async kickUsers(client: AuthSocket, data: dataOperation) {


        const result: string = await this.roomChatService.kickUsers(data, client.user.sub)

        if (result === 'Operation Done') {

            const socket = this.connectedSocket.get(data.userId);
            if (socket) {
                socket.emit('KickedFromRoom', data.roomId)
                socket.emit("leaveChannelEventList", data.roomId)
            }
            // this.server.emit('NewRoomOperation')

            await this.emitToRoomUsers({
                roomId: data.roomId,
                event: 'ListOperation',
                toExclude: data.userId,
                data: data.roomId
            });

        }

        return result
    }

    @SubscribeMessage('Mute_UnMute_User')
    async Mute_Unmute_User(client: AuthSocket, data: operationRoom): Promise<string> {
        const result: string = await this.roomChatService.Mute_Unmute_User(data, client.user.sub);

        console.log("Test : ", result)


        if (result === 'Operation Done') {
            await this.emitToRoomUsers({
                roomId: data.roomId,
                event: 'ListOperation',
                data: data.roomId
            });
        }

        return result

    }

    @SubscribeMessage('Ban_unBan_User')
    async BanUser(client: AuthSocket, data: operationRoom): Promise<string> {

        const result: string = await this.roomChatService.Ban_UnBann_User(data, client.user.sub)

        if (result === 'Operation Done') {

            if (data.state == 'BANNED') {
                const socket: AuthSocket = this.connectedSocket.get(data.userId)
                if (socket) {
                    socket.emit('BannedFromRoom', data.roomId)
                }
            }


            await this.emitToRoomUsers({
                roomId: data.roomId,
                event: 'ListOperation',
                data: data.roomId,
                toExclude: data.userId
            });

        }

        return result


    }


    @SubscribeMessage('AllUserRooms')
    async roomsList(client: AuthSocket, userRoom: UserRoom): Promise<RoomListDto> {
        return this.roomChatService.roomsList(client.user.sub, userRoom);
    }

    @SubscribeMessage('SearchForRoom')
    async roomsSearchList(client: AuthSocket, searchRoom: searchForGroup): Promise<GroupSearchList> {

        if (!searchRoom.filter.length) {
            return []
        }
        return this.roomChatService.roomsSearchList(client.user.sub, searchRoom)
    }


    handleConnection(client: AuthSocket) {
        if (client.user?.sub)
            this.connectedSocket.set(client.user.sub, client)
    }

    handleDisconnect(client: AuthSocket) {
        if (client.user?.sub)
            this.connectedSocket.delete(client.user.sub)
    }


}

