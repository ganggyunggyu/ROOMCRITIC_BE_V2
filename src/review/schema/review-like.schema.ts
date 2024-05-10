import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ReviewLikeDocument = ReviewLike & Document;

@Schema({ timestamps: true })
export class ReviewLike {
  @Prop({ type: Types.ObjectId, required: true })
  reviewId: string;

  @Prop({ type: Types.ObjectId, required: true })
  userId: string;

  @Prop({ type: Boolean })
  isLike: boolean;
}

export const ReviewLikeSchema = SchemaFactory.createForClass(ReviewLike);
