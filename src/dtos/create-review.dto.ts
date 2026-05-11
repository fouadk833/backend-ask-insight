// dto/create-review.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  workflow_uuid: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  metadata_key: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  conversation_id: string;

  @ApiProperty({ enum: ['like', 'dislike'] })
  @IsIn(['like', 'dislike'])
  feedback_type: 'like' | 'dislike';

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
