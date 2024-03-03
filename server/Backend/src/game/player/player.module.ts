import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AchievementsService } from '../achievements/achievements.service';

@Module({
  imports: [PrismaModule],
  controllers: [PlayerController],
  providers: [PlayerService, AchievementsService],
  exports: [PlayerService]
})
export class PlayerModule {}
