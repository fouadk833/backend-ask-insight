import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { getFastApiBaseUrl } from 'src/utils/url.util';

dotenv.config();

@Injectable()
export class CpanelService {

  async getDomainsByEmail(email: string): Promise<any> {
    const baseUrl = getFastApiBaseUrl();

    const url = `${baseUrl}/domains`;
    console.log(`🔗 Fetching domains for email: ${email}`);

    try {
      const response = await axios.get(url, { params: { email } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to fetch domains from FastAPI service');
    }
  }

  async getDomains(userId: string): Promise<any> {
    const baseUrl = getFastApiBaseUrl();

    const url = `${baseUrl}/cpanel/domains`;
    console.log(`🔗 Fetching cpanel domains for user: ${userId}`);

    try {
      const response = await axios.get(url, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new HttpException(
          'FastAPI service is not available.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      if (error.code === 'ENOTFOUND') {
        throw new HttpException(
          'FastAPI service host not found.',
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
        const message =
          error.response.data?.message || 'Error from FastAPI service';
        throw new HttpException(
          `FastAPI service error: ${message}`,
          status >= 500 ? HttpStatus.BAD_GATEWAY : status,
        );
      }
      throw new HttpException(
        'Failed to fetch domains from FastAPI service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsers(userId: string): Promise<any> {
    const baseUrl = getFastApiBaseUrl();

    const url = `${baseUrl}/cpanel/users/all`;
    console.log(`👥 Fetching all users for: ${userId}`);

    try {
      const response = await axios.get(url, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new HttpException('FastAPI service is not available.', HttpStatus.SERVICE_UNAVAILABLE);
      }
      if (error.code === 'ENOTFOUND') {
        throw new HttpException('FastAPI service host not found.', HttpStatus.BAD_GATEWAY);
      }
      if (error.code === 'ETIMEDOUT') {
        throw new HttpException('Request to FastAPI service timed out.', HttpStatus.REQUEST_TIMEOUT);
      }
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Error from FastAPI service';
        throw new HttpException(`FastAPI service error: ${message}`, status >= 500 ? HttpStatus.BAD_GATEWAY : status);
      }
      throw new HttpException('Failed to fetch users from FastAPI service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDomainById(domainId: string, userId: string): Promise<any> {
    const baseUrl = getFastApiBaseUrl();

    const url = `${baseUrl}/cpanel/domains/${domainId}`;
    console.log(`🔍 Fetching domain ${domainId} for user: ${userId}`);

    try {
      const response = await axios.get(url, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new HttpException('FastAPI service is not available.', HttpStatus.SERVICE_UNAVAILABLE);
      }
      if (error.code === 'ENOTFOUND') {
        throw new HttpException('FastAPI service host not found.', HttpStatus.BAD_GATEWAY);
      }
      if (error.code === 'ETIMEDOUT') {
        throw new HttpException('Request to FastAPI service timed out.', HttpStatus.REQUEST_TIMEOUT);
      }
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Error from FastAPI service';
        throw new HttpException(`FastAPI service error: ${message}`, status >= 500 ? HttpStatus.BAD_GATEWAY : status);
      }
      throw new HttpException('Failed to fetch domain from FastAPI service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateDomain(domainId: string, userId: string, body: any): Promise<any> {
    const baseUrl = getFastApiBaseUrl();

    const url = `${baseUrl}/cpanel/domains/${domainId}`;
    console.log(`✏️ Updating domain ${domainId} for user: ${userId}`);

    try {
      const response = await axios.put(url, body, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new HttpException('FastAPI service is not available.', HttpStatus.SERVICE_UNAVAILABLE);
      }
      if (error.code === 'ENOTFOUND') {
        throw new HttpException('FastAPI service host not found.', HttpStatus.BAD_GATEWAY);
      }
      if (error.code === 'ETIMEDOUT') {
        throw new HttpException('Request to FastAPI service timed out.', HttpStatus.REQUEST_TIMEOUT);
      }
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Error from FastAPI service';
        throw new HttpException(`FastAPI service error: ${message}`, status >= 500 ? HttpStatus.BAD_GATEWAY : status);
      }
      throw new HttpException('Failed to update domain in FastAPI service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteDomain(domainId: string, userId: string): Promise<any> {
    const baseUrl = getFastApiBaseUrl();

    const url = `${baseUrl}/cpanel/domains/${domainId}`;
    console.log(`🗑️ Deleting domain ${domainId} for user: ${userId}`);

    try {
      const response = await axios.delete(url, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new HttpException('FastAPI service is not available.', HttpStatus.SERVICE_UNAVAILABLE);
      }
      if (error.code === 'ENOTFOUND') {
        throw new HttpException('FastAPI service host not found.', HttpStatus.BAD_GATEWAY);
      }
      if (error.code === 'ETIMEDOUT') {
        throw new HttpException('Request to FastAPI service timed out.', HttpStatus.REQUEST_TIMEOUT);
      }
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Error from FastAPI service';
        throw new HttpException(`FastAPI service error: ${message}`, status >= 500 ? HttpStatus.BAD_GATEWAY : status);
      }
      throw new HttpException('Failed to delete domain in FastAPI service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createDomain(userId: string, body: any): Promise<any> {
    const baseUrl = getFastApiBaseUrl();

    const url = `${baseUrl}/cpanel/domains`;
    console.log(`📝 Creating domain for user: ${userId}`);

    try {
      const response = await axios.post(url, body, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new HttpException(
          'FastAPI service is not available.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      if (error.code === 'ENOTFOUND') {
        throw new HttpException(
          'FastAPI service host not found.',
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
        const message =
          error.response.data?.message || 'Error from FastAPI service';
        throw new HttpException(
          `FastAPI service error: ${message}`,
          status >= 500 ? HttpStatus.BAD_GATEWAY : status,
        );
      }
      throw new HttpException(
        'Failed to create domain in FastAPI service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private handleAxiosError(error: any, fallbackMessage: string): never {
    if (error.code === 'ECONNREFUSED') {
      throw new HttpException('FastAPI service is not available.', HttpStatus.SERVICE_UNAVAILABLE);
    }
    if (error.code === 'ENOTFOUND') {
      throw new HttpException('FastAPI service host not found.', HttpStatus.BAD_GATEWAY);
    }
    if (error.code === 'ETIMEDOUT') {
      throw new HttpException('Request to FastAPI service timed out.', HttpStatus.REQUEST_TIMEOUT);
    }
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Error from FastAPI service';
      throw new HttpException(`FastAPI service error: ${message}`, status >= 500 ? HttpStatus.BAD_GATEWAY : status);
    }
    throw new HttpException(fallbackMessage, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  private getBaseUrl(): string {
    return getFastApiBaseUrl();
  }

  async getCategoriesMetadata(userId: string): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/categories/metadata`;
    console.log(`📂 Fetching categories metadata for user: ${userId}`);
    try {
      const response = await axios.get(url, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to fetch categories metadata from FastAPI service');
    }
  }

  async getCategoryMetadataTemplate(categoryKey: string, userId: string): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/categories/metadata/${categoryKey}/template`;
    console.log(`📋 Fetching metadata template for category: ${categoryKey}, user: ${userId}`);
    try {
      const response = await axios.get(url, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to fetch category metadata template from FastAPI service');
    }
  }

  async getCategoryMetadataContent(categoryKey: string, domainId: string, userId: string): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/categories/metadata/${categoryKey}/content`;
    console.log(`📄 Fetching metadata content for category: ${categoryKey}, domain: ${domainId}, user: ${userId}`);
    try {
      const response = await axios.get(url, { params: { user_id: userId, domain_id: domainId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to fetch category metadata content from FastAPI service');
    }
  }

  async updateDomainContent(domainId: string, userId: string, body: any): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/domains/${domainId}/content`;
    console.log(`✏️ Updating content for domain: ${domainId}, user: ${userId}`);
    try {
      const response = await axios.put(url, body, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to update domain content in FastAPI service');
    }
  }

  async updateCategoryMetadataContent(categoryKey: string, domainId: string, userId: string, body: any): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/categories/metadata/${categoryKey}/content`;
    console.log(`✏️ Updating metadata content for category: ${categoryKey}, domain: ${domainId}, user: ${userId}`);
    try {
      const response = await axios.put(url, body, { params: { user_id: userId, domain_id: domainId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to update category metadata content in FastAPI service');
    }
  }

  async getCategoriesPrompt(userId: string): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/categories/prompt`;
    console.log(`💬 Fetching categories prompt for user: ${userId}`);
    try {
      const response = await axios.get(url, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to fetch categories prompt from FastAPI service');
    }
  }

  async getCategoryPromptTemplate(categoryKey: string, userId: string): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/categories/prompt/${categoryKey}/template`;
    console.log(`📋 Fetching prompt template for category: ${categoryKey}, user: ${userId}`);
    try {
      const response = await axios.get(url, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to fetch category prompt template from FastAPI service');
    }
  }

  async getCategoryPromptContent(categoryKey: string, domainId: string, userId: string): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/categories/prompt/${categoryKey}/content`;
    console.log(`📄 Fetching prompt content for category: ${categoryKey}, domain: ${domainId}, user: ${userId}`);
    try {
      const response = await axios.get(url, { params: { user_id: userId, domain_id: domainId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to fetch category prompt content from FastAPI service');
    }
  }

  async getDraftsByDomain(userId: string): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/drafts`;
    console.log(`📋 Fetching drafts for user: ${userId}`);
    try {
      const response = await axios.get(url, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to fetch drafts from FastAPI service');
    }
  }

  async approveDraft(draftId: string, userId: string): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/drafts/${draftId}/approve`;
    console.log(`✅ Approving draft: ${draftId}, user: ${userId}`);
    try {
      const response = await axios.post(url, {}, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to approve draft in FastAPI service');
    }
  }

  async rejectDraft(draftId: string, userId: string): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/drafts/${draftId}/reject`;
    console.log(`❌ Rejecting draft: ${draftId}, user: ${userId}`);
    try {
      const response = await axios.post(url, {}, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to reject draft in FastAPI service');
    }
  }

  async updateCategoryPromptContent(categoryKey: string, domainId: string, userId: string, body: any): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/categories/prompt/${categoryKey}/content`;
    console.log(`✏️ Updating prompt content for category: ${categoryKey}, domain: ${domainId}, user: ${userId}`);
    try {
      const response = await axios.put(url, body, { params: { user_id: userId, domain_id: domainId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to update category prompt content in FastAPI service');
    }
  }

  async getDomainHistory(domainId: string, userId: string): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/domains/${domainId}/history`;
    console.log(`📜 Fetching history for domain: ${domainId}, user: ${userId}`);
    try {
      const response = await axios.get(url, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to fetch domain history from FastAPI service');
    }
  }

  async rollbackDomain(domainId: string, userId: string, body: any): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/domains/${domainId}/rollback`;
    console.log(`⏪ Rolling back domain: ${domainId}, user: ${userId}`);
    try {
      const response = await axios.post(url, body, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to rollback domain in FastAPI service');
    }
  }

  async promoteDeployment(userId: string, body: any): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/deployment/promote`;
    console.log(`🚀 Promoting deployment for user: ${userId}`);
    try {
      const response = await axios.post(url, body, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to promote deployment in FastAPI service');
    }
  }

  async assignUserRole(userId: string, body: any): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/user-roles/assign`;
    console.log(`🔑 Assigning role for user: ${userId}`);
    try {
      const response = await axios.post(url, body, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to assign user role in FastAPI service');
    }
  }

  async revokeUserRole(userId: string, body: any): Promise<any> {
    const url = `${this.getBaseUrl()}/cpanel/user-roles/revoke`;
    console.log(`🚫 Revoking role for user: ${userId}`);
    try {
      const response = await axios.post(url, body, { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to revoke user role in FastAPI service');
    }
  }
}
