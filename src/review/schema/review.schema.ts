import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Content' })
  contentId: MongooseSchema.Types.ObjectId;

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
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
