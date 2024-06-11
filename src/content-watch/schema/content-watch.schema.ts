import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export type ContentWatchSchema = ContentWatch & Document;

@Schema({ timestamps: true })
export class ContentWatch {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Content' })
  contentId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;
}

export const ContentWatchSchema = SchemaFactory.createForClass(ContentWatch);
