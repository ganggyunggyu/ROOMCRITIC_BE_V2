import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('RoomCritic Beck End')
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

  const document = SwaggerModule.createDocument(app, config);
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
