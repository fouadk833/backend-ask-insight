import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatMessageDto } from '../dtos/chat-message.dto';

@ApiTags('WebSockets')
@Controller('ws-docs')
export class WebSocketDocsController {
  @Post('send-message')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Send a chat message via WebSocket',
    description:
      'This is a documentation-only endpoint that simulates sending a WebSocket message.',
  })
  @ApiBody({
    type: ChatMessageDto,
    examples: {
      example1: {
        summary: 'WebSocket Message Example',
        value: {
          sessionId: '123456',
          message: 'Hello, this is a test message!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns an example WebSocket request format.',
    schema: {
      example: {
        event: 'sendMessage',
        data: {
          sessionId: '123456',
          message: 'Hello, this is a test message!',
        },
      },
    },
  })
  sendMessage(@Body() body: ChatMessageDto) {
    return {
      event: 'sendMessage',
      data: body, // Ensure this matches how WebSocket clients should send data
    };
  }
}
