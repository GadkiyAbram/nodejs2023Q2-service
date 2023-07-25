import { Injectable } from '@nestjs/common';
import { User } from '../interfaces';

@Injectable()
export class UsersService {
  getAllUsers(): User[] | number[] {
    return [1, 3, 5, 7, 9];
  }
}
