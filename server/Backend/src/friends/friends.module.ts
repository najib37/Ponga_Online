import { Module, forwardRef } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { NotificationModule } from 'src/notification/notification.module';
import { BlockModule } from 'src/block/block.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    JwtModule,
    NotificationModule,
    BlockModule
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService]
})
export class FriendsModule {}
