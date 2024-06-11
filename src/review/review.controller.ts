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
  async getReviewByUser(
    @Param('userId') userId: string,
    @Query('limit') limit: number,
    @Query('skip') skip?: number,
  ) {
    return this.reviewService.getReviewByUser(userId, limit, skip);
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

  @Get('/temp/:contentId')
  @ApiSwaggerApiParam('contentId', '66568c7287e12c9e1f655e07')
  getReviewByContentTemp(@Param('contentId') contentId: string) {
    console.log(contentId);
    return this.reviewService.getReviewByContentTemp(8, contentId);
  }

  @Get('detail/:reviewId')
  getReviewById(@Param('reviewId') reviewId: string) {
    return this.reviewService.getReviewById(reviewId);
  }

  @Get('/:contentId')
  @ApiSwaggerApiParam('contentId', '66568c7287e12c9e1f655e07')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  async getReviewByContent(
    @Param('contentId') contentId: string,
    @Query('limit') limit: number,
    @Query('skip') skip?: number,
  ) {
    return await this.reviewService.getReviewByContent(limit, skip, contentId);
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
    return this.reviewService.removeReview(reviewId);
  }

  @Get('score/:userId')
  findUserScore(@Param('userId') userId: string) {
    return this.genreScoreService.findUserScore(userId);
  }

  @Post('like')
  @UseGuards(JwtAuthGuard)
  @ApiSwaggerApiBody(SendLikeReviewDTO)
  likeReview(@Body() sendLikeReviewDTO: SendLikeReviewDTO) {
    const { reviewId, userId } = sendLikeReviewDTO;
    return this.reviewService.likeReview(reviewId, userId);
  }
  @Post('dislike')
  @UseGuards(JwtAuthGuard)
  @ApiSwaggerApiBody(SendLikeReviewDTO)
  dislikeReview(@Body() sendDislikeReviewDTO: SendLikeReviewDTO) {
    const { reviewId, userId } = sendDislikeReviewDTO;
    return this.reviewService.dislikeReview(reviewId, userId);
  }

  @Get('like/:userId/:reviewId')
  @ApiSwaggerApiParam('userId', '6629e63db60f7e47ff09ccab')
  @ApiSwaggerApiParam('reviewId', '65dd72c77e4cfc677cf30f1c')
  getReviewLike(
    @Param('reviewId') reviewId: string,
    @Param('userId') userId: string,
  ) {
    return this.reviewService.getReviewLike(reviewId, userId);
  }

  @Get('/average/:contentId')
  @ApiSwaggerApiParam('contentId', '66568c7287e12c9e1f655e07')
  getAverageGrade(@Param('contentId') contentId) {
    return this.reviewService.getAverageGrade(contentId);
  }
}
