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
  iat: string;
  exp: string;
}

//Creating a custom extractor to get the jwt from cookies
const extractJwtFromCookie = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
};

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookie',
) {
  constructor() {
    super({
      jwtFromRequest: extractJwtFromCookie, //Using the custom extractor
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '',
    });
  }

  //This payload came from the jwt extracted from cookies
  async validate(payload: ValidateProps): Promise<ValidateProps> {
    return {
      sub: payload.sub,
      email: payload.email,
      iat: new Date(Number(payload.iat) * 1000).toLocaleTimeString(), //transforming the Unix timestamp to a time in my local time
      exp: new Date(Number(payload.exp) * 1000).toLocaleTimeString(), //transforming the Unix timestamp to a time in my local time
    };
  }
}
