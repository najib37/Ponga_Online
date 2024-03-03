import {Logger, Module} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import {ScheduleModule} from "@nestjs/schedule";
import {UserModule} from "../../user/user.module";
import {NotificationModule} from "../../notification/notification.module";
import {FriendsModule} from "../../friends/friends.module";
import {BlockModule} from "../../block/block.module";
import {ProfileModule} from "../../profile/profile.module";
import {PrismaService} from "../../prisma/prisma.service";
import {PrismaModule} from "../../prisma/prisma.module";

@Module({

  imports: [
    ScheduleModule.forRoot(),
    UserModule,
    NotificationModule,
    ProfileModule,
    PrismaModule,
    FriendsModule,
	BlockModule,
  ],
  providers: [MessageGateway, MessageService, Logger],
})

export class MessageModule {}
