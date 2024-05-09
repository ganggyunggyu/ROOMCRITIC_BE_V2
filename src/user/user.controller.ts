import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import {
  JoinRequestDTO,
  LoginRequestDTO,
  GetTokenByIdDTO,
} from './dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { JwtRefreshGuard } from 'src/auth/guard/jwt-refresh.guard';
import {
  ApiSwaggerApiBody,
  ApiSwaggerApiParam,
} from 'src/shared/decorators/swagger.decorator';
import { GenreScoreService } from 'src/genre-score/genre-score.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly genreScoreService: GenreScoreService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() loginRequestDTO: LoginRequestDTO) {
    const user = await this.userService.findUserByEmail(loginRequestDTO.email);
    const accessToken = await this.authService.createAccessToken(user);
    const refreshToken = await this.authService.createRefreshToken(user);
    const isLoggedIn = true;
    // const { email, displayName } = user;
    return { accessToken, refreshToken, userInfo: user, isLoggedIn };
  }

  @Post('auth/logout')
  async logout(@Body('userId') userId: string) {
    return this.authService.logout(userId);
  }
  //Body로 refresh-token을 받아서 검증하여 access-token 재발급
  @Post('/auth/access-token')
  @UseGuards(JwtRefreshGuard)
  @ApiSwaggerApiBody(GetTokenByIdDTO)
  async getAccessToken(@Body() getAccessTokenDTO: GetTokenByIdDTO) {
    const { userId } = getAccessTokenDTO;
    const user = await this.userService.findUserById(userId);

    const accessToken = await this.authService.createAccessToken(user);
    return { accessToken };
  }

  //Body로 refreshToken을 전달받음
  //유효기간이 7일 이내라면 재발급
  @Post('auth/refresh-token')
  @UseGuards(JwtRefreshGuard)
  @ApiSwaggerApiBody(GetTokenByIdDTO)
  async reissuanceRefreshToken(
    @Body() reissuanceRefreshTokenDTO: GetTokenByIdDTO,
  ) {
    const { userId } = reissuanceRefreshTokenDTO;

    const user = await this.userService.findUserById(userId);
    return await this.authService.reissueRefreshToken(user);
  }

  @Post('/join')
  async join(@Body() joinRequestDTO: JoinRequestDTO) {
    return this.userService.localJoin(joinRequestDTO);
  }

  @Get('/profile/id/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiSwaggerApiParam('userId', '6629e63db60f7e47ff09ccab')
  async findUserInfoById(@Param('userId') userId: string) {
    const userInfo = await this.userService.findUserById(userId);
    const genreScore = await this.genreScoreService.findUserScore(userId);

    return { userInfo, genreScore };
  }

  @Get('/profile/email/:email')
  // @UseGuards(JwtAuthGuard)
  @ApiSwaggerApiParam('email', 'test@test.com')
  async findUserInfoByEmail(@Param('email') email: string) {
    return this.userService.findUserByEmail(email);
  }

  @Get('/score/:userId')
  async findGenreScore(@Param() userId: string) {
    return this.userService.findGenreScoreByUserId(userId);
  }
}
