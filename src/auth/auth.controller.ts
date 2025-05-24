import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto/authPayload.dto';

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
  signin(@Body() dto: SigninDto) {
    return this.authservice.signin(dto); //Login into an account
  }
}

/**
 * We can tests all this routes in insomnia
 */
