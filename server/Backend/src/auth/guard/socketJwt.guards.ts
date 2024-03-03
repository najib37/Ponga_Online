import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class SocketJwtGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService,
    private config: ConfigService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToWs();
    const client = ctx.getClient();
    const cookie: string = client.handshake.headers.cookie;

    const accessToken = cookie?.replace('jwt=', '');

    if (!accessToken) {
      client.emit("Error", "Unauthorized") // emit an an errorMessage
      client.disconnect();
      return false;
    }
    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.config.get<string>('SECRET')
      })
      console.log(payload);
      client.user = payload;
      client.disconnect();
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
    }
    catch (err) {
      client.emit("Error", "Unauthorized")
      client.disconnect();
      return false;
    }
    return true;
  }
}
