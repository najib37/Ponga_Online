import { PassportStrategy } from '@nestjs/passport';
import { Profile , Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateFromEmail, generateUsername } from 'unique-username-generator';
import { UserService } from 'src/user/user.service';
@Injectable()

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configservice : ConfigService, private readonly userservice : UserService) {
        super({
            clientID : configservice.get<string>('GOOGLEUID'),
            clientSecret : configservice.get<string>('GOOGLESECRET'),
            callbackURL : configservice.get<string>('GOOGLELOOPBACK'),
            scope: ['email', 'profile'],
        })
    }

    async   validate(accessToken : string, refreshToken : string, profile : Profile) : Promise<any> {
        // const user = {username : profile.username}
        const user = {
            username : generateFromEmail(profile.emails[0].value, 4),
            email: profile.emails[0].value,
            avatar : profile.photos[0].value,
            name : profile.displayName
        }
        const account = this.userservice.findOrCreateUser(user)
        
        return account
    }
}