import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
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
        { $limit: 10 },
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

      const contents = [...movies, ...tvs].sort((a, b) => {
        return b.popularity - a.popularity;
      });

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

      return { contents: movies };
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

      return { contents: tvs };
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
    const ids = await this.reviewModel
      .find()
      .where('contentType')
      .equals('movie')
      .sort({ createdAt: -1 })
      .limit(10);

    // const tvs = [];
    // for (const id of ids) {
    //   const tv = await this.findMovieById(id.contentId.toString());
    //   tvs.push(tv);
    // }
    return { movies: ids };
  }

  async findTvByLatestReview() {
    const tvIds = await this.reviewModel
      .find()
      .where('contentType')
      .equals('tv')
      .sort({ createdAt: -1 })
      .limit(10);

    return { tvs: tvIds };
  }
  async findMovieById(id: string) {
    return await this.movieModel.findOne({ _id: id }).exec();
  }
  async findTvById(id: string) {
    const tv = await this.tvModel.findOne({ _id: id }).exec();
    return tv;
  }

  async getTopRatedMovies(skip: number, limit: number = 10) {
    try {
      const pipeline: PipelineStage[] = [
        { $sort: { vote_count: -1, vote_average: -1 } },
        { $skip: +skip },
        { $limit: +limit },
      ];
      const result = await this.movieModel.aggregate(pipeline);

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async findContentGenreIds(contentType: string, contentId: string) {
    if (contentType === 'tv') {
      const genreIds = await this.tvModel.findById(contentId, { genre_ids: 1 });
      return genreIds;
    }
    if (contentType === 'movie') {
      const genreIds = await this.movieModel.findById(contentId, {
        genre_ids: 1,
      });
      return genreIds;
    }
  }
}
