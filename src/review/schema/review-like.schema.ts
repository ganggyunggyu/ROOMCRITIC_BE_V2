import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export type ReviewLikeDocument = ReviewLike & Document;

@Schema({ timestamps: true })
export class ReviewLike {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Review' })
  reviewId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  userId: string;

  @Prop({ type: Boolean })
  isLike: boolean;
}

export const ReviewLikeSchema = SchemaFactory.createForClass(ReviewLike);
