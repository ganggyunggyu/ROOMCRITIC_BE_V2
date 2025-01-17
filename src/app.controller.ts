import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/aws-test')
  test() {
    return true;
  }
}
