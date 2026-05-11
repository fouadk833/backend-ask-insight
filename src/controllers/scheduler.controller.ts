
import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SchedulerService } from 'src/services/scheduler.service';
import { Public } from 'src/auth/public.decorator';

@Public()
@ApiTags('Scheduler')
@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('snowflake-persister-few-shots')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Trigger Snowflake Persister + Few-Shots Detection Scheduler',
    description: 'Executes the Snowflake persistence and few-shots detection scheduling process. Returns the exact response from the FastAPI service.',
  })
  @ApiResponse({
    status: 200,
    description: 'Scheduler executed successfully - returns FastAPI response',
    schema: {
      type: 'object',
      description: 'The exact response object from the FastAPI endpoint',
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async triggerSnowflakePersisterFewShots() {
    console.log('Triggering Snowflake Persister + Few-Shots Detection Scheduler');
    const result = await this.schedulerService.triggerSnowflakePersisterFewShots();
    console.log('Returning response to client:', JSON.stringify(result, null, 2));
    return result;
  }
}