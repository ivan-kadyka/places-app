import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class RestExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(statusCode).json({
      ...this.getResponseBody(exceptionResponse, exception.message, statusCode),
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private getResponseBody(response: string | object, fallback: string, statusCode: number): object {
    if (typeof response === 'string') {
      return {
        statusCode,
        message: response || fallback,
      };
    }

    return response;
  }
}
