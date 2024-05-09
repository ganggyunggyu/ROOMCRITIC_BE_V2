import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GenreScore } from './schema/genre-scores.schema';

@Injectable()
export class GenreScoreService {
  constructor(
    @InjectModel('GenreScore')
    private readonly genreScoreModel: Model<GenreScore>,
  ) {}

  async findUserScore(userId: string) {
    const objectIdByUserId = new Types.ObjectId(userId);
    const result = await this.genreScoreModel.findOne({
      user_id: objectIdByUserId,
    });
    console.log(result);
    return result;
  }
}
