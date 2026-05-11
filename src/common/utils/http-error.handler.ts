// src/common/utils/http-error.handler.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export interface HttpErrorHandlerOptions {
  serviceName?: string;
  defaultMessage?: string;
}

export class HttpErrorHandler {
  /**
   * Handle HTTP errors from external services (like Axios errors)
   * @param error - The error object from the HTTP client
   * @param options - Optional configuration for error messages
   */
  static handle(error: any, options: HttpErrorHandlerOptions = {}): never {
    const { 
      serviceName = 'External service', 
      defaultMessage = 'Failed to communicate with external service' 
    } = options;

    // Handle connection errors
    if (error.code === 'ECONNREFUSED') {
      throw new HttpException(
        `${serviceName} is not available. Please check if the service is running.`,
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    if (error.code === 'ENOTFOUND') {
      throw new HttpException(
        `${serviceName} host not found. Please check the configuration.`,
        HttpStatus.BAD_GATEWAY
      );
    }

    if (error.code === 'ETIMEDOUT') {
      throw new HttpException(
        `Request to ${serviceName} timed out.`,
        HttpStatus.REQUEST_TIMEOUT
      );
    }

    // Handle HTTP errors (4xx, 5xx responses)
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error || `Error from ${serviceName}`;
      
      throw new HttpException(
        `${serviceName} error: ${message}`,
        status >= 500 ? HttpStatus.BAD_GATEWAY : status
      );
    }

    // Handle other errors
    throw new HttpException(
      defaultMessage,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

// Alternative: Create as an Injectable service if you need dependency injection
import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpErrorHandlerService {
  handle(error: any, options: HttpErrorHandlerOptions = {}): never {
    return HttpErrorHandler.handle(error, options);
  }
}