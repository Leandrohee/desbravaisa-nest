/**
 *
 * This guard works with the refreshjwt-cookie strategy
 *
 * The name 'refreshjwt-cookie' has to be the same as in RefreshjwtCookieStrategy
 */

import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshJwtCookieGuard extends AuthGuard('refreshjwt-cookie') {
  //This function is the midlleware between the strategy and the method in the service. eg: auth.service
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      if (info.message == 'No auth token') {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}

/**
 * Testing this guard in this route:
 *
 * http://localhost:3000/auth/refresh
 *
 *
 */
