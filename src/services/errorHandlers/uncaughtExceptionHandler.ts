import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../services';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class UncaughtExceptionHandler {
  private loggerService: LoggerService = new LoggerService();
  handle(error: Error) {
    this.loggerService.error({
      response: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
    process.exit(1);
  }
}
