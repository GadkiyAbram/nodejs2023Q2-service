import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../services';

@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAllUsers(): any {
    return this.userService.getAllUsers();
  }
}
