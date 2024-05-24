import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  // async getAuthenticateOptions(context: ExecutionContext) {
  //   console.log(context.switchToHttp());
  // }
}
