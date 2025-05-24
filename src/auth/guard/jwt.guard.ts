/**
 * Creating a guard to protect routes
 *
 * The name 'jwt' has to match the 'jwt' in the strategy
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}

/**
 * Testing this guard in the module 'test-api' in the route
 *
 * http://localhost:3000/test-api/cat
 */
