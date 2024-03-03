import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session'
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.use(cookieParser());
  app.enableCors({
    origin: true ,
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);

}
bootstrap();
