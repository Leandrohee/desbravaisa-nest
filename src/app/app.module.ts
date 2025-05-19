/**
 * This is the main module of the project
 * It works directly with main.ts
 * All the others modules has to be imported here
 */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestApiModule } from 'src/test-api/test-api.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [TestApiModule, PrismaModule], //PrismaModule has to be in here to be broadcast
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

/* ---------------------------------------- INFORMATIONS ---------------------------------------- */
/*
The basic structure of a model in NestJs is this:

import { Module } from "@nestjs/common";
import { TestModule } from './test/test.module';
import { PrismaModule } from './prisma/prisma.module';

  @Module({})
  export class AppModule{}


To generate a model automaticly you can use this comand in the terminal:
nest g module nameofthemodule
  */
