import {Catch, ArgumentsHost, BadRequestException, HttpException} from '@nestjs/common';
import {BaseWsExceptionFilter, WsException} from '@nestjs/websockets';
import {WsExceptionsHandler} from "@nestjs/websockets/exceptions/ws-exceptions-handler";
import {AuthSocket} from "../notification/types/AuthSocket";

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter{
    catch(exception: unknown, host: ArgumentsHost) {

        const ctx = host.switchToWs()
        const client = ctx.getClient() as AuthSocket;

        console.log("******************************************************")
        console.log(exception)
        console.log("******************************************************")

        client.emit("Error", "Invalid Operation!")

    }
}
