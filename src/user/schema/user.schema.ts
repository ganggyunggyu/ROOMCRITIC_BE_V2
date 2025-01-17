import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ required: true })
  displayName: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  role: string;

  @Prop({ type: String, default: null })
  refreshToken: string | null;

  @Prop({ type: Number, default: 0 })
  reviewCount: number;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'Content' }],
    default: [],
  })
  favoriteContentList: mongoose.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'Content' }],
    default: [],
  })
  viewedContentList: mongoose.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'Content' }],
    default: [],
  })
  wishContentList: mongoose.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'Review' }],
    default: [],
  })
  favoriteReviewList: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
