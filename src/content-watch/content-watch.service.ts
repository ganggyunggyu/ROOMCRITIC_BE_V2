import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentWatch } from './schema/content-watch.schema';

@Injectable()
export class ContentWatchService {
  constructor(
    @InjectModel('ContentWatch') private contentWatchModel: Model<ContentWatch>,
  ) {}

  async getContentWatch(userId, contentId) {
    const result = await this.contentWatchModel.findOne({
      userId: userId,
      contentId: contentId,
    });
    return result !== null;
  }

  async contentWatch() {}
  async contentUnwatch() {}
}
