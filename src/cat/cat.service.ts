import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from './schema/cat.schema';
import { Model } from 'mongoose';

@Injectable()
export class CatService {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  async allCat() {
    const result = await this.catModel.find({});
    return result;
  }
}
