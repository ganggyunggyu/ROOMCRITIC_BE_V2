import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { Model, Types } from 'mongoose';
import {
  FindMovieReviewsDTO,
  ReviewCreateDTO,
  ReviewUpdateDTO,
} from './dto/request';
import { lessCursorQuery } from 'src/shared/paginate/cursor-paginate';
import { ReviewLike } from './schema/review-like.schema';
import { Err } from 'src/shared/error';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Review') private reviewModel: Model<Review>,
    @InjectModel('ReviewLike') private reviewLikeModel: Model<ReviewLike>,
  ) {}

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
    const objectIdByContentId = new Types.ObjectId(contentId);
    const result = await this.reviewModel
      .find({
        contentType: contentType,
        contentId: objectIdByContentId,
        ...query,
      })
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

  // 테이블이 없는 경우 -> 좋아요 실어요 모두 없음
  // 테이블이 있는 경우
  //isLike true
  //isLike false

  async deleteDocument(_id) {
    await this.reviewLikeModel.findByIdAndDelete(_id);
  }

  async likeReview(reviewId: string, userId: string) {
    const isReviewLike = await this.reviewLikeModel.findOne({
      reviewId: reviewId,
      userId: userId,
    });

    if (!isReviewLike) {
      await this.reviewLikeModel.create({
        reviewId: reviewId,
        userId: userId,
        isLike: true,
      });
      return true;
    }

    if (isReviewLike.isLike === true) {
      await isReviewLike.deleteOne();
      throw new NotFoundException(Err.REVIEW.NOT_FOUND);
    }
    if (isReviewLike.isLike === false) {
      await isReviewLike.updateOne({ isLike: true });
      return true;
    }
  }

  async dislikeReview(reviewId: string, userId: string) {
    const isReviewLike = await this.reviewLikeModel.findOne({
      reviewId: reviewId,
      userId: userId,
    });

    if (!isReviewLike) {
      await this.reviewLikeModel.create({
        reviewId: reviewId,
        userId: userId,
        isLike: false,
      });
      return false;
    }

    if (isReviewLike.isLike === false) {
      await isReviewLike.deleteOne();
      throw new NotFoundException(Err.REVIEW.NOT_FOUND);
    }
    if (isReviewLike.isLike === true) {
      await isReviewLike.updateOne({ isLike: false });
      return false;
    }
  }

  async getReviewLike(reviewId: string, userId: string) {
    const result = await this.reviewLikeModel.findOne({
      reviewId: reviewId,
      userId: userId,
    });

    if (!result) throw new NotFoundException(Err.REVIEW.NOT_FOUND);
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
