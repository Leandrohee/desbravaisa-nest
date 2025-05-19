import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //Exporting prisma globally
@Module({
  providers: [PrismaService],
  exports: [PrismaService], //Exporting prisma locally
})
export class PrismaModule {}
