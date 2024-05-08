import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { LoginRequestDTO } from '../../user/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const loginRequestDTO: LoginRequestDTO = {
      email: email,
      password: password,
    };
    const user = await this.userService.authenticateUser(loginRequestDTO);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
