import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthSocket } from 'src/notification/types/AuthSocket';

export function SocketAuthMiddleware(jwtService: JwtService, config: ConfigService) {

  return async (client: AuthSocket, next: any) => {
    const cookie: string = client.handshake.headers.cookie;

    const accessToken = cookie?.replace('jwt=', '');

    if (!accessToken) {
      next(new Error("Unauthorized"));
    }
    try {
      const payload = await jwtService.verifyAsync(accessToken, {
        secret: config.get<string>('SECRET')
      })
      client.user = payload;
    }
    catch (err) {
      next(new Error("Unauthorized"));
    }
    next();
  }
}
