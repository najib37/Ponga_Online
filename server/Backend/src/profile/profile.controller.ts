import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtGuard } from 'src/auth/guard/jwt.guards';
import { AuthReq } from 'src/user/types/AuthReq';
import { User } from 'src/user/entities/user.entity';
import { get } from 'http';

@Controller('profile')
@UseGuards(JwtGuard)

export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Get('')
  async getProfile(
    @Req() req: AuthReq,
    @Query('username') username: string,
  ) {
    return this.profileService.getProfileByUsername(req.user.sub, username);
  }
}
