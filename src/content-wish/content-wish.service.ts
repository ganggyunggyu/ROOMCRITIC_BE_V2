import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ContentWish } from './schema/content-wish.schema';
import { Model } from 'mongoose';

@Injectable()
export class ContentWishService {
  constructor(
    @InjectModel('ContentWish') private contentWishModel: Model<ContentWish>,
  ) {}

  async findWishContent(userId, contnetId) {
    const result = await this.contentWishModel.exists({
      userId: userId,
      contentId: contnetId,
    });
    return result !== null;
  }

  async addContentWish(userId: string, contentId: string) {
    const newContentWish = await this.contentWishModel.create({
      userId: userId,
      contentId: contentId,
    });
    return newContentWish;
  }
  async removeContentWish(userId: string, contentId: string) {
    const result = await this.contentWishModel.deleteOne({
      userId: userId,
      contentId: contentId,
    });
    return result;
  }
  async findWishContentByUser(userId) {
    const result = await this.contentWishModel.countDocuments({
      userId: userId,
    });

    return result;
  }
}
