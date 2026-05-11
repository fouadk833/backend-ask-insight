import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AutocompleteService {
  private readonly fastApiUrl =
    process.env.FASTAPI_URL || 'https://localhost:8000';

  async getAutocompleteSuggestions(
    query: string,
    metadataKey: string,
    userId: string,
    limit: number,
  ): Promise<any> {
    console.log(
      `🔍 Request for autocomplete suggestions - query: "${query}", metadata_key: ${metadataKey}, user: ${userId}, limit: ${limit}`,
    );

    try {
      const baseUrl = this.fastApiUrl.startsWith('https')
        ? this.fastApiUrl
        : `https://${this.fastApiUrl}`;

      const url = `${baseUrl}/autocomplete`;
      console.log(`🔗 Fetching from: ${url}`);

      const response = await axios.get(url, {
        params: {
          query,
          metadata_key: metadataKey,
          user_id: userId,
          limit,
        },
      });

      console.log(
        `✅ Autocomplete returned ${response.data.suggestions?.length || 0} suggestions`,
      );
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching autocomplete suggestions:', error.message);

      // Handle different types of errors
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

      // Handle HTTP errors (4xx, 5xx)
      if (error.response) {
        const status = error.response.status;
        const message =
          error.response.data?.message || 'Error from FastAPI service';

        throw new HttpException(
          `FastAPI service error: ${message}`,
          status >= 500 ? HttpStatus.BAD_GATEWAY : status,
        );
      }

      // Handle other axios errors
      throw new HttpException(
        'Failed to fetch autocomplete suggestions from FastAPI service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
