import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import {
  JoinRequestDTO,
  LoginRequestDTO,
  GetRefreshTokenDTO,
} from './dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtRefreshGuard } from 'src/auth/guard/jwt-refresh.guard';
import {
  ApiSwaggerApiBody,
  ApiSwaggerApiParam,
} from 'src/shared/decorators/swagger.decorator';
import { GenreScoreService } from 'src/genre-score/genre-score.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

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
  @UseGuards(JwtRefreshGuard)
  async logout(@Req() req) {
    return this.authService.logout(req.user._id);
  }
  //Body로 refresh-token을 받아서 검증하여 access-token 재발급
  @Post('/auth/access-token')
  @UseGuards(JwtRefreshGuard)
  @ApiSwaggerApiBody(GetRefreshTokenDTO)
  async getAccessToken(
    @Body() getAccessTokenDTO: GetRefreshTokenDTO,
    @Req() req,
  ) {
    const accessToken = await this.authService.createAccessToken(req.user);
    // console.log(req);
    return { accessToken };
  }

  //Body로 refreshToken을 전달받음
  //유효기간이 7일 이내라면 재발급
  @Post('auth/refresh-token')
  @UseGuards(JwtRefreshGuard)
  @ApiSwaggerApiBody(GetRefreshTokenDTO)
  async reissuanceRefreshToken(
    @Body() getAccessTokenDTO: GetRefreshTokenDTO,
    @Req() req,
  ) {
    const refreshToken = await this.authService.reissueRefreshToken(req.user);

    return { refresh_token: refreshToken };
  }

  @Post('/join')
  async join(@Body() joinRequestDTO: JoinRequestDTO) {
    return this.userService.localJoin(joinRequestDTO);
  }

  @Get('/profile/id/:userId')
  // @UseGuards(JwtAuthGuard)
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
  @ApiSwaggerApiParam('userId', '6629e63db60f7e47ff09ccab')
  async findGenreScore(@Param('userId') userId: string) {
    return this.genreScoreService.findUserScore(userId);
  }

  @Get('/login-check')
  @UseGuards(JwtAuthGuard)
  async fetchAuthStatus(@Req() req) {
    console.log(req);
    return { ...req.user, isLoggedIn: true };
  }
}
