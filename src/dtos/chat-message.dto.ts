import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({
    example: 'Hello WebSocket!',
    description: 'Message content to be sent via WebSocket',
  })
  message: string;

  @ApiProperty({
    example: '23cf76ab-cf3b-44e3-9c37-10fab8f03e52',
    description: 'Workflow UUID',
  })
  workflow_uuid: string;
}
