import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { ImagesRepoModule } from './images-repo/images-repo.module';
import { NotificationModule } from './notification/notification.module';
import { FriendsModule } from './friends/friends.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfileModule } from './profile/profile.module';
import { BlockModule } from './block/block.module';
import { PrismaModule } from './prisma/prisma.module';
import { GameModule } from './game/game.module';
import { RoomChatModule } from './chat/room-chat/room-chat.module';
import { MessageModule } from './chat/directChat/message.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    NotificationModule,
    UserModule,
    ImagesRepoModule,
    BlockModule,
    FriendsModule,
    ProfileModule,
    GameModule,
	RoomChatModule,
	MessageModule
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
  exports: [Logger]
})
export class AppModule { }
