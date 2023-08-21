import { Module } from '@nestjs/common';
import { AuthController } from '../controllers';
import { AuthService, UsersService } from '../services';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersService],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtService],
})
export class AuthModule {}
