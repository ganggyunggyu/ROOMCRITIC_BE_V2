import { Injectable } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { Movie } from 'src/movie/schema/movie.schema';
import { Review } from 'src/review/schema/review.schema';
import { Tv } from 'src/tv/schema/tv.schema';
import { Content } from './schema/content.schema';
import { getGenreName } from 'src/user/constant/GENRE_SCORES';
import { typeMatch } from './lib/typeMatch';
import { User } from 'src/user/schema/user.schema';

export const searchContentProject: PipelineStage = {
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
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
    @InjectModel('Content') private contentModel: Model<Content>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async getContentByOneWithReview(contentId: string) {
    const content = await this.contentModel.findById(contentId);
    const reviews = await this.reviewModel.find({ contentId: contentId });
    const result = { content, reviews };
    return result;
  }

  async getSearchContent(
    searchValue: string,
    contentType: 'tv' | 'movie' | 'all',
  ): Promise<any[]> {
    const match = typeMatch(contentType);

    try {
      const pipeline: PipelineStage[] = [
        {
          $search: {
            index: 'content_search_index',
            compound: {
              should: [
                {
                  text: {
                    query: searchValue,
                    path: 'title',
                    fuzzy: { maxEdits: 1 },
                  },
                },
                { text: { query: searchValue, path: 'genreIds' } },
              ],
              minimumShouldMatch: 1,
            },
          },
        },
        { $addFields: { score: { $meta: 'searchScore' } } },
        { $sort: { score: -1 } },
        // { $limit: 10 },
        match,
        searchContentProject,
      ];

      const result = await this.contentModel.aggregate(pipeline);

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
    return { contentList: result };
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
    return { contentList: result };
  }

  async getRecentlyReviewCreateContent(
    skip: number,
    limit: number = 10,
    contentType: 'tv' | 'movie',
  ) {
    try {
      const recentlyCreateReviewContentList = [];

      const recentlyCreateReviewByContentIdList =
        await this.reviewModel.aggregate([
          {
            $match: {
              ...(contentType && { contentType }),
            },
          },
          {
            $group: { _id: '$contentId', createdAt: { $first: '$createdAt' } },
          },
          { $sort: { createdAt: -1 } },
          { $skip: +skip },
          { $limit: limit },
          { $project: { contentId: '$contentId' } },
        ]);

      for (const contentIdObject of recentlyCreateReviewByContentIdList) {
        const content = await this.contentModel.findById(contentIdObject);
        recentlyCreateReviewContentList.push(content);
      }

      return { contentList: recentlyCreateReviewContentList };
    } catch (error) {
      console.error(error);
    }
  }

  async getContentGenreIds(contentId: string) {
    const genreIds = await this.contentModel.findById(contentId, {
      genreIds: 1,
    });
    return genreIds;
  }

  async contentWish(contentId: string, userId: string) {
    const content = await this.contentModel.findById(contentId);

    const user = await this.userModel.findById(userId);
    const userWishList = [...user.wishContentList];

    const contentObjectId = new mongoose.Types.ObjectId(String(content._id));

    const isMatch = userWishList.includes(contentObjectId);

    if (isMatch) {
      const updateUser = userWishList.filter(
        (contentId) => contentId === content._id,
      );
    }

    if (!isMatch) {
      const updateUser = user.wishContentList.push(contentObjectId);
    }
  }

  async getContentFilter(userId: string) {}
}
