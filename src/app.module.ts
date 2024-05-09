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
import { SessionModule } from 'nestjs-session';
import { GenreScoreModule } from './genre-score/genre-score.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    SessionModule.forRoot({
      session: { secret: process.env.SESSION_SECRET },
    }),

    AuthModule,
    TvModule,
    MovieModule,
    ContentModule,
    UserModule,
    ReviewModule,
    GenreScoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
