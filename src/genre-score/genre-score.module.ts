import { Module } from '@nestjs/common';
import { GenreScoreService } from './genre-score.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GenreScoreSchema } from './schema/genre-scores.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GenreScore', schema: GenreScoreSchema },
    ]),
  ],
  providers: [GenreScoreService],
})
export class GenreScoreModule {}
