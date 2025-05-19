/**
 * File responsible for bussines logic to create a jwt authentication
 */

import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  /* --------------------------- RECIEVING SERVICES FROM OTHERS MODULES --------------------------- */
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  /* ------------------------- FUNCTION RELATED TO CREATE A NEW USER IN DB ------------------------ */
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

  /* ---------------------- FUNCTION RELATED TO AUTHENTICATED A EXISTENT USER --------------------- */
  signin() {}
}
