import { Controller, Delete, Get, InternalServerErrorException, Param, ParseUUIDPipe, Post, Query, Req, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { BlockService } from './block.service';
import { ParseQueryPipe } from 'src/user/parse-query/parse-query.pipe';
import { FormatedQueryType, QueryTypedto } from 'src/user/dto/query-validation.dto';
import { PrismaErrorsFilter } from 'src/prisma/prisma-errors.filter';
import { JwtGuard } from 'src/auth/guard/jwt.guards';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { AuthReq } from 'src/user/types/AuthReq';

@Controller('block')
@UseFilters(PrismaErrorsFilter)
@UseGuards(JwtGuard)
export class BlockController {
  constructor(
    private readonly blockService: BlockService,
    private readonly notificationGateway: NotificationGateway
  ) { }

  @Get('/all')
  getBlockList(
    @Req() req: AuthReq,
    @Query(
      new ValidationPipe({ expectedType: QueryTypedto }),
      ParseQueryPipe
    ) { paginationQueries }: FormatedQueryType
  ) {
    console.log(req.user.sub);
    return this.blockService.getBlockList(req.user.sub);
  }

  @Post(':id')
  blockUser(
    @Req() req: AuthReq,
    @Param('id', ParseUUIDPipe) userId: string,
  ) {
    return this.blockService.blockUser(req.user.sub, userId);
  }

  @Delete(':id')
  unblockUser(
    @Req() req: AuthReq,
    @Param('id', ParseUUIDPipe) userId: string,
  ) {
    return this.blockService.unblockUser(req.user.sub, userId);
  }

  @Get(':id')
  isBlocked(
    @Req() req: AuthReq,
    @Param('id', ParseUUIDPipe) userId: string,
  ) {
    return this.blockService.isBlocked(req.user.sub, userId)
  }

  @Get('/state/:id')
  getBlockState(
    @Req() req: AuthReq,
    @Param('id', ParseUUIDPipe) userId: string,
  ) {
    return this.blockService.getBlockState(req.user.sub, userId)
  }
}
