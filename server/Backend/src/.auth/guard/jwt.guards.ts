import {  ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from '@nestjs/core';
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private jwtService : JwtService, 
        private config : ConfigService    
    ) { 
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const accessToken = request.cookies['jwt']
        if (!accessToken)
        {
            throw new UnauthorizedException()
        }
        try {
            const payload  = await this.jwtService.verifyAsync(accessToken, {
                secret : this.config.get<string>('SECRET')
            })
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload;
            
        }
        catch(err) {
            throw new UnauthorizedException()
        }
        return true;
    }
}