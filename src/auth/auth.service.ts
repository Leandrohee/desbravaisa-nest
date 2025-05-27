/**
 * File responsible for bussines logic to create a jwt authentication
 */

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

  /* ------------------------- METHOD RELATED TO CREATE A NEW USER IN DB ------------------------ */
  async signup(dto: SignupDto) {
    try {
      //Generating a hash based in the password provided
      const salt = await bcrypt.genSalt(5); //generating a salt to increase password security
      const hash = await bcrypt.hash(dto.password, salt); //generating a hash with salt

      //Saving the data recieved in the DB
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      //Return a successfully msg
      return { msg: `The user ${user.email} has been created` };
    } catch (error) {
      //If the error is a prisma related error, in this case duplicated key (email)
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          //This code is for duplicated keys that are now allow in the DB (from prisma)
          throw new ForbiddenException('Credentials taken'); //ForbiddenException is a NestJs error
        }
      }
      //If the error is not from prisma just show the error
      throw error;
    }
  }

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

      //Generating the token using the gentoken function
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
  }: GentokenTypes): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      sub: codUser, //sub is a convention name in Jwt for a unique value, in this case the user id
      email: email,
    };
    const jwtSecret = process.env.JWT_SECRET;
    const refreshJwtSecret = process.env.REFRESH_JWT_SECRET;

    try {
      //Loading the jwt secret from the env
      if (!jwtSecret) throw new Error('Secret not found!');
      if (!refreshJwtSecret) throw new Error('Refresh secret not found!');

      //Generating and storing the jwt acess_token and refresh_token
      const access_token = await this.jwt.signAsync(payload, {
        secret: jwtSecret,
        expiresIn: '60s',
      });

      const refresh_token = await this.jwt.signAsync(payload, {
        secret: refreshJwtSecret,
        expiresIn: '7d',
      });

      //Returning the generate token
      return { access_token, refresh_token };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}

/**
 * Testing this on insomnia:
 * 
 * E.G: auth/signup
 * 
 * Route: http://localhost:3000/auth/signup
 * 
 * Params: body ->
 * 
 * {
    "email": "leandrohenrique_@live.com",
    "password": "123",
    "firstName": "Leandro",
    "lastName": "Torres"
  }

  The quotation marks has to be doubled and not simplet 
  ✅ ""
  ❌ ''
 */
