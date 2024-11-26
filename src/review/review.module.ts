import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewSchema } from './schema/review.schema';
import { GenreScoreSchema } from 'src/genre-score/schema/genre-scores.schema';
import { UserSchema } from 'src/user/schema/user.schema';
import { GenreScoreService } from 'src/genre-score/genre-score.service';
import { MovieSchema } from 'src/movie/schema/movie.schema';
import { TvSchema } from 'src/tv/schema/tv.schema';
import { ContentService } from 'src/content/content.service';
import { ContentSchema } from 'src/content/schema/content.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Review', schema: ReviewSchema },
      { name: 'GenreScore', schema: GenreScoreSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Movie', schema: MovieSchema },
      { name: 'Tv', schema: TvSchema },
      { name: 'Content', schema: ContentSchema },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, GenreScoreService, ContentService],
})
export class ReviewModule {}
