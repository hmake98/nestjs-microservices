import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { __ } from '@squareboat/nestjs-localization/dist/src';
import { Response, Request } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message;
    if (message) {
      const lang = request.headers['accept-language'] || 'en';
      const trans_message = __(message, lang);
      if (message.includes('ERROR')) {
        message = exception.message;
      } else {
        message = trans_message;
      }
    } else {
      message = 'Internal server error';
    }
    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
