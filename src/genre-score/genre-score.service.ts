import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenreScore } from './schema/genre-scores.schema';

@Injectable()
export class GenreScoreService {
  constructor(
    @InjectModel('GenreScore')
    private readonly genreScoreModel: Model<GenreScore>,
  ) {}

  async findUserScore(userId: string) {
    const result = await this.genreScoreModel
      .find(
        {
          userId: userId,
        },
        { genreName: 1, count: 1, score: 1 },
      )
      .sort({ score: -1 });

    return result;
  }
}
