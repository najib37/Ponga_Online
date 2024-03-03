import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { AuthSocket } from 'src/notification/types/AuthSocket';

@Catch()
export class WsGameFilter extends BaseWsExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
	const client : AuthSocket = host.switchToWs().getClient();
	client.emit('error', exception);
	}
}