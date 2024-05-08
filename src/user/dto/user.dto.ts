import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'test' })
  password: string;
}

export class JoinRequestDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@test.test' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1234Qwer!' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '강경고' })
  displayName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '010-1234-1234' })
  phoneNumber: string;

  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({ example: '010-1234-1234' })
  // phoneNumber: string;
}
