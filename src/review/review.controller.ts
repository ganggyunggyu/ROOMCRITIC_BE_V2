import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewCreateDTO, ReviewUpdateDTO } from './dto/request';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  ApiSwaggerApiBody,
  ApiSwaggerApiParam,
} from 'src/shared/decorators/swagger.decorator';
import { GenreScoreService } from 'src/genre-score/genre-score.service';

@Controller('review')
@ApiTags('Review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly genreScoreService: GenreScoreService,
  ) {}

  @Get('user/:userId')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  async findUserReviews(
    @Param('userId') userId: string,
    @Query('limit') limit: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.reviewService.findUserReviews(userId, limit, cursor);
  }

  @Get('latest')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  findLatestReviews(
    @Query('limit') limit: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.reviewService.findLatestReviews(limit, cursor);
  }

  @Get('detail/:reviewId')
  findDetailReview(@Param('reviewId') reviewId: string) {
    return this.reviewService.findDetailReview(reviewId);
  }

  @Get('content/:contentType/:contentId')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  findContentReviews(
    @Param('contentType') contentType: string,
    @Param('contentId') contentId: string,
    @Query('limit') limit: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.reviewService.findContentReviews(
      limit,
      cursor,
      contentType,
      contentId,
    );
  }

  @Get('tv')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  findTvReviews(
    @Query('limit') limit: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.reviewService.findTvReviews(limit, cursor);
  }

  @Get('movie')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  findMovieReviews(
    @Query('limit') limit: number,
    @Query('cursor') cursor: string | null,
  ) {
    return this.reviewService.findMovieReviews({
      limit: limit,
      cursor: cursor,
    });
  }

  @Get('content-type/:contentType')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiSwaggerApiParam('contentType', 'tv')
  findReviewsByContentType(
    @Param('contentType') contentType: 'tv' | 'movie',
    @Query('limit') limit: number,
    @Query('cursor') cursor: string | null,
  ) {
    return this.reviewService.findReviewsByContentType(
      limit,
      cursor,
      contentType,
    );
  }

  @Post('add')
  @ApiSwaggerApiBody(ReviewCreateDTO)
  addReview(@Body() reviewCreateDTO: ReviewCreateDTO) {
    return this.reviewService.addReview(reviewCreateDTO);
  }

  @Put('update')
  @ApiSwaggerApiBody(ReviewUpdateDTO)
  updateReview(@Body() reviewUpdateDTO: ReviewUpdateDTO) {
    return this.reviewService.updateReview(reviewUpdateDTO);
  }

  @Delete('remove/:reviewId')
  removeReview(@Param('reviewId') reviewId: string) {
    return this.reviewService.removeReview(reviewId);
  }

  @Get('score/:userId')
  findUserScore(@Param('userId') userId: string) {
    return this.genreScoreService.findUserScore(userId);
  }
}
