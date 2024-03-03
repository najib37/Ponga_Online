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
// @Global()
@Module({
  imports : [PrismaModule,/*  AuthModule, JwtModule, */ NotificationModule],
  controllers: [UserController],
  providers: [UserService],
  exports : [UserService],
})
export class UserModule {}

