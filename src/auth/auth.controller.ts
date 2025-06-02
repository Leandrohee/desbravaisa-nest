import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto/authPayload.dto';
import { Request, Response } from 'express';
import { RefreshJwtCookieGuard } from './guard/refreshjwt-cookie.guard';

//Route localhost:3000/auth
@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  //Route localhost:3000/auth/signup
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authservice.signup(dto); //Create account
  }

  //Route localhost:3000/auth/signin
  @Post('signin')
  signin(@Body() dto: SigninDto, @Res({ passthrough: true }) res: Response) {
    return this.authservice.signin(dto, res); //Login into an account
  }

  //Route localhost:3000/auth/refresh
  @UseGuards(RefreshJwtCookieGuard)
  @Post('refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authservice.refresh(req, res);
  }
}

/**
 * We can tests all this routes in insomnia
 */
