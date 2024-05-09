import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSchema } from 'src/movie/schema/movie.schema';
import { TvSchema } from 'src/tv/schema/tv.schema';
import { ReviewSchema } from 'src/review/schema/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Movie', schema: MovieSchema },
      { name: 'Tv', schema: TvSchema },
      { name: 'Review', schema: ReviewSchema },
    ]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
