import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UserModule } from 'src/user/user.module';
import { FriendsModule } from 'src/friends/friends.module';
import { BlockModule } from 'src/block/block.module';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [UserModule, FriendsModule, BlockModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
