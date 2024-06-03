import { Module } from '@nestjs/common';
import { ContentWishService } from './content-wish.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentWishSchema } from './schema/content-wish.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ContentWish', schema: ContentWishSchema },
    ]),
  ],
  providers: [ContentWishService],
})
export class ContentWishModule {}
