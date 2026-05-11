import { Injectable, HttpException, HttpStatus  } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { HttpErrorHandler } from 'src/common/utils/http-error.handler';

dotenv.config();
// DTOs for type safety
export interface ScrollParams {
  domain: string,
  page?: number;
  limit?: number;
}
export interface DashbaordList {
    dashboard_key: string,
    title: string,
    user_key: string,
    created_at: string,
    updated_at: string,
    widget_count: number,
    persisted: number,
    active: number
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
export class DashbaordService {
  private readonly fastApiUrl =
    process.env.FASTAPI_URL || 'https://localhost:8000';

  private getBaseUrl(): string {
    return this.fastApiUrl.startsWith('http')
      ? this.fastApiUrl
      : `https://${this.fastApiUrl}`;
  }

  // Cursor-based Pagination - Fetch dashboards
  async fetchDashbaordWithInfiniteScroll(params: {
    user_id: string;
    domain: string;
    after?: string;
    limit?: number;
  }) {
    console.log('📋 Request to Get dashboard with cursor for infinite scroll');
    try {
      const { user_id, after, limit = 20 } = params;
      const baseUrl = this.getBaseUrl();
      
      const queryParams = new URLSearchParams();
      queryParams.append('user_key', user_id.toString());
      if (after) queryParams.append('after', after);
      queryParams.append('limit', limit.toString());

      const url = `${baseUrl}/dashboards?${queryParams.toString()}`;
      console.log(`🔗 Fetching from: ${url}`);
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error.message);
      HttpErrorHandler.handle(error, {
        serviceName: 'FastAPI service',
        defaultMessage: 'Failed to fetch dashboards from FastAPI service'
      });
    }
  }
  
  async fetchDashabordWidgets(params: {
    dashboard_id: string;
    user_id: string;
  }) {
    console.log('Request to Get widget');

    try {
      const { dashboard_id, user_id} = params;
      const baseUrl = this.getBaseUrl();

      const queryParams = new URLSearchParams();
      queryParams.append('user_key', user_id.toString());
      const response = await axios.get(
        `${baseUrl}/dashboard/${dashboard_id}/widgets?${queryParams}`
      );
      return response.data;

    } catch (error) {
      console.error('Error fetching dahsboard:', error.message);
      HttpErrorHandler.handle(error, {
        serviceName: 'FastAPI service',
        defaultMessage: 'Failed to fetch conversations from FastAPI service'
      });
    }
  }
  
  // Fetch dashboard with widgets/charts
  async fetchDashboardWithWidgets(params: {
    dashboardId: string;
    userKey: string;
  }) {
    const { dashboardId, userKey } = params;
    try {
      const baseUrl = this.getBaseUrl();
      const url = `${baseUrl}/dashboard/${dashboardId}/widgets?user_key=${encodeURIComponent(userKey)}`;
      
      console.log('📡 Fetching dashboard with widgets from FastAPI:', url);
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching dashboard with widgets:', error.message);
      HttpErrorHandler.handle(error, {
        serviceName: 'FastAPI service',
        defaultMessage: 'Failed to fetch dashboard with widgets from FastAPI',
      });
    }
  }

