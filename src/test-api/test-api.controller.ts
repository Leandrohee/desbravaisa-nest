import { Controller, Get, UseGuards } from '@nestjs/common';
import { TestApiService } from './test-api.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

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
  getCat() {
    return this.testapiservice.getCat();
  }

  //Route localhost:3000/test-api/dog
  @Get('dog')
  getDog() {
    return this.testapiservice.getDog();
  }
}
