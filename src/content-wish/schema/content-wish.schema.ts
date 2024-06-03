import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export type ContentWishSchema = ContentWish & Document;

@Schema({ timestamps: true })
export class ContentWish {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Content' })
  contentId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;
}

export const ContentWishSchema = SchemaFactory.createForClass(ContentWish);
