import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Content extends Document {
  @Prop({ type: Number, required: true, unique: false })
  id: number;

  @Prop({ type: String, required: false })
  contentType: string;

  @Prop({ type: Boolean, required: false })
  adult: boolean;

  @Prop({ type: String, required: false })
  backdropPath: string;

  @Prop({ type: [Number], required: false })
  genreIds: number[];

  @Prop({ type: String, required: false })
  originalLanguage: string;

  @Prop({ type: String, required: false })
  originalTitle: string;

  @Prop({ type: String, required: false })
  overview: string;

  @Prop({ type: Number, required: false })
  popularity: number;

  @Prop({ type: String, required: false })
  posterPath: string;

  @Prop({ type: Date, required: false })
  releaseDate: Date;

  @Prop({ type: String, required: false })
  title: string;

  @Prop({ type: Boolean, required: false })
  video: boolean;

  @Prop({ type: Number, required: false })
  voteAverage: number;

  @Prop({ type: Number, required: false })
  voteCount: number;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
