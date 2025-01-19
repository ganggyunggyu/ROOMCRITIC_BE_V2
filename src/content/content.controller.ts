import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  ApiSwaggerApiBody,
  ApiSwaggerApiParam,
} from 'src/shared/decorators/swagger.decorator';

@Controller('content')
@ApiTags('Content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('')
  async searchContentByTitle(
    @Query('q') searchValue: string,
    @Query('content_type') contentType: 'tv' | 'movie' | 'all',
  ) {
    try {
      return await this.contentService.getSearchContent(
        searchValue,
        contentType,
      );
    } catch (error) {
      console.error('검색 오류:', error);
      throw new Error('Internal Server Error');
    }
  }

  @Get('/latest')
  @ApiQuery({
    name: 'skip',
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: 'contentType',
    example: 'movie',
    required: false,
  })
  async getLatestContent(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
    @Query('contentType') contentType: 'tv' | 'movie',
  ) {
    try {
      return await this.contentService.getLatestContent(
        skip,
        limit,
        contentType,
      );
    } catch (error) {
      console.error('최근 리뷰 작성된 TV 검색 오류:', error);
      throw new Error('Internal Server Error');
    }
  }
  @Get('/popular')
  @ApiQuery({
    name: 'skip',
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: 'contentType',
    example: 'movie',
    required: false,
  })
  async getPopulaContent(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
    @Query('content_type') contentType: 'tv' | 'movie',
  ) {
    return this.contentService.getPopulaContent(+skip, limit, contentType);
  }

  @Get('/recently/created-review')
  @ApiQuery({
    name: 'skip',
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: 'contentType',
    example: 'movie',
    required: false,
  })
  async getRecentlyReview(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
    @Query('content_type') contentType: 'tv' | 'movie',
  ) {
    return this.contentService.getRecentlyReviewCreateContent(
      +skip,
      limit,
      contentType,
    );
  }

  @Get('wish/:userId/:contentId')
  @ApiSwaggerApiParam('userId', '6629e63db60f7e47ff09ccab')
  @ApiSwaggerApiParam('contentId', '65dbf74e13f52a0d8acd89a7')
  async findWishContent(
    @Param('userId') userId: string,
    @Param('contentId') contentId: string,
  ) {}

  @Post('wish/:userId/:contentId')
  // @UseGuards(JwtAuthGuard)
  async addContentWish(
    @Param('userId') userId: string,
    @Param('contentId') contentId: string,
  ) {}

  @Delete('wish/:userId/:contentId')
  // @UseGuards(JwtAuthGuard)
  @ApiSwaggerApiParam('userId', '6629e63db60f7e47ff09ccab')
  @ApiSwaggerApiParam('contentId', '65dbf74e13f52a0d8acd89a7')
  async removeContentWish(
    @Param('userId') userId: string,
    @Param('contentId') contentId: string,
  ) {}

  @Get('wish/:userId')
  @ApiSwaggerApiParam('userId', '6629e63db60f7e47ff09ccab')
  findWishContentByUser(@Param('userId') userId: string) {}
  @Get('/:contentId')
  async getContentByOne(@Param('contentId') contentId: string) {
    try {
      return await this.contentService.getContentByOneWithReview(contentId);
    } catch (error) {
      console.error('상세 정보 검색 오류:', error);
      throw new Error('Internal Server Error');
    }
  }
}
