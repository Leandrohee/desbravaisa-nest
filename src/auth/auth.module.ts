import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [PrismaModule, JwtModule.register({})], //Importing JwtModule here to use in this module
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
