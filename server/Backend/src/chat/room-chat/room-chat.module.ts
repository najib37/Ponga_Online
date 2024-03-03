import { Module } from '@nestjs/common';
import { RoomChatService } from './room-chat.service';
import { RoomChatGateway } from './room-chat.gateway';
import {PrismaModule} from "../../prisma/prisma.module";
import {UserModule} from "../../user/user.module";

@Module({

  imports: [
      PrismaModule,
      UserModule
  ],

  providers: [RoomChatGateway, RoomChatService],
})
export class RoomChatModule {}
