import { Module } from '@nestjs/common';
import { UsersController } from '../controllers';
import { UsersService } from '../services';
import { usersTable } from '../../db/in-memory';

@Module({
  controllers: [UsersController],
  providers: [UsersService, usersTable],
})
export class UserModule {}
