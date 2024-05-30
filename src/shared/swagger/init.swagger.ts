import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('RoomCritic BeckEnd')
  .setDescription('룸크리틱 백엔드 API 명세')
  .setVersion('2.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      name: 'JWT',
      description: 'Enter JWT',
      in: 'header',
    },
    'token',
  )
  .build();
