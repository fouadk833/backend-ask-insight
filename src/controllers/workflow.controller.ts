import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { WorkFlowService } from 'src/services/workflow.service';

@Controller('workflow')
export class WorkFlowController {
  constructor(private readonly workFlowService: WorkFlowService) {}

  @Get('initiate')
  @ApiOperation({ summary: 'Get workflow uuid' })
  createSession() {
    return this.workFlowService.initiateWorkFlow();
  }
}
