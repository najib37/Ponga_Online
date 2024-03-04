import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PlayerModule } from './player/player.module';
import { FriendsModule } from 'src/friends/friends.module';
import { ProfileModule } from 'src/profile/profile.module';
import { BlockModule } from 'src/block/block.module';
import { GameGateway } from './game.gateway';
import { GameConnection } from './gameConnection.service';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    PrismaModule,
    PlayerModule,
    // FriendsModule,
    // BlockModule,
    // ProfileModule,
	// UserModule,
	ScheduleModule.forRoot(),
	NotificationModule
  ],
  controllers: [GameController],
  providers: [GameService, GameConnection, GameGateway],
  exports: [GameService, GameGateway, GameConnection]

})
export class GameModule {}
