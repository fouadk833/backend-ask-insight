import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Dashboard layout configuration
export class DashboardLayoutDto {
  @ApiProperty({
    example: 2,
    description: 'Number of rows in the dashboard grid',
  })
  @IsNumber()
  rows: number;

  @ApiProperty({
    example: [2, 3],
    description: 'Array of column spans for each row',
    type: [Number],
  })
  @IsArray()
  columns: number[];

  @ApiProperty({
    example: 5,
    description: 'Total number of chart positions available',
  })
  @IsNumber()
  totalPositions: number;
}

// Widget/Chart data structure matching FastAPI WidgetData
export class WidgetDataDto {
  @ApiProperty({
    example: '7e5fa695-69bc-4322-bfcb-8d8a4f974061',
    description: 'Unique widget identifier (workflow_uuid)',
  })
  @IsString()
  @IsNotEmpty()
  widget_key: string;

  @ApiProperty({
    example: 'dashboard-123',
    description: 'Dashboard ID this widget belongs to',
  })
  @IsString()
  @IsNotEmpty()
  dashboard_key: string;

  @ApiProperty({
    example: '7e5fa695-69bc-4322-bfcb-8d8a4f974061',
    description: 'Message key (workflow_uuid)',
  })
  @IsString()
  @IsNotEmpty()
  message_key: string;

  @ApiProperty({
    example: 'Sales by Region',
    description: 'Title of the widget',
  })
  @IsString()
  @IsNotEmpty()
  widget_title: string;

  @ApiProperty({
    example: 'SELECT region, SUM(sales) FROM sales GROUP BY region',
    description: 'SQL query used for the widget',
  })
  @IsString()
  query: string;

  @ApiProperty({
    example: '[{"type":"chart","data":[...]}]',
    description: 'Last content as JSON string',
  })
  @IsString()
  last_content: string;

  @ApiProperty({
    example: 'metadata-key-123',
    description: 'Metadata key for the widget',
  })
  @IsString()
  @IsNotEmpty()
  metadata_key: string;

  @ApiProperty({
    example: 'conv-123456789',
    description: 'Conversation ID for the widget',
  })
  @IsString()
  @IsNotEmpty()
  conversation_id: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'When the widget was added',
  })
  @IsString()
  added_at: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Last refresh timestamp',
  })
  @IsString()
  last_refreshed_at: string;

  @ApiProperty({
    example: 0,
    description: 'Whether widget is persisted to Snowflake (0 or 1)',
  })
  @IsNumber()
  persisted: number;

  @ApiProperty({
    example: 1,
    description: 'Whether widget is active (1) or deleted (0)',
  })
  @IsNumber()
  active: number;
}

// Dashboard metadata
export class DashboardMetadataDto {
  @ApiProperty({
    example: 'dashboard-123',
    description: 'Unique dashboard identifier',
  })
  @IsString()
  @IsNotEmpty()
  dashboard_key: string;

  @ApiProperty({
    example: 'Sales Analytics Dashboard',
    description: 'Dashboard title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Dashboard creation timestamp',
  })
  @IsString()
  created_at: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Last update timestamp',
  })
  @IsString()
  updated_at: string;

  @ApiProperty({
    example: 3,
    description: 'Number of widgets in dashboard',
  })
  @IsNumber()
  widget_count: number;

  @ApiProperty({
    example: 0,
    description: 'Whether dashboard is persisted to Snowflake (0 or 1)',
  })
  @IsNumber()
  persisted: number;

  @ApiProperty({
    example: 1,
    description: 'Whether dashboard is active (1) or deleted (0)',
  })
  @IsNumber()
  active: number;
}

// Response for dashboard with widgets (matches DashboardWidgetResponse)
export class DashboardWithWidgetsResponseDto {
  @ApiProperty({
    type: DashboardLayoutDto,
    description: 'Dashboard grid layout configuration',
  })
  @ValidateNested()
  @Type(() => DashboardLayoutDto)
  dashboard_layout: DashboardLayoutDto;

  @ApiProperty({
    type: [WidgetDataDto],
    description: 'Array of widgets in the dashboard',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WidgetDataDto)
  dashboard_content: WidgetDataDto[];

  @ApiProperty({
    type: DashboardMetadataDto,
    description: 'Dashboard metadata',
  })
  @ValidateNested()
  @Type(() => DashboardMetadataDto)
  dashboard_metadata: DashboardMetadataDto;
}

// Dashboard list item (for GET /dashboards)
export class DashboardListItemDto {
  @ApiProperty({
    example: 'dashboard-123',
    description: 'Unique dashboard identifier',
  })
  @IsString()
  @IsNotEmpty()
  dashboard_key: string;

  @ApiProperty({
    example: 'Sales Analytics',
    description: 'Dashboard title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User who owns the dashboard',
  })
  @IsString()
  @IsNotEmpty()
  user_key: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Creation timestamp',
  })
  @IsString()
  created_at: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Last update timestamp',
  })
  @IsString()
  updated_at: string;

  @ApiProperty({
    example: '[]',
    description: 'Dashboard layout as JSON string',
  })
  @IsString()
  layout: string;

  @ApiProperty({
    example: 3,
    description: 'Number of widgets',
  })
  @IsNumber()
  widget_count: number;

  @ApiProperty({
    example: 0,
    description: 'Whether persisted to Snowflake (0 or 1)',
  })
  @IsNumber()
  persisted: number;

  @ApiProperty({
    example: 1,
    description: 'Whether dashboard is active (1) or deleted (0)',
  })
  @IsNumber()
  active: number;
}

// Request for creating or updating a dashboard (matches DashboardCreateRequest)
export class DashboardRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email/key',
  })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({
    example: 'My New Dashboard',
    description: 'Dashboard title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '7e5fa695-69bc-4322-bfcb-8d8a4f974061',
    description: 'Workflow UUID to add as a widget (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  questionID?: string;

  @ApiProperty({
    example: 'metadata-key-123',
    description: 'Metadata key for the widget (required if questionID provided)',
    required: false,
  })
  @IsString()
  @IsOptional()
  metadata_key?: string;

  @ApiProperty({
    example: 'conv-123456789',
    description: 'Conversation ID for the widget (required if questionID provided)',
    required: false,
  })
  @IsString()
  @IsOptional()
  conversation_id?: string;
}

// Dashboard operation response (matches DashboardResponse)
export class DashboardResponseDto {
  @ApiProperty({
    example: true,
    description: 'Whether the operation was successful',
  })
  @IsNotEmpty()
  success: boolean;

  @ApiProperty({
    example: 'dashboard-123',
    description: 'Dashboard key',
  })
  @IsString()
  @IsNotEmpty()
  dashboard_key: string;

  @ApiProperty({
    example: 'Sales Analytics',
    description: 'Dashboard title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Dashboard created successfully',
    description: 'Operation message',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}