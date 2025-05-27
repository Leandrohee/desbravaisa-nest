import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface ValidateProps {
  sub: string;
  email: string;
  msg: string;
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  //refresh-jwt is the name that goes in the guard
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_JWT_SECRET || '',
    });
  }

  //This payload come from jwt decode
  async validate(payload: ValidateProps): Promise<ValidateProps> {
    //returning the payload
    return {
      sub: payload.sub,
      email: payload.email,
      msg: 'Pass by refresjwt-strategy',
    };
  }
}
