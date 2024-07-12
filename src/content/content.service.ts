import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Movie } from 'src/movie/schema/movie.schema';
import { Review } from 'src/review/schema/review.schema';
import { Tv } from 'src/tv/schema/tv.schema';
import { Content } from './schema/content.schema';
import { getGenreName } from 'src/user/constant/GENRE_SCORES';
import { typeMatch } from './lib/typeMatch';

export const searchContentProject = {
  $project: {
    _id: 1,
    title: 1,
    overview: 1,
    originalTitle: 1,
    genreIds: 1,
    voteAverage: 1,
    voteCount: 1,
    backdropPath: 1,
    posterPath: 1,
    releaseDate: 1,
    score: { $meta: 'searchScore' },
  },
};
@Injectable()
export class ContentService {
  constructor(
    @InjectModel('Tv') private readonly tvModel: Model<Tv>,
    @InjectModel('Movie') private readonly movieModel: Model<Movie>,
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
    @InjectModel('Content') private readonly contentModel: Model<Content>,
  ) {}

  async getContentByOneWithReview(contentId: string) {
    const content = await this.contentModel.findById(contentId);
    const reviews = await this.reviewModel.find({ contentId: contentId });
    const result = { content, reviews };
    console.log(result);
    return result;
  }

  async getSearchContent(
    searchValue: string,
    contentType: 'tv' | 'movie' | 'all',
  ): Promise<any[]> {
    const match = typeMatch(contentType);
    try {
      console.log(`Searching for content with value: ${searchValue}`);
      const result = await this.contentModel.aggregate([
        {
          $search: {
            index: 'content_search_index',
            compound: {
              should: [
                {
                  text: {
                    query: searchValue,
                    path: 'title',
                  },
                },
                {
                  text: {
                    query: searchValue,
                    path: 'originalTitle',
                  },
                },
                {
                  text: {
                    query: searchValue,
                    path: 'overview',
                  },
                },
                {
                  text: {
                    query: searchValue,
                    path: 'genreIds',
                  },
                },
              ],
              minimumShouldMatch: 1,
            },
          },
        },
        { $addFields: { score: { $meta: 'searchScore' } } },
        { $sort: { score: -1, popularity: -1 } },
        { $limit: 10 },
        match,
        searchContentProject,
      ]);

      result.forEach((el) => {
        el.genreIds = el.genreIds.map((v: string) => getGenreName(v));
      });

      return result;
    } catch (error) {
      console.error('Search error:', error.message);
      throw new Error('Failed to search content: ' + error.message);
    }
  }

  async getPopulaContent(
    skip: number,
    limit: number = 10,
    contentType?: 'tv' | 'movie',
  ) {
    const pipeline: PipelineStage[] = contentType
      ? [
          { $match: { contentType: contentType } },
          { $sort: { voteCount: -1, voteAverage: -1 } },
          { $skip: +skip },
          { $limit: +limit },
          { $project: { __v: 0, voteCount: 0, popularity: 0, adult: 0 } },
        ]
      : [
          { $sort: { voteCount: -1, voteAverage: -1 } },
          { $skip: +skip },
          { $limit: +limit },
          { $project: { __v: 0, voteCount: 0, popularity: 0, adult: 0 } },
        ];

    const result = await this.contentModel.aggregate(pipeline);
    return result;
  }

  async getLatestContent(
    skip: number,
    limit: number = 10,
    contentType: 'tv' | 'movie',
  ) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          ...(contentType && { contentType }),
        },
      },
      { $sort: { releaseDate: -1 } },
      { $skip: +skip },
      { $limit: +limit },
      { $project: { __v: 0, voteCounte: 0, popularity: 0, adult: 0 } },
    ];
    const result = await this.contentModel.aggregate(pipeline);
    return result;
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

  async findContentGenreIds(contentId: string) {
    const genreIds = await this.contentModel.findById(contentId, {
      genreIds: 1,
    });
    return genreIds;
  }
}
