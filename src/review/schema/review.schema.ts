import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, required: true })
  contentId: string;

  @Prop({ type: String, required: true })
  userName: string;

  @Prop({ type: String, required: true })
  lineReview: string;

  @Prop({ type: String, default: '' })
  longReview: string;

  @Prop({ type: Number, required: true })
  grade: number;

  @Prop({ type: String, required: true })
  contentPosterImg: string;

  @Prop({ type: String, required: true })
  contentBackdropImg: string;

  @Prop({ type: String, required: true })
  contentName: string;

  @Prop({ type: String, required: true })
  contentType: string;

  @Prop({ type: Number, default: 0 })
  like: number;

  @Prop({ type: Date, default: Date.now })
  createTime: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
