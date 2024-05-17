import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import {
  ReviewCreateDTO,
  ReviewUpdateDTO,
  SendLikeReviewDTO,
} from './dto/request';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  ApiSwaggerApiBody,
  ApiSwaggerApiParam,
} from 'src/shared/decorators/swagger.decorator';
import { GenreScoreService } from 'src/genre-score/genre-score.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  @ApiSwaggerApiBody(ReviewCreateDTO)
  async addReview(@Body() reviewCreateDTO: ReviewCreateDTO) {
    const newReview = await this.reviewService.addReview(reviewCreateDTO);
    return newReview;
  }

  @Put('update')
  @UseGuards(JwtAuthGuard)
  @ApiSwaggerApiBody(ReviewUpdateDTO)
  updateReview(@Body() reviewUpdateDTO: ReviewUpdateDTO) {
    return this.reviewService.updateReview(reviewUpdateDTO);
  }

  @Delete('remove/:reviewId')
  @UseGuards(JwtAuthGuard)
  removeReview(@Param('reviewId') reviewId: string) {
    console.log(reviewId);
    return this.reviewService.removeReview(reviewId);
  }

  @Get('score/:userId')
  findUserScore(@Param('userId') userId: string) {
    return this.genreScoreService.findUserScore(userId);
  }

  @Post('send/like')
  @UseGuards(JwtAuthGuard)
  @ApiSwaggerApiBody(SendLikeReviewDTO)
  likeReview(@Body() sendLikeReviewDTO: SendLikeReviewDTO) {
    const { reviewId, userId } = sendLikeReviewDTO;
    return this.reviewService.likeReview(reviewId, userId);
  }
  @Post('send/dislike')
  @UseGuards(JwtAuthGuard)
  dislikeReview(@Body() sendDislikeReviewDTO: SendLikeReviewDTO) {
    const { reviewId, userId } = sendDislikeReviewDTO;
    return this.reviewService.dislikeReview(reviewId, userId);
  }

  @Get('like/:reviewId/:userId')
  @ApiSwaggerApiParam('reviewId', '65dd72c77e4cfc677cf30f1c')
  @ApiSwaggerApiParam('userId', '6629e63db60f7e47ff09ccab')
  getReviewLike(
    @Param('reviewId') reviewId: string,
    @Param('userId') userId: string,
  ) {
    return this.reviewService.getReviewLike(reviewId, userId);
  }
}
