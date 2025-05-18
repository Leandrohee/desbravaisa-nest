# **REST API SERVER WITH NEST.JS**

# Installing nestJs

Use the documentation website: https://docs.nestjs.com/first-steps

# Cleaning the main folder

Delete this files, because you will not need them in the begining

- app.controller.spect.ts
- app.controller.ts
- app.service.ts

# Modules information

Models are used to connect functionalities of the project in small pieces
The basic structure of a model in NestJs is this:

```javascript
import { Module } from '@nestjs/common';

@Module({})
export class AppModule {}
```

You can also generate modules automaticly with the command:

```bash
nest g module nameofthemodule
```

# Controllers information

Controllers are use to handle routes in NestJs

```javascript
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}

  //route: /auth/signup
  @Post('signup')
  signup(){
    return this.authService.signup();
  };

  //route: auth/sigin
  @Post('signin')
  signin(){
    return this.authService.signin();
  }
}
```

# Services|Providers information

The services are responsable for the business logic of the project.

```javascript
@Injectable({})
export class AuthService {
  //Business logic that return an json
  signup() {
    return { msg: 'I have signup!' };
  }

  //Business logic that return an json
  signip() {
    return { msg: 'I have signin!' };
  }
}
```

# Testing the api

I'm using insomnia to test the api

# Installing and using prisma as the main ORM

```bash
yarn add prisma -D
yarn add @prisma/client
```

Run the cli to initiate prima in your project.
This create a prima folder in the project root and create some enviroments variabels

```bash
npx prisma init
```

Add the extension "prisma" to the project to better visualization of the code in schema.prisma

Set up the DATABASE_URL variable to enable prisma to connect to the database:

```sh
DATABASE_URL="postgresql://pg_user:pg_password@localhost:pg_port/pg_database?schema=public"

#Exemple
DATABASE_URL="postgresql://postgres:mypassisweak@54.234.125.107:5432/desbravaisa?schema=public"
```

To create models do this:

```bash
npx prisma --help              //To see all the comands
npx prisma migrate dev         //To generate the migration
npx prisma migrate deploy      //To apply existent migrations
npx prisma generate            //To crete typescript types for the models
npx prisma studio              //To run the studio version
```

# Providing prisma tools to all the project

To providing prisma tools and methos we need to create a prisma model and allow acess to the whole app.

1. Create the module folder with cli or manually

```bash
nest g module prisma
```

2. Set up **prisma.module.ts**

```typescript
@Module({
  providers: [PrismaService],
})
export class PrismaModule {}
```

3. Create and set up **prisma.service.ts**

```typescript
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
}
```

4. Exporting prisma module just **LOCALLY**

**prisma.module.ts**

```typescript
@Module({
  providers: [PrismaService],
  exports: [PrismaService], //Exporting PrismaServices locally
})
export class PrismaModule {}
```

5. Exporting prisma module **GLOBALLY**

**prisma.module.ts**

```typescript
@Global() //Exporting PrismaServices globally
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**app.module.ts**

```typescript
@Module({
  imports: [AuthModule, PrismaModule], //PrismaModule was to be in here to be broadcast globally
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

# Working with response from the post methods in rest API

To work with post methods in rest API with Nest we have to learn 3 topics:

- Dto -> Data Transfer Objects
- Pipes -> It converrt the return if needed
- Class-validator -> Verifies the return of the object

To learn more about pipes:
https://docs.nestjs.com/pipes#class-validator

Install class-validator in your project:

```bash
yarn add class-validator class-transformer
```

Example of using these 3 methodos (dto, pipes and class-validator)

**auth.controller.ts**

```typescript
//The route 'signup' is using dto for the return
@Post('signup')
signup(@Body() dto: SignupDto){
  return this.authService.signup()
};
```

**dto/index.ts**

```typescript
//Using class instead of interface for decorators
exoport class SignupDto{
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

**main.ts**

```typescript
//app.useGlobalPipes to allow class-validator
async function bootstrap() {
  console.log(`
    Server is running in: http://localhost:${process.env.PORT ?? 3000}
  `);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); //To allow the class-validator
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
```

# Jwt in Nest.Js

NestJs uses passport to work with JWT, so we need to install these packages first:

```bash
yarn add @nestjs/passport passport @nestjs/jwt passport-jwt
yarn add @types/passport-jwt -D
```

In the module that we are gonna use the JWT we have to import the JwtModule like that:

**auth.module.ts**

```typescript
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule.register({})], //Importing JWt to use in the auth module
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
```

In the service we are gonna build the logic to generate to jwt-token

**auth.service.ts**

```typescript
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, //Recieving prisma services
    private jwt: JwtService, //Recieving jwt services
  ) {}

  async genToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId, //sub is a convention name in Jwt for a unique value, in this case the user id
      email: email,
    };

    try {
      //Loading the jwt secret from the env
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) throw new Error('Secret not found!');

      //Generating and storing the jwt token
      const token = await this.jwt.signAsync(payload, {
        secret: jwtSecret,
        expiresIn: '15m',
      });
      return { access_token: token };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
```

# Strategies and Guards (Middlewares)

**Creating a strategy (uses to authenticate the jwt)**

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  //"jwt" is the name that goes in the guard
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  //Validating and returning the payload in every res router
  async validate(payload: any): Promise<any> {
    //Returning the payload
    return payload;
  }
}
```

**Using Guards to make a route protected to be only acessible with a valid jwt in the header**

```typescript
//route protected /user/getme
@UseGuards(AuthGuard('jwt'))                //Protect the route using the strategy. The "jwt" is set in the strategy
@Get('getme')
getUser(@Body() dto: UserDto){
  return this.userService.getUser(dto)
}
```

**Getting the jwt and his information from the request**

```typescript
//route /user/getjwt
@UseGuards(AuthGuard('jwt'))                //Protect the route using the strategy. The "jwt" is set in the strategy
@Get('getjwt')
getJwt(@Req() req: any){
  const tokenDetails = req.user
  let findToken = req.rawHeaders.find((item: string) => item.includes('Bearer'))      //Get The Bearer string
  findToken = findToken.split(" ")[1]                                                 //Isolate the token from the string

  return {
      token: findToken,
      tokenDetails: tokenDetails
  }
}
```

# Roles (CustomGuards, CustomDecorators)

**Custom Guards**

```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //Getting the roles requireds inside the custom decorator "@Roles"
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    console.log(requiredRoles);
    if (!requiredRoles) {
      return true; // If no roles are required, grant access
    }

    //Getting the payload from the JwtStrategy
    const { user } = context.switchToHttp().getRequest(); // The validated payload from JwtStrategy

    //Returning true if the role need is found in the roles of the user
    const haveRole: boolean = requiredRoles.some((role) =>
      user.roles?.includes(role),
    );
    return haveRole;
  }
}
```

**Custom Decoratos - @Roles('example')**

```typescript
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

**Protected route only by admin**

```typescript
//route /user/admin -> This route is to test if the roles guards and decorators are working
@UseGuards(RolesGuard)
@Roles('admin',)
@Get('admin')
onlyAdmin(){
    return 'Only admin can acess this message'
}
```
