import { Module } from '@nestjs/common';
import { UsersController } from '../controllers';
import { UsersService } from '../services';
import { usersTable } from '../../db/in-memory';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaClient, usersTable],
})
export class UserModule {}
