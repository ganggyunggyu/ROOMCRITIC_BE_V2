import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Err } from 'src/shared/error';
import { JwtService } from '@nestjs/jwt';
import * as CryptoJS from 'crypto-js';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async validateUser(userLoginRequestDTO): Promise<any> {
    const user = await this.userService.authenticateUser(userLoginRequestDTO);
    if (user) return user;
    return null;
  }

  //JWT 생성
  async createAccessToken(user: User) {
    const payload = {
      type: 'accessToken',
      email: user.email,
      displayName: user.displayName,
      sub: user._id,
    };
    //JWT 표준과 일관성 유지를 위해 sub라는 속성 이름으로 userId를 보관
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '600s',
    });
    return accessToken;
  }

  async createRefreshToken(user: User) {
    const payload = {
      type: 'refreshToken',
      email: user.email,
      displayName: user.displayName,
      sub: user._id,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '20700m',
    });
    const tokenVerify = await this.tokenValidate(token);
    const tokenExp = new Date(tokenVerify['exp'] * 1000);
    const refreshToken = CryptoJS.AES.encrypt(
      JSON.stringify(token),
      process.env.AES_KEY,
    ).toString();

    await this.userModel.findByIdAndUpdate(user.id, {
      refreshToken: refreshToken,
    });

    return { refreshToken, tokenExp };
  }
  async tokenValidate(token: string) {
    return await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }
  async reissueRefreshToken(user: User) {
    const existingUser = await this.userModel.findOne({ _id: user._id });

    //토큰 식별자가 다른 경우
    if (!existingUser) {
      throw new BadRequestException(Err.USER.NOT_FOUND);
    }
    const payload = {
      type: 'refreshToken',
      email: user.email,
      displayName: user.displayName,
      sub: user._id,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      // expiresIn: '20700m',
      expiresIn: '10m',
    });
    const tokenVerify = await this.tokenValidate(token);
    const tokenExp = new Date(tokenVerify['exp'] * 1000);
    const current_time = new Date();
    const time_remaining = Math.floor(
      (tokenExp.getTime() - current_time.getTime()) / 1000 / 60 / 60,
    );

    //토큰의 유효 기간이 7일 이상인 경우 재발급 불가능
    if (time_remaining > 10) {
      throw new BadRequestException(Err.TOKEN.JWT_NOT_REISSUED);
    }

    const refresh_token = CryptoJS.AES.encrypt(
      JSON.stringify(token),
      process.env.AES_KEY,
    ).toString();

    await this.userModel.updateOne(
      { _id: user._id },
      { refreshToken: refresh_token },
    );
    const access_token = await this.createAccessToken(user);
    return { access_token, refresh_token: { refresh_token, tokenExp } };
  }
}
