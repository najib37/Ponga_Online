import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketAuthMiddleware } from 'src/auth/socket-auth/socket-auth.middleware';
import { BlockModule } from 'src/block/block.module';

// @Global()
@Module({
  imports: [PrismaModule],
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationGateway, NotificationService]
})
export class NotificationModule {}
