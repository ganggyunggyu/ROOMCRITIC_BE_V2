import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSchema } from 'src/movie/schema/movie.schema';
import { TvSchema } from 'src/tv/schema/tv.schema';
import { ReviewSchema } from 'src/review/schema/review.schema';
import { ContentWishService } from 'src/content-wish/content-wish.service';
import { ContentWishSchema } from 'src/content-wish/schema/content-wish.schema';
import { ContentSchema } from './schema/content.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Movie', schema: MovieSchema },
      { name: 'Tv', schema: TvSchema },
      { name: 'Review', schema: ReviewSchema },
      { name: 'ContentWish', schema: ContentWishSchema },
      { name: 'Content', schema: ContentSchema },
    ]),
  ],
  controllers: [ContentController],
  providers: [ContentService, ContentWishService],
})
export class ContentModule {}
