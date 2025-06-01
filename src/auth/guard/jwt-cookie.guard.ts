/**
 *
 * This guard works with the jwt-cookie strategy
 *
 * The name 'jwt-cookie' has to be the same as in jwtCookieStrategy
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtCookieGuard extends AuthGuard('jwt-cookie') {}

/**
 * Testing this guard in this route:
 *
 * http://localhost:3000/test-api/pig
 *
 *
 */
