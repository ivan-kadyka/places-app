import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class GraphqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, _host: ArgumentsHost): GraphQLError {
    const statusCode = exception.getStatus();
    const response = exception.getResponse();
    const message = this.getMessage(response, exception.message);

    return new GraphQLError(message, {
      extensions: {
        code: HttpStatus[statusCode] ?? 'HTTP_EXCEPTION',
        statusCode,
        response,
      },
    });
  }

  private getMessage(response: string | object, fallback: string): string {
    if (typeof response === 'string') {
      return response;
    }

    if ('message' in response) {
      const message = response.message;

      if (Array.isArray(message)) {
        return message.join(', ');
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    return fallback;
  }
}
