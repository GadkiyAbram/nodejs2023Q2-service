import { Module } from '@nestjs/common';
import { UsersController } from '../controllers';
import { UsersService } from '../services';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UserModule {}
