import { Module, forwardRef } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { NotificationModule } from 'src/notification/notification.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule,
    NotificationModule,
    forwardRef(() => FriendsModule)
  ],
  controllers: [BlockController],
  providers: [BlockService],
  exports: [BlockService]
})
export class BlockModule {}
