import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { HttpErrorHandler } from 'src/common/utils/http-error.handler';

dotenv.config();

@Injectable()
export class SchedulerService {
  private readonly fastApiUrl =
    process.env.FASTAPI_URL || 'https://localhost:8000';

  private getBaseUrl(): string {
    return this.fastApiUrl.startsWith('https')
      ? this.fastApiUrl
      : `https://${this.fastApiUrl}`;
  }

  /**
   * Trigger Snowflake Persister + Few-Shots Detection Scheduler
   * Returns the exact response from the FastAPI endpoint
   */
  async triggerSnowflakePersisterFewShots(): Promise<any> {
    try {
      const baseUrl = this.getBaseUrl();
      const endpoint = encodeURIComponent(
        'Snowflake Persister + Few-Shots Detection Scheduler'
      );
      const url = `${baseUrl}/${endpoint}`;

      console.log('📡 Triggering scheduler at:', url);

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Scheduler triggered successfully');
      console.log('📄 Response from FastAPI:', JSON.stringify(response.data, null, 2));
      
      // Return the exact response from FastAPI
      return response.data;
    } catch (error) {
      console.error('❌ Error triggering scheduler:', error.message);
      HttpErrorHandler.handle(error, {
        serviceName: 'FastAPI Scheduler',
        defaultMessage: 'Failed to trigger Snowflake Persister + Few-Shots Detection Scheduler',
      });
    }
  }
}
