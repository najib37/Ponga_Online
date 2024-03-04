import { ConsoleLogger, Controller, Delete, Get, InternalServerErrorException, Param, ParseUUIDPipe, Post, Query, Req, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ParseQueryPipe } from 'src/user/parse-query/parse-query.pipe';
import { FormatedQueryType, QueryTypedto } from 'src/user/dto/query-validation.dto';
import { PrismaErrorsFilter } from 'src/prisma/prisma-errors.filter';
import { JwtGuard } from 'src/auth/guard/jwt.guards';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { AuthReq } from 'src/user/types/AuthReq';
import { NotificationService } from 'src/notification/notification.service';

@Controller('friends')
@UseFilters(PrismaErrorsFilter)
@UseGuards(JwtGuard)
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly notificationGateway: NotificationGateway,
    private readonly notificationService: NotificationService
  ) { }

  @Get('/all')
  getAllFriends(
    @Req() req: AuthReq,
    @Query(
      new ValidationPipe({ expectedType: QueryTypedto }),
      ParseQueryPipe
    ) { paginationQueries }: FormatedQueryType
  ) {
    return this.friendsService.getAllFriends(req.user.sub, paginationQueries);
  }

  @Post(':id')
  async addFriend(
    @Req() req: AuthReq,
    @Param('id', ParseUUIDPipe) friendId: string,
  ) {

    await Promise.all([
      this.notificationService.removeRequest(friendId, req.user.sub),
      this.notificationService.removeRequest(req.user.sub, friendId),
    ])
    if (await this.friendsService.isFriends(req.user.sub, friendId))
      return {};
    return this.friendsService.addFriend(req.user.sub, friendId);
  }

  @Delete(':id')
  async deleteFriend(
    @Req() req: AuthReq,
    @Param('id', ParseUUIDPipe) friendId: string,
  ) {

    const [friend, friendOf] = await Promise.all([
      this.friendsService.deleteFriend(friendId, req.user.sub),
      this.friendsService.deleteFriend(req.user.sub, friendId),
    ])

    return friend && friendOf;
  }

  @Post('/request/:id')
  async sendRequest(
    @Param('id', ParseUUIDPipe) recipientId: string,
    @Req() req: AuthReq,
  ) {
    const notifState = await this.notificationGateway.sendNotification(
      'User',
      `Friend Request From ${req.user.username}`,
      req.user.sub,
      recipientId
    )

    if (!notifState)
      return InternalServerErrorException;

    return {
      message: "Request Sent Successfully"
    }
  }

  @Get('/request/:id')
  async getRequest(
    @Param('id', ParseUUIDPipe) sendertId: string,
    @Req() req: AuthReq,
  ) {
    const request = await this.notificationService.findByRerecipient(sendertId, req.user.sub, "User");
    return request;
  }

  @Delete('/request/:id')
  async deleteFriendRequest(
    @Param('id', ParseUUIDPipe) sendertId: string,
    @Req() req: AuthReq,
  ) {

    const notif = await this.notificationService.findByRerecipient(sendertId, req.user.sub, "User");
    if (!notif)
      return {
        message: "Unable To Deleted Request"
      }

    await this.notificationService.remove(notif.id);
    return {
      message: "Request Deleted Successfully"
    };
  }

  @Get("/check")
  checkFreind(
    @Query('id', ParseUUIDPipe) friendId: string,
    @Req() req: AuthReq,
  ) {
    return this.friendsService.isFriends(req.user.sub, friendId)
  }

  @Get('/state/:id')
  async checkRequestState(
    @Param('id', ParseUUIDPipe) friendId: string,
    @Req() req: AuthReq,
  ) {
    return this.notificationService.findByRerecipient(req.user.sub, friendId);
  }
}
