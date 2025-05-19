import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto';

//Route localhost:3000/auth
@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  //Route localhost:3000/auth/signup
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authservice.signup(dto); //Sending the data to AuthService
  }
}

/**
 * We can tests all this routes in insomnia
 */
