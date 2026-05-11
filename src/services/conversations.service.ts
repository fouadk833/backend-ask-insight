import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

// DTOs for type safety
export interface ScrollParams {
  domain: string,
  page?: number;
  limit?: number;
}
export interface ChatMessage {
  type: "question" | "response";
  text: string;
  visible: boolean;
}
export interface ScrollLoadingResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

@Injectable()
export class ConversationService {
  private readonly fastApiUrl =
    process.env.FASTAPI_URL || 'https://localhost:8000';

  // For cursor-based infinite scroll (better performance for large datasets)
  // Cursor-based Pagination 
  async fetchConversationsWithInfiniteScroll(params: {
    user_id: string;
    domain: string;
    after?: string;
    limit?: number;
  }) {
    console.log('Request to Get conversations with cursor for infinite scroll');

    try {
      const { user_id, domain, after, limit = 20 } = params;
      const baseUrl = this.fastApiUrl.startsWith('https')
        ? this.fastApiUrl
        : `https://${this.fastApiUrl}`;

      const queryParams = new URLSearchParams();
      queryParams.append('user_id', user_id.toString());
      queryParams.append('metadata_key', domain.toString());
      if (after) queryParams.append('after', after);
      queryParams.append('limit', limit.toString());
      console.log(`${baseUrl}/conversations?${queryParams.toString()}`)
      const response = await axios.get(
        `${baseUrl}/conversations?${queryParams.toString()}`
      );
      return response.data;

    } catch (error) {
      console.error('Error fetching conversations:', error.message);

      // Handle different types of errors
      if (error.code === 'ECONNREFUSED') {
        throw new HttpException(
          'FastAPI service is not available. Please check if the service is running.',
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }

      if (error.code === 'ENOTFOUND') {
        throw new HttpException(
          'FastAPI service host not found. Please check the configuration.',
          HttpStatus.BAD_GATEWAY
        );
      }

      if (error.code === 'ETIMEDOUT') {
        throw new HttpException(
          'Request to FastAPI service timed out.',
          HttpStatus.REQUEST_TIMEOUT
        );
      }

      // Handle HTTP errors (4xx, 5xx)
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Error from FastAPI service';

        throw new HttpException(
          `FastAPI service error: ${message}`,
          status >= 500 ? HttpStatus.BAD_GATEWAY : status
        );
      }

      // Handle other axios errors
      throw new HttpException(
        'Failed to fetch conversations from FastAPI service',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async fetchConversationListMessage(
    params: {
      conversation_id: string
      user_id: string,
      domain: string;
      after?: string;
      limit?: number;
    }) {
    console.log('Request to Get messages with cursor for infinite scroll');

    try {
      const { conversation_id, user_id, domain, after, limit = 10 } = params;
      const baseUrl = this.fastApiUrl.startsWith('https')
        ? this.fastApiUrl
        : `https://${this.fastApiUrl}`;

      const queryParams = new URLSearchParams();
      queryParams.append('metadata_key', domain.toString());
      queryParams.append('user_id', user_id.toString());
      queryParams.append('conversation_id', conversation_id.toString())
      if (after) queryParams.append('after', after);
      queryParams.append('limit', limit.toString());
      const response = await axios.get(
        `${baseUrl}/messages?${queryParams.toString()}`
      );
      return response.data;

    } catch (error) {
      console.error('Error fetching messages:', error.message);

      // Handle different types of errors
      if (error.code === 'ECONNREFUSED') {
        throw new HttpException(
          'FastAPI service is not available. Please check if the service is running.',
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }

      if (error.code === 'ENOTFOUND') {
        throw new HttpException(
          'FastAPI service host not found. Please check the configuration.',
          HttpStatus.BAD_GATEWAY
        );
      }

      if (error.code === 'ETIMEDOUT') {
        throw new HttpException(
          'Request to FastAPI service timed out.',
          HttpStatus.REQUEST_TIMEOUT
        );
      }

      // Handle HTTP errors (4xx, 5xx)
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Error from FastAPI service';

        throw new HttpException(
          `FastAPI service error: ${message}`,
          status >= 500 ? HttpStatus.BAD_GATEWAY : status
        );
      }

      // Handle other axios errors
      throw new HttpException(
        'Failed to fetch conversations from FastAPI service',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async updateConversationTitle(
    conversationId: string,
    conversation_title: string,
    params: {
      user_id: string,
      domain: string;
    }) {
    console.log('update conversation name...');
    try {
      const { user_id, domain } = params;
      const baseUrl = this.fastApiUrl.startsWith('https')
        ? this.fastApiUrl
        : `https://${this.fastApiUrl}`;

      const queryParams = new URLSearchParams();
      queryParams.append('metadata_key', domain.toString());
      queryParams.append('user_id', user_id.toString());
      const response = await axios.put(
        `${baseUrl}/conversation/${conversationId}/rename?${queryParams.toString()}`, {
        conversation_title: conversation_title
      }
      );
      return response.data;

    } catch (error) {
      console.error('Error while update conversation:', error.message);

      // Handle different types of errors
      if (error.code === 'ECONNREFUSED') {
        throw new HttpException(
          'FastAPI service is not available. Please check if the service is running.',
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }

      if (error.code === 'ENOTFOUND') {
        throw new HttpException(
          'FastAPI service host not found. Please check the configuration.',
          HttpStatus.BAD_GATEWAY
        );
      }

      if (error.code === 'ETIMEDOUT') {
        throw new HttpException(
          'Request to FastAPI service timed out.',
          HttpStatus.REQUEST_TIMEOUT
        );
      }

      // Handle HTTP errors (4xx, 5xx)
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Error from FastAPI service';

        throw new HttpException(
          `FastAPI service error: ${message}`,
          status >= 500 ? HttpStatus.BAD_GATEWAY : status
        );
      }

      // Handle other axios errors
      throw new HttpException(
        'Failed to update conversation title from FastAPI service',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async deleteConversation(
    conversationId: string,
    params: {
      user_id: string,
      domain: string;
    }) {
    console.log('delete conversation...');
    try {
      const { user_id, domain } = params;
      const baseUrl = this.fastApiUrl.startsWith('https')
        ? this.fastApiUrl
        : `https://${this.fastApiUrl}`;



      const queryParams = new URLSearchParams();
      queryParams.append('metadata_key', domain.toString());
      queryParams.append('user_id', user_id.toString());
      const response = await axios.delete(
        `${baseUrl}/conversation/${conversationId}?${queryParams.toString()}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error while deleting conversation:', error.message);



      // Handle different types of errors
      if (error.code === 'ECONNREFUSED') {
        throw new HttpException(
          'FastAPI service is not available. Please check if the service is running.',
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }

      if (error.code === 'ENOTFOUND') {
        throw new HttpException(
          'FastAPI service host not found. Please check the configuration.',
          HttpStatus.BAD_GATEWAY
        );
      }

      if (error.code === 'ETIMEDOUT') {
        throw new HttpException(
          'Request to FastAPI service timed out.',
          HttpStatus.REQUEST_TIMEOUT
        );
      }



      // Handle HTTP errors (4xx, 5xx)
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Error from FastAPI service';



        throw new HttpException(
          `FastAPI service error: ${message}`,
          status >= 500 ? HttpStatus.BAD_GATEWAY : status
        );
      }



      // Handle other axios errors
      throw new HttpException(
        'Failed to delete conversation from FastAPI service',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}