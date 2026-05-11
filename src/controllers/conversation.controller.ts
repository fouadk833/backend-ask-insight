import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { ConversationService } from 'src/services/conversations.service';
// import { MsAuthGuard } from '../auth/ms-auth.guard';

@Controller()

export class ConversationsGatewayController {
  constructor(private readonly conversationService: ConversationService) { }

  // Cursor-based infinite scroll endpoint
  @Get('conversations')
  @ApiQuery({
    name: 'after',
    required: false,
    description: 'Cursor ID of the last conversation from previous batch (for infinite scroll)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of conversations to return',
    schema: { default: 20 }
  })
  async getConversationsWithCursor(
    @Query('user_id') user_id: string,
    @Query('domain') domain: string,
    @Query('after') after: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number
  ) {
    return this.conversationService.fetchConversationsWithInfiniteScroll({
      user_id,
      domain,
      after,
      limit,
    });
  }
  @Get('messages')
  async getConversationMessageList(
    @Query('conversation_id') conversation_id: string,
    @Query('user_id') user_id: string,
    @Query('domain') domain: string,
    @Query('after') after: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number
  ) {
    return this.conversationService.fetchConversationListMessage(
      {
        conversation_id,
        user_id,
        domain,
        after,
        limit,
      });
  }
  @Put('/conversation/:id/rename')
  async RenameConversationTitle(
    @Param('id') conversationId: string,
    @Body('conversation_title') conversation_title: string,
    @Query('user_id') user_id: string,
    @Query('domain') domain: string,
  ) {
    return this.conversationService.updateConversationTitle(
      conversationId,
      conversation_title,
      {
        user_id,
        domain,
      });
  }
  @Delete('/conversation/:id/delete')
  async deleteConversationTitle(
    @Param('id') conversationId: string,
    @Query('user_id') user_id: string,
    @Query('domain') domain: string,
  ) {
    return this.conversationService.deleteConversation(
      conversationId,
      {
        user_id,
        domain,
      });
  }


}
