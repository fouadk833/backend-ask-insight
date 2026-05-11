import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiBody } from '@nestjs/swagger';

import { DashbaordService } from 'src/services/dashboard.service';
// import { MsAuthGuard } from '../auth/ms-auth.guard';


@Controller()

export class DashboardController {
  constructor(private readonly dashboardService: DashbaordService) {}

  // Cursor-based infinite scroll endpoint
  @Get('dashboards')
  @ApiQuery({
    name: 'after',
    required: false,
    description: 'Cursor ID of the last dashboards from previous batch (for infinite scroll)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of dashboards to return',
    schema: { default: 20 }
  })
  async getdashboardsWithCursor(
    @Query('user_id') user_id: string,
    @Query('domain') domain: string,
    @Query('after') after: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number
  ) {
    return this.dashboardService.fetchDashbaordWithInfiniteScroll({
      user_id,
      domain,
      after,
      limit,
    });
  }
  @Get('/dashboard/:id/widgets')
  async getDashboardWidgets(
    @Param('id') dashboard_id: string,
    @Query('user_id') user_id: string,
  ) {
    return this.dashboardService.fetchDashabordWidgets(
      {
        dashboard_id,
        user_id,
      });
  }
  @Post('dashboard')
  @ApiQuery({
    name: 'dashboard_key',
    required: false,
    description: 'Dashboard key for updating an existing dashboard (leave empty to create new)',
  })
  @ApiBody({
    description: 'Dashboard data',
    schema: {
      type: 'object',
      properties: {
        user: { type: 'string', example: 'user@example.com' },
        title: { type: 'string', example: 'My Dashboard' },
        questionID: { type: 'string', example: '7e5fa695-69bc-4322-bfcb-8d8a4f974061' },
        metadata_key: { type: 'string', example: 'metadata-123' },
        conversation_id: { type: 'string', example: 'conv-456' },
      },
    },
  })
  async createOrUpdateDashboard(
    @Body() dashboardData: any,
    @Query('dashboard_key') dashboard_key: string,
    @Query('domain') domain: string,
  ) {
    console.log(`📝 ${dashboard_key ? `Updating dashboard ${dashboard_key}` : 'Creating new dashboard'}: ${dashboardData.title}`);
    return this.dashboardService.createOrUpdateDashboard(
      dashboardData,
      dashboard_key,
      domain,
    );
  }

  // Delete dashboard
  @Delete('dashboard/:id')
  @ApiQuery({
    name: 'user_id',
    required: true,
    description: 'User key (email or ID)',
  })
  async deleteDashboard(
    @Param('id') dashboardId: string,
    @Query('user_id') user_id: string,
    @Query('domain') domain: string,
  ) {
    console.log(`🗑️ Deleting dashboard ${dashboardId}`);
    return this.dashboardService.deleteDashboard(
      dashboardId,
      { user_id }
    );
  }

  @Delete('dashboard/:dashboardId/widget/:widgetId')
  @ApiQuery({
    name: 'user_id',
    required: true,
    description: 'User key (email or ID)',
  })
  @ApiBody({
    required: false,
    description: 'Optional layout update after widget deletion',
    schema: {
      type: 'object',
      properties: {
        layout: {
          type: 'object',
          description: 'Updated grid layout after widget removal',
        },
      },
    },
  })
  async deleteWidget(
    @Param('dashboardId') dashboardId: string,
    @Param('widgetId') widgetId: string,
    @Query('user_id') user_id: string,
    @Body() body?: { layout?: any },
  ) {
    console.log(`🗑️ Deleting widget ${widgetId} from dashboard ${dashboardId}`);
    return this.dashboardService.deleteWidget(
      dashboardId,
      widgetId,
      user_id,
      body?.layout,
    );
  }

  @Get('dashboard/:id/refresh_widgets')
  @ApiQuery({
    name: 'user_id',
    required: false,
    description: 'User key (email or ID)',
  })
  async refreshDashboardWidgets(
    @Param('id') dashboardId: string,
    @Query('user_id') user_id: string,
  ) {
    console.log(`🔄 Refreshing widgets for dashboard ${dashboardId}`);
    return this.dashboardService.refreshDashboardWidgets(
      dashboardId,
      { user_id },
    );
  }

 

}

