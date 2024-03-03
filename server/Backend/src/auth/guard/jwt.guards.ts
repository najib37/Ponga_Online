import {  ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from '@nestjs/core';
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Response, Request } from "express";
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private jwtService : JwtService, 
        private config : ConfigService    
    ) { 
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request : Request = context.switchToHttp().getRequest()
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
			//console.log("wax asat")
			console.log("here is the requesrt :  ", request.path )
			if (payload.otp === true && request?.path !== "/auth/otp")
			{
				console.log("")
				throw new UnauthorizedException()
			}
        }
        catch(err) {
            throw new UnauthorizedException()
        }
        return true;
    }
}