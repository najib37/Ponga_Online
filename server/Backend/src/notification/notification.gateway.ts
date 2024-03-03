import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  OnGatewayInit
} from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UseFilters } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { PrismaSocketFilter } from 'src/prisma/prisma-errors-socket.filter';
import { SocketAuthMiddleware } from 'src/auth/socket-auth/socket-auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthSocket } from './types/AuthSocket';

@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: true,
    credentials: true,
  }
})

@UseFilters(PrismaSocketFilter)

export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  public connectedSockets: Record<string, Socket> = {}
  private socketAuthMiddleware;

  @WebSocketServer()
  server: Server

  constructor(
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.socketAuthMiddleware = SocketAuthMiddleware(jwtService, config);
  }

  afterInit(client: AuthSocket) {
    this.server.use(this.socketAuthMiddleware);
  }

  async handleConnection(client: AuthSocket) {
    this.connectedSockets[client.user?.sub] = client;
  }

  handleDisconnect(client: AuthSocket) {
    delete this.connectedSockets[client.user?.sub];
  }

  @SubscribeMessage('notification')
  async updateNotif(@MessageBody() notif: CreateNotificationDto) {

    if (!notif || !notif.id)
      return;

    const dbNotif = await this.notificationService.findOne(notif.id);

    if (!dbNotif?.id)
      return;

    if (notif.state === 'CLICKED') {
      await this.notificationService.remove(notif.id);
    }
    else if (notif.state === 'READ') {
      await this.notificationService.update(notif.id, { state: 'READ' })
    }
  }

  @SubscribeMessage('allPendingNotification')
  async sendPending(client: AuthSocket) {

    const recipientId = client.user?.sub;

    const pendigNotifs = await this.notificationService.findAll(recipientId)
    const recipient = this.connectedSockets[client.user?.sub];

    if (recipient)
      recipient.emit("allPendingNotification", pendigNotifs)
  }

  async sendNotification(
    type: NotifOriginType,
    content: string,
    senderId: string,
    recipientId: string
  ): Promise<boolean> {

    // BUG: add protection for blocked users

    const notif = await this.notificationService.create(senderId, recipientId, {
      type,
      content,
      state: 'PENDING',
    })
    const recipient = this.connectedSockets[recipientId];

    if (recipient)
      recipient.emit("notification", notif)

    return notif ? true : false
  }

  isOnline(userId: string): boolean {
    return this.connectedSockets[userId] ? true : false;
  }
}
