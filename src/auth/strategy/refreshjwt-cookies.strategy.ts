/* -- THIS STRATEGY IS RESPONSIBLE FOR VERIFYNG THE AUTHENTICITY OF THE TOKEN FROM THE COOKIES -- */

/**
 * In comparision to the normal jwtstategy this one stract the jwt from the cookies.
 *
 * In order to this strategy to work i had to install cookie-parser
 *
 * Insomnia storage the cookies automatcly
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

interface ValidateProps {
  sub: string;
  email: string;
}

//Creating a custom extractor to get the jwt from cookies
const extractJwtFromCookie = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['refresh_token'];
  }
  return token;
};

@Injectable()
export class RefreshJwtCookieStrategy extends PassportStrategy(
  Strategy,
  'refreshjwt-cookie',
) {
  constructor() {
    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_JWT_SECRET || '',
    });
  }

  //This payload came from the jwt extracter from cookies is pass to user in Req.user
  async validate(payload: ValidateProps): Promise<ValidateProps> {
    return {
      sub: payload.sub,
      email: payload.email,
    };
  }
}
