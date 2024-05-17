import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type GenreScoreDocument = GenreScore & Document;

@Schema()
export class GenreScore {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  genreId: number;

  @Prop({ required: true })
  genreName: string;

  @Prop({ required: true, default: 0 })
  score: number;

  @Prop({ required: true, default: 0 })
  count: number;
}

export const GenreScoreSchema = SchemaFactory.createForClass(GenreScore);
