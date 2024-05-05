import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TvModule } from './tv/tv.module';
import { MovieModule } from './movie/movie.module';
import { ContentModule } from './content/content.module';
import { CatModule } from './cat/cat.module';
import { UserModule } from './user/user.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AuthModule,
    TvModule,
    MovieModule,
    ContentModule,
    CatModule,
    UserModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
