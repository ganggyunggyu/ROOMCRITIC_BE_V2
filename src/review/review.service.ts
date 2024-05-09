import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { Model, Types } from 'mongoose';
import {
  FindMovieReviewsDTO,
  ReviewCreateDTO,
  ReviewUpdateDTO,
} from './dto/request';
import { lessCursorQuery } from 'src/shared/paginate/cursor-paginate';

@Injectable()
export class ReviewService {
  constructor(@InjectModel('Review') private reviewModel: Model<Review>) {}

  async findUserReviews(
    userId: string,
    limit: number = 10,
    cursor: string = null,
  ) {
    const query = cursor ? { _id: { $lt: cursor } } : {};
    const objectIdByUserId = new Types.ObjectId(userId);

    const result = await this.reviewModel
      .find({ userId: objectIdByUserId, ...query })
      .limit(limit)
      .sort({ _id: -1 })
      .exec();
    return result;
  }

  async findLatestReviews(limit: number = 10, cursor: string = null) {
    const query = lessCursorQuery(cursor);
    const result = await this.reviewModel
      .find({ ...query })
      .limit(limit)
      .sort({ _id: -1 })
      .exec();
    return result;
  }

  async findDetailReview(reviewId: string) {
    const result = await this.reviewModel.findById(reviewId);
    return result;
  }

  async findContentReviews(
    limit: number = 10,
    cursor: string = null,
    contentType: string,
    contentId: string,
  ) {
    const query = lessCursorQuery(cursor);
    const result = await this.reviewModel
      .find(
        {
          contentType: contentType,
          contentId: contentId,
        },
        query,
      )
      .limit(limit)
      .sort({ _id: -1 })
      .exec();
    return result;
  }

  async findTvReviews(limit: number = 10, cursor: string = null) {
    const query = lessCursorQuery(cursor);
    const result = await this.reviewModel
      .find({ contentType: 'tv', ...query })
      .limit(limit)
      .sort({ _id: -1 })
      .exec();
    return result;
  }

  async findMovieReviews(findMovieReviewsDTO: FindMovieReviewsDTO) {
    const query = lessCursorQuery(findMovieReviewsDTO.cursor);
    const result = await this.reviewModel
      .find({
        contentType: findMovieReviewsDTO.contentType,
        ...query,
      })
      .limit(findMovieReviewsDTO.limit)
      .sort({ _id: -1 })
      .exec();
    return result;
  }
  async findReviewsByContentType(
    limit: number = 10,
    cursor: string = null,
    contentType: string,
  ) {
    const query = lessCursorQuery(cursor);
    const result = await this.reviewModel
      .find({
        contentType: contentType,
        ...query,
      })
      .limit(limit)
      .sort({ _id: -1 })
      .exec();
    return result;
  }

  async addReview(reviewCreateDTO: ReviewCreateDTO) {
    return reviewCreateDTO;
  }

  async removeReview(reviewId: string) {
    return reviewId;
  }

  async updateReview(reviewUpdateDTO: ReviewUpdateDTO) {
    return reviewUpdateDTO;
  }
}
