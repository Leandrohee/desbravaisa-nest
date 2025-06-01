import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { TestApiService } from './test-api.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { JwtCookieGuard } from 'src/auth/guard/jwt-cookie.guard';
import { Request } from 'express';

@Controller('test-api')
export class TestApiController {
  constructor(private testapiservice: TestApiService) {}

  //Route localhost:3000/test-ai/
  @Get('')
  getTestApi() {
    return this.testapiservice.getResponse();
  }

  //Route localhost:3000/test-api/cat
  @UseGuards(JwtGuard)
  @Get('cat')
  getCat(@Req() req: Request) {
    return this.testapiservice.getCat(req);
  }

  //Route localhost:3000/test-api/dog
  @UseGuards(JwtGuard)
  @Get('dog')
  getDog(@Body() body: any) {
    return this.testapiservice.getDog(body);
  }

  //Route localhost:3000/test-api/pig
  @UseGuards(JwtCookieGuard)
  @Get('pig')
  getPig() {
    return 'This is a pig';
  }
}
