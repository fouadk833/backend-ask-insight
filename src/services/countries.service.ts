import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { getFastApiBaseUrl } from 'src/utils/url.util';

dotenv.config();

@Injectable()
export class CountriesService {

  async getCountriesByDomainAndUser(
    periscopeDomainKey: string,
    userEmail: string,
  ): Promise<any> {
    console.log(
      `📍 Request to fetch countries for domain: ${periscopeDomainKey}, user: ${userEmail}`,
    );

    try {
      const baseUrl = getFastApiBaseUrl();
      const url = `${baseUrl}/countries/${periscopeDomainKey}/${userEmail}`;
      console.log(`🔗 Fetching from: ${url}`);

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching countries:', error.message);

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
        'Failed to fetch countries from FastAPI service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
