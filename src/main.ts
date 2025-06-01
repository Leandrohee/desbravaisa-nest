/* ---------------------------- THIS IS THE MAIN FILE OF THE PROJECT ---------------------------- */
/* --------------------- IT USES APP.MODULE TO MANAGE ALL THE OTHERS MODULES -------------------- */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log(`
    Server is running in: http://localhost:${process.env.PORT ?? 3000}  
  `);
  const app = await NestFactory.create(AppModule);

  // Optionally, if you have CORS configured, make sure to allow credentials
  app.enableCors({
    origin: 'http://localhost:5200', //The adress to the front-end
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // This is crucial for cookies to be sent/received across origins
  });

  // Enable cookie-parser middleware
  app.use(cookieParser());

  //To allow the class-validator
  app.useGlobalPipes(new ValidationPipe({}));

  //Listening to the server
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0'); //The ""0.0.0.0"" accepts all types of connections
}
bootstrap();
