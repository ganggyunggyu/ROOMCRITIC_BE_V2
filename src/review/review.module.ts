import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewSchema } from './schema/review.schema';
import { GenreScoreSchema } from 'src/genre-score/schema/genre-scores.schema';
import { UserSchema } from 'src/user/schema/user.schema';
import { GenreScoreService } from 'src/genre-score/genre-score.service';
import { ReviewLikeSchema } from './schema/review-like.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Review', schema: ReviewSchema },
      { name: 'ReviewLike', schema: ReviewLikeSchema },
      { name: 'GenreScore', schema: GenreScoreSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, GenreScoreService],
})
export class ReviewModule {}
