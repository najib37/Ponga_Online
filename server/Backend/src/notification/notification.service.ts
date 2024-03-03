import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StateType } from './types/StateType';
import { Notification } from './entities/notification.entity'
import { SelectNotification } from './entities/notification-allowed-fields-entity';
import { SelectUser } from 'src/user/entities/user-allowed-fields.entity';

@Injectable()
export class NotificationService {

  private selectNotif = new SelectNotification()
  private selectUser = new SelectUser()

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(
    senderId: string,
    recipientId: string,
    createNotificationDto: CreateNotificationDto
  ): Promise<Notification> {
    return await this.prisma.notification.create({
      data: {
        ...createNotificationDto,
        senderId,
        recipientId,
      }
    })
  }

  async findAll(recipientId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { recipientId },
      select: { ...this.selectNotif }
    });
  }

  async findByState(recipientId: string, state: StateType): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: {
        state,
        recipientId,
      },
      select: { ...this.selectNotif }
    });
  }

  async findOne(notifId: string, senderId?: string): Promise<Notification> {
    return this.prisma.notification.findUnique({
      where: {
        id: notifId,
        senderId,
      },
      select: { ...this.selectNotif }
    });
  }

  async findByRerecipient(
    senderId: string,
    recipientId: string,
    type?: string,
    state?: NotifStateType
  ): Promise<Notification> {
    return this.prisma.notification.findFirst({
      where: {
        recipientId,
        senderId,
        state,
        type,
      },
      select: {
        recipient: {
          select: {
            ...this.selectUser
          }
        },
        ...this.selectNotif,
      }
    });
  }

  async removeRequest(
    senderId: string,
    recipientId: string,
    type?: string,
  ): Promise<boolean> {
    const notif: Notification = await this.findByRerecipient(senderId, recipientId);

    if (!notif)
      return false;

    console.log("salam");
    await this.remove(notif.id);
    return true;
  }

  async update(notifId: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    return this.prisma.notification.update({
      where: {
        id: notifId,
      },
      data: {
        ...updateNotificationDto,
      },
      select: {
        ...this.selectNotif,
      }
    });
  }

  async remove(notifId: string): Promise<Notification> {
    return this.prisma.notification.delete({
      where: {
        id: notifId,
      },
    });
  }
}
