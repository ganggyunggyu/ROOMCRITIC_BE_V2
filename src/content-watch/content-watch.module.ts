import { Module } from '@nestjs/common';
import { ContentWatchService } from './content-watch.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentSchema } from 'src/content/schema/content.schema';
import { ContentWatchSchema } from './schema/content-watch.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Content', schema: ContentSchema },
      { name: 'ContentWatch', schema: ContentWatchSchema },
    ]),
  ],
  providers: [ContentWatchService],
})
export class ContentWatchModule {}
