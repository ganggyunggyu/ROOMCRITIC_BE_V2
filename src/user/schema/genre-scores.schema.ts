import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type GenreScoreDocument = GenreScore & Document;

@Schema()
export class GenreScore {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  review_count: number;

  @Prop([
    {
      genre_id: { type: Number, required: true },
      genre_name: { type: String, required: true },
      score: { type: Number, required: true },
      count: { type: Number, required: true },
    },
  ])
  genre_scores: {
    genre_id: number;
    genre_name: string;
    score: number;
    count: number;
  }[];
}

export const GenreScoreSchema = SchemaFactory.createForClass(GenreScore);
