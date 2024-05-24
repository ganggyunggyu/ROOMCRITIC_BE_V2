import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TvModule } from './tv/tv.module';
import { MovieModule } from './movie/movie.module';
import { ContentModule } from './content/content.module';
import { UserModule } from './user/user.module';
import { ReviewModule } from './review/review.module';

import { GenreScoreModule } from './genre-score/genre-score.module';
import { ReviewLikeModule } from './review-like/review-like.module';
import { ContentWishModule } from './content-wish/content-wish.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AuthModule,
    TvModule,
    MovieModule,
    ContentModule,
    UserModule,
    ReviewModule,
    GenreScoreModule,
    ReviewLikeModule,
    ContentWishModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
