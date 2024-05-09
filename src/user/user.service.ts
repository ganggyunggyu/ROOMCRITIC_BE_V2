import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { JoinRequestDTO } from './dto/user.dto';
import { Err } from 'src/shared/error';
import { GenreScore } from '../genre-score/schema/genre-scores.schema';
import { GENRE_SCORES } from './constant/GENRE_SCORES';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(GenreScore.name)
    private readonly genreScoreModel: Model<GenreScore>,
  ) {}

  async localJoin(joinRequestDTO: JoinRequestDTO) {
    const isSameEmail = await this.userModel.findOne({
      email: joinRequestDTO.email,
    });
    if (isSameEmail) throw new Error('동일한 이메일이 있습니다.');
    const isSamePhoneNumber = await this.userModel.findOne({
      phoneNumber: joinRequestDTO.phoneNumber,
    });
    if (isSamePhoneNumber) throw new Error('동일한 휴대폰 번호가 있습니다.');
    try {
      const hashedPassword = await this.hashingPassword(
        joinRequestDTO.password,
      );
      const newUser = new this.userModel({
        ...joinRequestDTO,
        password: hashedPassword,
        role: 'user',
      });
      const saveUser = await newUser.save();

      const genreScore = new this.genreScoreModel({
        review_count: 0,
        genre_scores: GENRE_SCORES,
        user_id: saveUser._id,
      });
      await genreScore.save();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async hashingPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async authenticateUser(userLoginRequestDTO) {
    const user = await this.userModel.findOne({
      email: userLoginRequestDTO.email,
    });

    if (!user) throw new NotFoundException('존재하지 않는 이메일 입니다.');

    const isMatch = await this.comparePasswords(
      userLoginRequestDTO.password,
      user.password,
    );
    if (!isMatch)
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userModel
      .findOne({ email: email })
      .select('-password');
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    return user;
  }
  async findUserById(id: string) {
    const existingUser = await this.userModel.findById(id).select('-password');
    if (!existingUser) {
      throw new BadRequestException(Err.USER.NOT_FOUND);
    }
    return existingUser;
  }
  async findGenreScoreByUserId(userId: string) {
    return this.genreScoreModel.findOne({ userId: userId });
  }
}
