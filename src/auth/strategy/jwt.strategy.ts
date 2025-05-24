/* ----- THIS FILE IS RESPONSIBLE FOR VERIFYING THE AUTHENTICITY OF THE TOKEN IN THE HEADERS ----- */
/* --------------------------- IT WORKS WITH GUARDS TO PROTECT ROUTES --------------------------- */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface ValidateProps {
  sub: string;
  email: String;
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
      passReqToCallback: true, // enables access to raw token
    });
  }

  //Validating and returning the payload in every res router
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
