import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-42";
import { UserService } from "src/user/user.service";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private configservice: ConfigService,
    private userservice: UserService,
  ) {
    super({
      clientID: configservice.get<string>('CLIENTUID'),
      clientSecret: configservice.get<string>('CLIENTSECRET'),
      callbackURL: configservice.get<string>('LOOPBACKURL'),
      profileFields: {
        id: 'id',
        username: 'login',
        email: 'email',
        avatar: 'image_url',
      },
    })
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = {
      username: profile.username,
      email: profile['email'],
      avatar: profile['_json']['image']['link'],
      name: profile['_json']['displayname']
    }
    const account = await this.userservice.findOrCreateUser(user)
    return account;
  }
 }
