import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from 'src/movie/schema/movie.schema';
import { Review } from 'src/review/schema/review.schema';
import { Tv } from 'src/tv/schema/tv.schema';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel('Tv') private readonly tvModel: Model<Tv>,
    @InjectModel('Movie') private readonly movieModel: Model<Movie>,
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
  ) {}

  async findContentByTitle(title: string) {
    try {
      const tvs = await this.tvModel.aggregate([
        {
          $search: {
            index: 'tvs_title_index',
            text: { query: title, path: 'title' },
          },
        },
        { $limit: 20 },
      ]);

      const movies = await this.movieModel.aggregate([
        {
          $search: {
            index: 'movies_title_index',
            text: { query: title, path: 'title' },
          },
        },
        { $limit: 10 },
      ]);

      const contents = [...movies, ...tvs];

      return {
        contents,
        message: '검색 콘텐츠 보내드림',
      };
    } catch (error) {
      console.error('검색 오류:', error);
      throw new Error('Internal Server Error');
    }
  }

  async findMovieByTitle(title: string) {
    const movieGate = [
      {
        $search: {
          index: 'movies_title_index',
          text: { query: title, path: 'title' },
        },
      },
      { $limit: 20 },
    ];
    try {
      const movies = await this.movieModel.aggregate(movieGate);

      return movies;
    } catch (error) {
      console.error('검색 오류:', error);

      throw new Error(error);
    }
  }
  async findTvByTitle(title: string) {
    const tvGate = [
      {
        $search: {
          index: 'tvs_title_index',
          text: { query: title, path: 'title' },
        },
      },
      { $limit: 20 },
    ];
    try {
      const tvs = await this.tvModel.aggregate(tvGate);

      return tvs;
    } catch (error) {
      console.error('검색 오류:', error);

      throw new Error(error);
    }
  }
  async findDetailContent(contentType, contentId) {
    if (contentType === 'movie') {
      const movie = await this.movieModel.findOne({ _id: contentId });
      if (movie) {
        return movie;
      }
    }
    if (contentType === 'tv') {
      const tv = await this.tvModel.findOne({ _id: contentId });
      if (tv) {
        return tv;
      }
    }
  }
  async findMovieByLatestReview() {
    const contentIds = await this.reviewModel.distinct('contentId', {
      createTime: {
        $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      }, // 최근 7일 이내 리뷰 작성된 것
    });
    console.log(contentIds);
    const movies: Movie[] = [];

    for (const id of contentIds) {
      const movie = await this.movieModel.findOne({ _id: id });
      if (movie) {
        movies.push(movie);
      }
    }
    return movies;
  }
  async findTvByLatestReview(): Promise<Tv[]> {
    const contentIds = await this.reviewModel.distinct('contentId', {
      createTime: {
        $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      }, // 최근 7일 이내 리뷰 작성된 것
    });

    const tvs: Tv[] = [];

    for (const id of contentIds) {
      const tv = await this.tvModel.findOne({ _id: id });
      if (tv) {
        tvs.push(tv);
      }
    }
    return tvs;
  }
  async findMovieById(id: string) {
    console.log(id);
    return await this.movieModel.findOne({ _id: id }).exec();
  }
  async findTvById(id: string) {
    const tv = await this.tvModel.findOne({ _id: id }).exec();
    return tv;
  }
}