  // Create or update dashboard
  async createOrUpdateDashboard(
    dashboardData: any,
    dashboardKey?: string,
    domain?: string,
  ) {
    try {
      const baseUrl = this.getBaseUrl();
      const queryParams = new URLSearchParams();
      
      if (dashboardKey) {
        queryParams.append('dashboard_key', dashboardKey);
      }
      if (domain) {
        queryParams.append('domain', domain);
      }

      const url = `${baseUrl}/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      console.log(`${dashboardKey ? 'Updating' : 'Creating'} dashboard in FastAPI:`, url);
      console.log(' Dashboard data:', JSON.stringify(dashboardData, null, 2));
      
      const response = await axios.post(url, dashboardData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(` Dashboard ${dashboardKey ? 'updated' : 'created'} successfully`);
      return response.data;
    } catch (error) {
      console.error(` Error ${dashboardKey ? 'updating' : 'creating'} dashboard:`, error.message);
      HttpErrorHandler.handle(error, {
        serviceName: 'FastAPI service',
        defaultMessage: `Failed to ${dashboardKey ? 'update' : 'create'} dashboard in FastAPI service`,
      });
    }
  }

  // Rename dashboard
  async renameDashboard(
    dashboardId: string,
    newTitle: string,
    params: { user_id: string; domain?: string },
  ) {
    try {
      const baseUrl = this.getBaseUrl();
      const queryParams = new URLSearchParams();
      queryParams.append('user_key', params.user_id);
      if (params.domain) queryParams.append('domain', params.domain);

      const url = `${baseUrl}/dashboard/${dashboardId}/rename?${queryParams.toString()}`;
      
      console.log(`Renaming dashboard ${dashboardId} to "${newTitle}"`);
      
      const response = await axios.put(
        url,
        { dashboard_title: newTitle },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Dashboard renamed successfully');
      return response.data;
    } catch (error) {
      console.error(' Error renaming dashboard:', error.message);
      HttpErrorHandler.handle(error, {
        serviceName: 'FastAPI service',
        defaultMessage: 'Failed to rename dashboard in FastAPI service',
      });
    }
  }

  // Delete dashboard
  async deleteDashboard(
    dashboardId: string,
    params: { user_id: string;  },
  ) {
    try {
      const baseUrl = this.getBaseUrl();
      const queryParams = new URLSearchParams();
      queryParams.append('user_key', params.user_id);

      const url = `${baseUrl}/dashboard/${dashboardId}?${queryParams.toString()}`;
      
      console.log(`🗑️ Deleting dashboard ${dashboardId}`);
      
      const response = await axios.delete(url);
      
      console.log('✅ Dashboard deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting dashboard:', error.message);
      HttpErrorHandler.handle(error, {
        serviceName: 'FastAPI service',
        defaultMessage: 'Failed to delete dashboard in FastAPI service',
      });
    }
  }

  // NEW: Delete widget from dashboard
  async deleteWidget(
    dashboardId: string,
    widgetId: string,
    userId: string,
    layout?: any,
  ) {
    try {
      const baseUrl = this.getBaseUrl();
      const queryParams = new URLSearchParams();
      queryParams.append('user_key', userId);

      const url = `${baseUrl}/dashboard/${dashboardId}/widget/${widgetId}?${queryParams.toString()}`;
      
      console.log(`🗑️ Deleting widget ${widgetId} from dashboard ${dashboardId}`);
      
      const requestBody = layout ? { layout } : {};
      
      const response = await axios.delete(url, {
        data: requestBody,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('✅ Widget deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting widget:', error.message);
      HttpErrorHandler.handle(error, {
        serviceName: 'FastAPI service',
        defaultMessage: 'Failed to delete widget from FastAPI service',
      });
    }
  }


  // Refresh dashboard widgets
  async refreshDashboardWidgets(
    dashboardId: string,
    params: { user_id?: string },
  ): Promise<{ success: boolean; dashboard_key: string; last_refreshed_at: string }> {
    try {
      const baseUrl = this.getBaseUrl();
      const queryParams = new URLSearchParams();
      
      if (params.user_id) {
        queryParams.append('user_key', params.user_id);
      }
      
      const url = `${baseUrl}/dashboard/${dashboardId}/refresh_widgets`;
      
      console.log(`🔄 Refreshing dashboard ${dashboardId} widgets`);
      
      const response = await axios.get(url);
      
      console.log('✅ Dashboard widgets refreshed successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error refreshing dashboard widgets:', error.message);
      HttpErrorHandler.handle(error, {
        serviceName: 'FastAPI service',
        defaultMessage: 'Failed to refresh dashboard widgets in FastAPI service',
      });
    }
  }

}

