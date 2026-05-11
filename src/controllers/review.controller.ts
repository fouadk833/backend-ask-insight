// controllers/review.controller.ts
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MsAuthGuard } from '../auth/ms-auth.guard';
import { AuthenticatedRequest } from '../auth/types/user-request.interface';
import { ReviewService } from 'src/services/review.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from 'src/dtos/create-review.dto';

@ApiTags('Reviews')
@Controller()

export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('review')
  @ApiOperation({ summary: 'Submit feedback for an AI message' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Review created successfully',
  })
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.reviewService.createReview({
      ...createReviewDto,
    });
  }
}
