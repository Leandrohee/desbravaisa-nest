# Steps by steps to authenticate a user in NEST

1. Create the route for login the user and the dto related to user
2. Create the logic to generate the jwt once the user is verify and return to the front end
3. Store jwt in the frontend and send it in every request to the backend
4. Create strategy and guard for authenticate the acess_token
5. Working with refresh_token create: (route, method, guard and strategy). All related to refresh_token.

## 1. Creating the route for login the user

We build the route in the controller and we create the dto that is a class in a folder named dto.

### Libs necessary:

```bash
yarn add class-validator
yarn add class-transformer
```

-auth/dto/authPayload.dto.ts

```ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

- auth/auth.controller.ts

```ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';

//Route localhost:3000/auth
@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  //Route localhost:3000/auth/signin
  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authservice.signin(dto); //Login into an account
  }
}
```

We need to config the class-validator in the main file as weel with _ValidationPipe_

- src/main.ts

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log(`
    Server is running in: http://localhost:${process.env.PORT ?? 3000}  
  `);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); //To allow the class-validator
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0'); //The ""0.0.0.0"" accepts all types of connections
}
bootstrap();
```

## 2. Authenticatin the user and generating the jwt

We create the logic of authentication in the service.
Here we have 2 methods, one for authenticating the user and another to generate the jwt. If every runs correct we return the jwt back to the client (frontend).

### Libs necessary:

```bash
yarn add bcrypt
yarn add @types/bcrypt
yarn add @nestjs/jwt
```

- auth/auth.serveice.ts

```ts
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GentokenTypes, SigninDto, SignupDto } from './dto/authPayload.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class AuthService {
  /* --------------------------- RECIEVING SERVICES FROM OTHERS MODULES --------------------------- */
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  /* ---------------------- METHOD RELATED TO AUTHENTICATED A EXISTENT USER --------------------- */
  async signin(dto: SigninDto) {
    try {
      //Verify is the user exists
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (!user) throw new Error('Credentials invalid');

      //Verify the password
      const isPasswordValid = await bcrypt.compare(dto.password, user.hash);
      if (!isPasswordValid) throw new Error('Credentials invalid');

      //Generating the token using the gentoken function and returning to the client
      return this.gentoken({
        email: user.email,
        codUser: user.cod_user,
      });
    } catch (error) {
      // throw new ForbiddenException(error.message); //Error 403 -> Server know who i'm
      throw new UnauthorizedException(error.message); //Error 401 -> Server dont know who i'm
    }
  }

  /* -------------------------- METHOD RELATED TO GENERATE A JWT TOKEN -------------------------- */
  private async gentoken({
    email,
    codUser,
  }: GentokenTypes): Promise<{ access_token: string }> {
    const payload = {
      sub: codUser, //sub is a convention name in Jwt for a unique value, in this case the user id
      email: email,
    };

    try {
      //Loading the jwt secret from the env
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) throw new Error('Secret not found!');

      //Generating and storing the jwt token
      const token = await this.jwt.signAsync(payload, {
        secret: jwtSecret,
        expiresIn: '1h',
      });

      //Returning the generate token
      return { access_token: token };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
```

### Now we can test the authentication in insomnia through the route

- POST: http://localhost:3000/auth/signin
- Body:

```json
{
  "email": "leandrohenrique_@live.com",
  "password": "123"
}
```

- Result (example):

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoibGVhbmRyb2hlbnJpcXVlX0BsaXZlLmNvbSIsImlhdCI6MTc0ODAzOTQ1NiwiZXhwIjoxNzQ4MDQzMDU2fQ.deVsqs5agT-xYFW63ORTWcXi_SbBmtXOSp6D4nG2ybo"
}
```

## 3. Sending the data to the backend with NEXT (headers)

### With insomnia

Headers:

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....

### With NextJS

## 4. Creating the strategy and guard

A strategy is a middleware that uses passport to verify if the jwt in the heares is valid.

The strategy works with guards

### Libs necessary:

```bash
yarn add @nestjs/passport
yarn add @types/passport-jwt
yarn add passport
yarn add passport-jwt
```

- auth/strategy/jwt.strategy.ts

```ts
import { Injectable } from '@nestjs/common';
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
      secretOrKey: process.env.JWT_SECRET || '',
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
```

The 'jwt' in AuthGuard has to match with the 'jwt' in the PassportStrategy

- auth/guard/jwt.guard.ts

```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
```

Provide the JwtStrategy in the auth.module.ts

```ts
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [PrismaModule, JwtModule.register({})], //Importing JwtModule here to use in this module
  providers: [AuthService, JwtStrategy], //Provide the JwtStrategy
  controllers: [AuthController],
})
export class AuthModule {}
```

## 5. Adding refresh_token

The refresh_token is a long-lived token that takes longer to expires in comparasion to the access_token. When the access_token expires the refresh_token generate a new one.

5.1 - Create route for the refresh method

This route is protected by a expecific guard and strategy only for refresh token. It is differente from the normal jwtGuard that is set up to work with access_tokens.

```ts
//Route localhost:3000/auth/refresh
@UseGuards(RefreshJwtGuard)
@Post('refresh')
refresh(@Req() req: Request) {
  return this.authservice.refresh(req);
}
```

5.2 - Creating the method for dealing with the logic to generate and return the new access_token.

```ts
async refresh(req: Request) {
  //This payload is coming from refreshjwtstrategy
  const refreshJwtSecret = process.env.REFRESH_JWT_SECRET;
  const payload = req.user ?? '';

  try {
    if (!refreshJwtSecret) throw new Error('Secret not found');

    //Generating and storing the jwt acess_token and refresh_token
    const access_token = await this.jwt.signAsync(payload, {
      secret: refreshJwtSecret,
      expiresIn: '1h',
    });

    return { access_token };
  } catch (error) {
    throw new UnauthorizedException(error.message);
  }
}
```
