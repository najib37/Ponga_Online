import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

@Injectable()
@Catch(PrismaClientKnownRequestError)
export class PrismaErrorsFilter<T> implements ExceptionFilter {
  private readonly exceptionMap = {
    'P2002': {
      code: HttpStatus.CONFLICT,
      message: "Duplicate Key Violation"
    },
    'P2014': {
      code: HttpStatus.BAD_REQUEST,
      message: "Invalid ID"
    },
    'P2003': {
      code: HttpStatus.BAD_REQUEST,
      message: "Invalid Input"
    },
    'P2025': {
      code: HttpStatus.NOT_FOUND,
      message: "Record Not Found"
    },
    'P2005': {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Database Error"
    },
    'P2015': {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal Prisma Client Error"
    },
    'P2001': {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Query Engine Error"
    },
  }

  constructor(
    private readonly logger: Logger
  ) { }

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = this.exceptionMap[exception.code]?.code || HttpStatus.INTERNAL_SERVER_ERROR
    const message = this.exceptionMap[exception.code]?.message || "Internal Server Error"


    this.logger.debug('the filter');
    this.logger.error(exception);
    response
      .status(statusCode)
      .json({
        statusCode: statusCode,
        message: message,
        timestamp: new Date().toISOString(),
        // path: request.url,
      });
  }
}
