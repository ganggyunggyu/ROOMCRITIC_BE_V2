import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenreScore } from './schema/genre-scores.schema';
import { getGenreName } from 'src/user/constant/GENRE_SCORES';

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
          score: { $ne: 0 },
        },
        { genreName: 1, count: 1, score: 1 },
      )
      .sort({ score: -1 });

    return result;
  }

  async addGenreScore(genreIds: number[], grade: number, userId: string) {
    for (let i = 0; i < genreIds.length; i++) {
      const genreId = genreIds[i];

      await this.genreScoreModel.updateOne(
        { userId: userId, genreId: genreId },
        {
          $inc: { score: grade, count: 1 },
          $setOnInsert: { genreName: getGenreName(genreId) },
        },
        { upsert: true },
      );
    }
  }
  async subtractGenreScore(genreIds: number[], grade: number, userId: string) {
    for (let i = 0; i < genreIds.length; i++) {
      const genreId = genreIds[i];

      await this.genreScoreModel.updateOne(
        { userId: userId, genreId: genreId },
        {
          $inc: { score: -grade, count: -1 },
          $setOnInsert: { genreName: getGenreName(genreId) },
        },
        { upsert: true },
      );
    }
  }
  async updateGenreScore(genreIds: number[], grade: number, userId: string) {
    for (let i = 0; i < genreIds.length; i++) {
      const genreId = genreIds[i];

      await this.genreScoreModel.updateOne(
        { userId: userId, genreId: genreId },
        {
          $inc: { score: grade },
          $setOnInsert: { genreName: getGenreName(genreId) },
        },
        { upsert: true },
      );
    }
  }
}
