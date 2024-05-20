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

export class GetTokenByIdDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '6629e63db60f7e47ff09ccab' })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'U2FsdGVkX19z/gMaRWv/RAisIkqx4LOGRoFRlpg8r+rCi4zCIKdE/X6x+NCge2t5ewgo7nfilAukf+bmmNoSVuLB1k9MDGXnbeypNJ0YRxFCdlF+v1+M+HBzHXprMNhIwVrS8B3nzmkkewE/JQe2BTQKYx3TAATpDuBFQ4cb5QfjXzvC6g78c21t0VepZt+8a0soV/lOTCif7AqDccavBcfKC+Z4UDBefE17vXV3a4qdntCKEHFtN8pVBPfPSLTjsmgWc7/xTO2+L8zY6TcDahcJ3nAO+pHKaQtRGzMOiYZ4bMzHQEH6w1lUPWRIve1wyxnxW9JMdOgTQ5tCR/+wYxy4IQNzVE8h8pXs4iBgrLMkUmt0gphUP3X6Me9dAQ2c',
  })
  refreshToken: string;
}
export class GetRefreshTokenDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'U2FsdGVkX19z/gMaRWv/RAisIkqx4LOGRoFRlpg8r+rCi4zCIKdE/X6x+NCge2t5ewgo7nfilAukf+bmmNoSVuLB1k9MDGXnbeypNJ0YRxFCdlF+v1+M+HBzHXprMNhIwVrS8B3nzmkkewE/JQe2BTQKYx3TAATpDuBFQ4cb5QfjXzvC6g78c21t0VepZt+8a0soV/lOTCif7AqDccavBcfKC+Z4UDBefE17vXV3a4qdntCKEHFtN8pVBPfPSLTjsmgWc7/xTO2+L8zY6TcDahcJ3nAO+pHKaQtRGzMOiYZ4bMzHQEH6w1lUPWRIve1wyxnxW9JMdOgTQ5tCR/+wYxy4IQNzVE8h8pXs4iBgrLMkUmt0gphUP3X6Me9dAQ2c',
  })
  refreshToken: string;
}
