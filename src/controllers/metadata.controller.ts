import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MsAuthGuard } from 'src/auth/ms-auth.guard';
import { MetaDataService } from 'src/services/metadata.service';

@Controller('metadata')
export class MetaDataController {
  constructor(private readonly metaDataService: MetaDataService) {}

  @Get('keys')
  @ApiOperation({ summary: 'Get metadata keys' })
  getMetaDataKeys() {
    return this.metaDataService.getMetaDataKeys();
  }

  @Get('dimentions')
  @ApiOperation({ summary: 'Get metadata dimentions' })
  @ApiQuery({ name: 'metadata_key', type: String, required: true })
  getMetaDataDimentions(@Query('metadata_key') metadataKey: string) {
    return this.metaDataService.getMetaDataDimentions(metadataKey);
  }
  

  @Get('questions')
  @ApiOperation({ summary: 'Get metadata questions' })
  @ApiQuery({ name: 'metadata_key', type: String, required: true })
  getMetaDataQuestions(@Query('metadata_key') metadataKey: string) {
    return this.metaDataService.getMetaDataQuestions(metadataKey);
  }
  @Get('prompts')
  @ApiOperation({ summary: 'Get metadata prompts' })
  @ApiQuery({ name: 'metadata_key', type: String, required: true })
  @ApiQuery({ name: 'user_email', type: String, required: true })
  getMetaDataPrompts(@Query('metadata_key') metadataKey: string, @Query('user_email') user_email: string) {
    return this.metaDataService.getMetaDataPrompts(metadataKey,user_email);
  }

  @Get('latest-date-data')
  @ApiOperation({ summary: 'Get metadata questions' })
  @ApiQuery({ name: 'metadata_key', type: String, required: true })
  getLatestDateData() {
    return this.metaDataService.fecthLatestDateData();
  }
}
