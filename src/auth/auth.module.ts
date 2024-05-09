import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { GenreScoreSchema } from 'src/genre-score/schema/genre-scores.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'GenreScore', schema: GenreScoreSchema },
    ]),
    PassportModule,
  ],

  providers: [AuthService, UserService, JwtService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
