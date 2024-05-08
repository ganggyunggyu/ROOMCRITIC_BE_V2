// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class LocalAuthGuard extends AuthGuard('local') {}
// local-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);

    if (can) {
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);
    }
    return true;
  }
}

/**
 * 
  여기서 await super.canActivate(context) 함수를 통해서 LocalStrategy의 validate 함수로 들어간다.
  LocalStrategy에서 빠져나온 후, request를 받아서 super.logIn(request) 함수를 실행시키는데,
  이 함수를 통해 LocalSerializer의 serializeUser 함수로 들어간다.
 * 
 */
