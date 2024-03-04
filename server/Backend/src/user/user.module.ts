import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/authService';
import { JwtGuard } from 'src/auth/guard/jwt.guards';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from 'src/notification/notification.module';
import { FriendsModule } from 'src/friends/friends.module';
import { GameModule } from 'src/game/game.module';
// @Global()
@Module({
  imports : [PrismaModule, NotificationModule, GameModule],
  controllers: [UserController],
  providers: [UserService],
  exports : [UserService],
})
export class UserModule {}

