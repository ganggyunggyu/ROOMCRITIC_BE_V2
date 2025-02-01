import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { LoginRequestDTO } from './dto/user.dto';

describe('UsersController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    const LOGIN_MOCK: LoginRequestDTO = {
      email: 'test@test.test',
      password: 'test',
    };
    controller.login(LOGIN_MOCK);

    expect(controller).toBeDefined();
  });
});
