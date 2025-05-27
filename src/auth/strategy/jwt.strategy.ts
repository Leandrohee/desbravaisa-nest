/* ----- THIS FILE IS RESPONSIBLE FOR VERIFYING THE AUTHENTICITY OF THE TOKEN IN THE HEADERS ----- */
/* --------------------------- IT WORKS WITH GUARDS TO PROTECT ROUTES --------------------------- */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface ValidateProps {
  sub: string;
  email: string;
  iat: string;
  exp: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  //"jwt" is the name that goes in the guard
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // this will trigger error if expired
      secretOrKey: process.env.JWT_SECRET || '',
    });
  }

  //THis payload como from the jwt
  async validate(payload: ValidateProps): Promise<ValidateProps> {
    //Returning the payload
    return {
      sub: payload.sub,
      email: payload.email,
      iat: new Date(Number(payload.iat) * 1000).toLocaleTimeString(), //transforming the Unix timestamp to a time in my local time
      exp: new Date(Number(payload.exp) * 1000).toLocaleTimeString(), //transforming the Unix timestamp to a time in my local time
    };
  }
}

/**
 * The validate method inject date related to the user to the request
 *
 * The retrieve this date, use the method get from express like this:
 *
 * @Get()
 * @useGuards(JwtGuard)
 * cat(@Req() res: Request){
 *  return this.testapi.getcat(req.user)
 * }
 *
 *
 * The 'req.user' is the data from validate
 */
