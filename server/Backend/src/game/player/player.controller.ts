import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, UseFilters, Req } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guards';
import { Achievment, PlayerType } from './types/playerType';
import { PrismaErrorsFilter } from 'src/prisma/prisma-errors.filter';
import { AchievementsService } from '../achievements/achievements.service';
import { AuthReq } from 'src/user/types/AuthReq';

@UseFilters(PrismaErrorsFilter)
@Controller('player')
@UseGuards(JwtGuard)

export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
  ) {}

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) : Promise<PlayerType> {
    return this.playerService.create(createPlayerDto);
  }

  @Get()
  findAll() {
    return this.playerService.findAll();
  }

  @Get('/leaderboard')
  getLeaderBoard() {
    return this.playerService.getPlayersLeaderBoard();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerService.findPlayerById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePlayerDto: UpdatePlayerDto
  ) {
    return this.playerService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
   return this.playerService.remove(id);
  }

  @Get('/stats/:id') 
  getPlayerStats(
    @Param('id') playerId: string
  ) {
    return this.playerService.getPalyerStats(playerId);
  }

  @Get('achievements/:id')
  getAchievements(@Param('id') playerId: string) {
    return this.playerService.getPlayerAchievements(playerId);
  }
}
