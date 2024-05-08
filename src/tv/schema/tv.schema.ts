import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Tv extends Document {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  content_type: string;

  @Prop({ required: false })
  adult: boolean;

  @Prop({ required: false })
  backdrop_path: string;

  @Prop({ required: false })
  genre_ids: number[];

  @Prop({ required: false })
  original_language: string;

  @Prop({ required: false })
  original_title: string;

  @Prop({ required: false })
  overview: string;

  @Prop({ required: false })
  popularity: number;

  @Prop({ required: false })
  poster_path: string;

  @Prop({ required: false })
  release_date: Date;

  @Prop({ required: true }) //name
  title: string;

  @Prop({ required: false })
  video: boolean;

  @Prop({ required: false })
  vote_average: number;

  @Prop({ required: false })
  vote_count: number;
}

export const TvSchema = SchemaFactory.createForClass(Tv);
