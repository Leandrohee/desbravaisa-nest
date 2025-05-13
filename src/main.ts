/* ---------------------------- THIS IS THE MAIN FILE OF THE PROJECT ---------------------------- */
/* --------------------- IT USES APP.MODULE TO MANAGE ALL THE OTHERS MODULES -------------------- */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  console.log(`
    Server is running in: http://localhost:${process.env.PORT ?? 3000}  
  `);
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000); //The ""0.0.0.0"" accepts all types of connections
}
bootstrap();
