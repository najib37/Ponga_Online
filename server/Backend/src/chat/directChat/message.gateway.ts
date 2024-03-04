import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit, ConnectedSocket,
} from '@nestjs/websockets';
import {MessageService} from './message.service';
import {Conversation, CreateMessageDto, getConversations, Typing} from './dto/create-message.dto';
import {Server} from 'socket.io';
import {SocketAuthMiddleware} from 'src/auth/socket-auth/socket-auth.middleware';
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {AuthSocket} from "../../notification/types/AuthSocket";
import {UserService} from "../../user/user.service";
import {User} from "../../user/entities/user.entity";
import {UseFilters, UsePipes, ValidationPipe} from "@nestjs/common";
import {AllExceptionsFilter} from "../filterWsException";
import {createMessageDto} from "./dto/createMessageDto";
import {IChatList} from "./dto/ChatListDto";
import {MessagesDto} from "./dto/MessagesDto";
import {BlockService} from "../../block/block.service";
import {Profile} from "../../profile/entities/Profile";

@UseFilters(AllExceptionsFilter)
@UsePipes(ValidationPipe)
@WebSocketGateway({
    cors: {
        origin: true,
        credentials: true,
    },
    namespace: '/Direct-Chat'
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: Server;

    connectedSocket: Map<string, AuthSocket> = new Map<string, AuthSocket>();


    private readonly socketAuthMiddleware: any;

    constructor(
        private readonly messageService: MessageService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
        private readonly blockService: BlockService
    ) {
        this.socketAuthMiddleware = SocketAuthMiddleware(jwtService, config);

    }

    afterInit(): void {
        this.server.use(this.socketAuthMiddleware);
    }

    handleConnection(client: AuthSocket): void {
        this.connectedSocket.set(client?.user?.sub, client)
    }

    handleDisconnect(client: AuthSocket): void {
        this.connectedSocket.delete(client?.user?.sub)
    }


    @SubscribeMessage('userId')
    getUserid(client: AuthSocket): string {
        return client?.user?.sub
    }

    @SubscribeMessage('user')
    async getUser(client: AuthSocket, data: Conversation) : Promise<Omit<Profile, "friends">> {
        return this.messageService.getUser(client?.user?.sub, data);
    }

    @SubscribeMessage('ReadMessages')
    async ReadMessages(client: AuthSocket, otherUser: string): Promise<void> {


        await this.messageService.ReadMessages(client?.user?.sub, otherUser)

        // client.emit('ReadedMessageEvent', otherUser)
        const socket: AuthSocket = this.connectedSocket.get(otherUser)
        if (socket) {
            socket.emit('ReadedMessageEvent', client.user.sub)
        }
    }


    @SubscribeMessage('createMessage')
    async create(
        @ConnectedSocket() client: AuthSocket,
        @MessageBody() createMessageDto: CreateMessageDto
    ): Promise<createMessageDto> {

        const Message: createMessageDto = await this.messageService.create(client?.user?.sub, createMessageDto);

        if (Message === undefined) {
            client.emit('Error', 'You can not send message to this user')
            return
        }

        const num: number = await this.messageService.unReadedMessage(
            client?.user?.sub,
            Message.receiver.id
        );

        client.emit('addToList', Message)

        const socket: AuthSocket = this.connectedSocket.get(Message.receiver.id)

        if (socket) {

            socket.emit('message', Message, num)
            socket.emit('newMessage', Message, num)
        }

        return Message
    }

    @SubscribeMessage('findDmMessages')
    async findAllDmMessages(client: AuthSocket, data: Conversation): Promise<MessagesDto> {
        
    


        const user: User = await this.userService.findOne(data.otherUserId);
        if (!user || (client.user.sub === data.otherUserId))
            return undefined

        return this.messageService.findAllDmMessages(client?.user?.sub, data);
    }


    @SubscribeMessage('listAllPrivateConversations')
    listAllPrivateConversations(client: AuthSocket, data: getConversations): Promise<IChatList> {

        return this.messageService.allPrivateConversations(client?.user?.sub, data);
    }

    @SubscribeMessage('Block-Deblock-User')
    async Block_DeblockUser(client: AuthSocket, otherUserId: string): Promise<string> {

        const operation: string = await this.messageService.Block_DeblockUser(client?.user?.sub, otherUserId)

        const socket: AuthSocket = this.connectedSocket.get(otherUserId);
        if (socket) {

            const user : Omit<Profile, "friends"> =  await this.messageService.getUser(otherUserId, {otherUserId: client.user.sub})
            socket.emit("Block-Deblock-Event", user)
        }
        client.emit('Blocker-Event', otherUserId)
        return operation;
    }


    typingTo: Map<string, string> = new Map<string, string>();

    @SubscribeMessage('Typing')
    async isTyping(client: AuthSocket, data: Typing): Promise<void> {
        
        if (client.user.sub === data.otherUser)
          return

        const isBlocked : boolean = await this.blockService.isBlocked(client.user.sub, data.otherUser);
        if (isBlocked) {
            this.typingTo.delete(client.user.sub)
            return
        }

        const user: User = await this.userService.findOne(client.user.sub);

        if (user && data.isTyping) {
            this.typingTo.set(client.user.sub, data.otherUser)
        } else {
            this.typingTo.delete(client.user.sub)
        }

        const socket: AuthSocket = this.connectedSocket.get(data.otherUser)
        if (socket)
            socket.emit('isTyping', {User: user, tp: data.isTyping})
    }

    @SubscribeMessage('CheckisTypingToMe')
    async CheckisTypingToMe(client: AuthSocket, other: string): Promise<void> {
        const isBlocked = await this.blockService.isBlocked(client.user.sub, other);
        if (isBlocked) {
            this.typingTo.delete(client.user.sub)
            return
        }


        const user: User = await this.userService.findOne(other);
        const s: string = this.typingTo.get(other)

        if (s === client.user.sub) {
            client.emit('isTyping', {User: user, tp: true})
        }
    }

}
