import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from "express"

@Catch(UnauthorizedException)
export class AuthfilterFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();

    response.json({
      message: "Unauthorized",
      authorized: false,
      status: 201,
    })
  }
}
