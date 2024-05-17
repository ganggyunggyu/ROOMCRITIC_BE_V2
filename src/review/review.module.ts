import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewSchema } from './schema/review.schema';
import { GenreScoreSchema } from 'src/genre-score/schema/genre-scores.schema';
import { UserSchema } from 'src/user/schema/user.schema';
import { GenreScoreService } from 'src/genre-score/genre-score.service';
import { ReviewLikeSchema } from './schema/review-like.schema';
import { MovieSchema } from 'src/movie/schema/movie.schema';
import { TvSchema } from 'src/tv/schema/tv.schema';
import { ContentService } from 'src/content/content.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Review', schema: ReviewSchema },
      { name: 'ReviewLike', schema: ReviewLikeSchema },
      { name: 'GenreScore', schema: GenreScoreSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Movie', schema: MovieSchema },
      { name: 'Tv', schema: TvSchema },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, GenreScoreService, ContentService],
})
export class ReviewModule {}
