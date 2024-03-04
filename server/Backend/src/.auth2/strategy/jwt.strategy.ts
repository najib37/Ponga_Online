import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy , ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { 
    constructor(private configservice : ConfigService) { super({
        jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configservice.get<string>('SECRET'),
    }) }

    validate(payload: any): any {
        return { userId: payload.sub }
    }

}
