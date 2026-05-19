import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import axios from 'axios';
import { log } from 'console';
import { CreateReviewDto } from 'src/dtos/create-review.dto';
import { getFastApiBaseUrl } from 'src/utils/url.util';

@Injectable()
export class ReviewService {
  constructor() {}

  async createReview(payload: CreateReviewDto) {
    console.log('Creating review for message:', payload);

    const baseUrl = getFastApiBaseUrl();
    try {
      const response = await axios.post(`${baseUrl}/feedback`, payload);
      if (![200, 201].includes(response.status)) {
        throw new HttpException(
          'Unexpected response from FastAPI service',
          HttpStatus.BAD_GATEWAY,
        );
      }

      return 'Review added';
    } catch (error: any) {
      this.handleHttpError(error, 'review creation');
    }
  }

  private handleHttpError(error: any, context: string) {
    console.error(`Error during ${context}:`, error.message || error);

    if (error.code === 'ECONNREFUSED') {
      throw new HttpException(
        'FastAPI service is not available. Please check if the service is running.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    if (error.code === 'ENOTFOUND') {
      throw new HttpException(
        'FastAPI service host not found. Please check the configuration.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    if (error.code === 'ETIMEDOUT') {
      throw new HttpException(
        'Request to FastAPI service timed out.',
        HttpStatus.REQUEST_TIMEOUT,
      );
    }

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Error from FastAPI service';

      if (status === 404) {
        throw new NotFoundException(`Review target not found: ${message}`);
      }

      if (status === 403) {
        throw new ForbiddenException(`Access denied: ${message}`);
      }

      throw new HttpException(
        `FastAPI service error: ${message}`,
        status >= 500 ? HttpStatus.BAD_GATEWAY : status,
      );
    }

    throw new HttpException(
      `Failed to complete ${context}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
