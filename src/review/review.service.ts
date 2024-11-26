import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import mongoose, { Model, Types } from 'mongoose';
import {
  FindMovieReviewsDTO,
  ReviewCreateDTO,
  ReviewUpdateDTO,
} from './dto/request';
import { lessCursorQuery } from 'src/shared/paginate/cursor-paginate';
import { ERROR } from 'src/shared/error';
import { GenreScore } from 'src/genre-score/schema/genre-scores.schema';
import { Movie } from 'src/movie/schema/movie.schema';
import { Tv } from 'src/tv/schema/tv.schema';
import { GenreScoreService } from 'src/genre-score/genre-score.service';
import { User } from 'src/user/schema/user.schema';
import { ContentService } from 'src/content/content.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly genreScoreService: GenreScoreService,
    private readonly contentService: ContentService,
    @InjectModel('Review') private reviewModel: Model<Review>,
    @InjectModel('Movie') private movieModel: Model<Movie>,
    @InjectModel('Tv') private tvModel: Model<Tv>,
    @InjectModel('GenreScore') private genreScoreModel: Model<GenreScore>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async getUserReviewLength(userId) {
    const userReviews = await this.reviewModel.find({ userId: userId });
    return userReviews.length;
  }
  async getContentReviewLength(contentId) {
    return (await this.reviewModel.find({ contentId: contentId })).length;
  }

  async getReviewByUser(
    userId: string,
    limit: number = 9,
    skip: number = null,
  ) {
    const objectIdByUserId = new Types.ObjectId(userId);

    const result = await this.reviewModel
      .find({ userId: objectIdByUserId })
      .limit(limit)
      .skip(skip)
      .sort({ _id: -1 })
      .exec();
    if (result.length === 0) return false;
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

  async getReviewById(reviewId: string) {
    const result = await this.reviewModel.findById(reviewId);
    return result;
  }

  async getReviewByContent(
    limit: number = 10,
    skip: number,
    contentId: string,
  ) {
    const objectIdByContentId = new Types.ObjectId(contentId);

    const result = await this.reviewModel
      .find({
        contentId: objectIdByContentId,
      })
      .limit(limit)
      .skip(skip)
      .sort({ _id: -1 })
      .exec();

    if (result.length === 0) return false;
    return result;
  }
  async getReviewByContentTemp(limit: number = 8, contentId: string) {
    const objectIdByContentId = new Types.ObjectId(contentId);
    const result = await this.reviewModel
      .find({
        contentId: objectIdByContentId,
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

  async likeReview(reviewId: string, userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const reviewObjectId = new mongoose.Types.ObjectId(reviewId);
    const [user, review] = [
      await this.userModel.findById(userObjectId),
      await this.reviewModel.findById(reviewObjectId),
    ];

    const isAleayLiked = user.favoriteReviewList?.includes(reviewObjectId);

    try {
      if (!isAleayLiked) {
        user.favoriteReviewList.push(reviewObjectId);
        review.like++;
        await user.save();
        await review.save();
        return {
          status: 200,
          isSuccess: true,
        };
      }
      if (isAleayLiked) {
        user.favoriteReviewList = user.favoriteReviewList.filter(
          (id) => !id.equals(reviewObjectId),
        );
        review.like--;
        await user.save();
        await review.save();
        return {
          status: 200,
          isSuccess: true,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        error: error,
        isSuccess: false,
      };
    }
  }

  async getReviewLike(reviewId: string, userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const reviewObjectId = new mongoose.Types.ObjectId(reviewId);
    const user = await this.userModel.findById(userObjectId);

    try {
      const isAleayLiked = user.favoriteReviewList?.includes(reviewObjectId);

      return isAleayLiked;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async addReview(reviewCreateDTO: ReviewCreateDTO) {
    try {
      const newReview = await this.reviewModel.create(reviewCreateDTO);

      const userId = newReview.userId.toString();

      await this.userModel.findByIdAndUpdate(userId, {
        reviewCount: await this.reviewModel.countDocuments({
          userId: userId,
        }),
      });

      const { genreIds } = await this.contentService.findContentGenreIds(
        newReview.contentId.toString(),
      );

      const { grade } = newReview;

      await this.genreScoreService.addGenreScore(genreIds, grade, userId);

      return newReview;
    } catch (error) {
      console.error('Failed to add review:', error);
      throw error;
    }
  }

  async removeReview(reviewId: string) {
    try {
      const review = await this.getReviewById(reviewId);
      if (!review) {
        throw new Error('Review not found');
      }

      const [userId, contentId] = [
        review.userId.toString(),
        review.contentId.toString(),
      ];

      const { genreIds } =
        await this.contentService.findContentGenreIds(contentId);

      const deleteResult = await this.reviewModel.findByIdAndDelete(reviewId);
      if (!deleteResult) {
        throw new Error('Failed to delete the review');
      }

      await this.userModel.findByIdAndUpdate(userId, {
        reviewCount: await this.reviewModel.countDocuments({
          userId: userId,
        }),
      });

      await this.genreScoreService.subtractGenreScore(
        genreIds,
        review.grade,
        userId,
      );

      return true;
    } catch (error) {
      console.error('Failed to remove review:', error);
      throw error;
    }
  }

  async updateReview(reviewUpdateDTO: ReviewUpdateDTO) {
    const prevScore = await this.reviewModel
      .findById(reviewUpdateDTO.reviewId)
      .distinct('grade');

    if (prevScore[0]) {
      const score = reviewUpdateDTO.grade - prevScore[0];
      const { genreIds } = await this.contentService.findContentGenreIds(
        (
          await this.getReviewById(reviewUpdateDTO.reviewId)
        ).contentId.toString(),
      );

      await this.genreScoreService.updateGenreScore(
        genreIds,
        score,
        reviewUpdateDTO.userId,
      );
    }

    await this.reviewModel.findByIdAndUpdate(
      reviewUpdateDTO.reviewId,
      reviewUpdateDTO,
    );
    return true;
  }

  async getAverageGrade(contentId) {
    const reviews = await this.reviewModel.find({ contentId: contentId });

    const length = reviews.length;
    const totalGrade = reviews.reduce((sum, review) => sum + review.grade, 0);
    const averageGrade = length ? totalGrade / length : 0;

    return {
      totalGrade,
      length,
      averageGrade: averageGrade.toFixed(2),
    };
  }
}
