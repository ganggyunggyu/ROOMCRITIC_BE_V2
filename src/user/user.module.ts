import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { GenreScoreSchema } from '../genre-score/schema/genre-scores.schema';
import { GenreScoreService } from 'src/genre-score/genre-score.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'GenreScore', schema: GenreScoreSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtService, GenreScoreService],
})
export class UserModule {}
