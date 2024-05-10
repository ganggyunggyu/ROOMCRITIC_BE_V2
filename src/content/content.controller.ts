import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { Tv } from 'src/tv/schema/tv.schema';
import { movieIds, tvIds } from './constant/CONTENT_ID';
import { Movie } from 'src/movie/schema/movie.schema';
import { ApiTags } from '@nestjs/swagger';

@Controller('content')
@ApiTags('Content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('/tv/owner')
  async findOwnerTv(): Promise<{ tvs: Tv[] }> {
    const tvs: Tv[] = [];

    for (const id of tvIds) {
      const tv = await this.contentService.findTvById(id);

      if (tv) tvs.push(tv);
    }
    return { tvs };
  }

  @Get('/movie/owner')
  async findOwnerMovie(): Promise<{ movies: Movie[] }> {
    const movies: Movie[] = [];
    for (const id of movieIds) {
      const movie = await this.contentService.findMovieById(id);
      if (movie) movies.push(movie);
    }
    return { movies };
  }

  @Get('search')
  async searchContentByTitle(@Query('search_value') searchValue: string) {
    try {
      return await this.contentService.findContentByTitle(searchValue);
    } catch (error) {
      console.error('검색 오류:', error);
      throw new Error('Internal Server Error');
    }
  }

  @Get('movie/search')
  async searchMovieByTitle(@Query('search_value') searchValue: string) {
    try {
      return await this.contentService.findMovieByTitle(searchValue);
    } catch (error) {
      console.error('영화 검색 오류:', error);
      throw new Error('Internal Server Error');
    }
  }

  @Get('tv/search')
  async searchTvByTitle(@Query('search_value') searchValue: string) {
    try {
      return await this.contentService.findTvByTitle(searchValue);
    } catch (error) {
      console.error('TV 검색 오류:', error);
      throw new Error('Internal Server Error');
    }
  }

  @Get('detail/:contentType/:contentId')
  async getContentDetail(
    @Param('contentType') contentType: string,
    @Param('contentId') contentId: string,
  ) {
    try {
      return await this.contentService.findDetailContent(
        contentType,
        contentId,
      );
    } catch (error) {
      console.error('상세 정보 검색 오류:', error);
      throw new Error('Internal Server Error');
    }
  }

  @Get('movie/latest')
  async getMoviesByLatestReview() {
    try {
      return await this.contentService.findMovieByLatestReview();
    } catch (error) {
      console.error('최근 리뷰 작성된 영화 검색 오류:', error);
      throw new Error('Internal Server Error');
    }
  }

  @Get('tv/latest')
  async getTvsByLatestReview() {
    try {
      return await this.contentService.findTvByLatestReview();
    } catch (error) {
      console.error('최근 리뷰 작성된 TV 검색 오류:', error);
      throw new Error('Internal Server Error');
    }
  }
  @Get('/movie/top-rated-movie')
  async getTopRatedMovies() {
    return this.contentService.getTopRatedMovies();
  }
}
