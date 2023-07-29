import { Injectable } from '@nestjs/common';
import { User } from '../interfaces';
import { v4 as uuidV4 } from 'uuid';
import { usersTable } from '../../db/in-memory';
import { CreateUserDto, UpdatePasswordDto } from '../interfaces/dtos';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class UsersService {
  constructor(private client: usersTable) {}
  async getAll(): Promise<{ id: string; user: User }[]> {
    return this.client.findAll();
  }

  async getById(id: string): Promise<User | null> {
    return (await this.client.findById(id)) || null;
  }

  async createUser(dto: CreateUserDto): Promise<{
    id: string;
    login: string;
    createdAt: number;
    updatedAt: number;
  }> {
    const userId: string = uuidV4();
    const createdAt = new Date().getTime();

    return this.client.insert({
      id: userId,
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt,
      updatedAt: createdAt,
    });
  }

  async deleteUser(userId: string): Promise<boolean | number> {
    const user = (await this.getById(userId)) || null;

    if (!user) {
      return 0;
    }

    return this.client.deleteById(userId);
  }

  async updateUser(
    userId: string,
    newData: UpdatePasswordDto,
  ): Promise<{ id: string; login: string } | number> {
    const user: User = (await this.getById(userId)) || null;

    if (!user) {
      return 0;
    }

    if (user.password !== newData.oldPassword) {
      return StatusCodes.FORBIDDEN;
    }

    const updatedUser: User = {
      ...user,
      password: newData.newPassword,
      version: user.version + 1,
      updatedAt: new Date().getTime(),
    };

    return this.client.updateById(updatedUser);
  }
}
