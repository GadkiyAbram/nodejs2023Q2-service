import { Injectable } from '@nestjs/common';
import { User } from '../interfaces';
import { v4 as uuidV4 } from 'uuid';
import { CreateUserDto, UpdatePasswordDto } from '../interfaces/dtos';
import { StatusCodes } from 'http-status-codes';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private client: PrismaService) {}
  async getAll(): Promise<User[]> {
    return this.client.user.findMany();
  }

  async getById(id: string): Promise<User | null> {
    console.log(id);
    return (
      (await this.client.user.findUnique({
        where: {
          id,
        },
      })) || null
    );
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const userId: string = uuidV4();
    const createdAt = BigInt(new Date().getTime());

    return this.client.user.create({
      data: {
        id: userId,
        login: dto.login,
        password: dto.password,
        version: 1,
        createdAt,
        updatedAt: createdAt,
      },
    });
  }

  async deleteUser(userId: string): Promise<any> {
    const user = (await this.getById(userId)) || null;

    if (!user) {
      return 0;
    }

    return this.client.user.delete({ where: { id: userId } });
  }

  async updateUser(
    userId: string,
    newData: UpdatePasswordDto,
  ): Promise<
    | {
        id: string;
        login: string;
        version: number;
        createdAt: number;
        updatedAt: number;
      }
    | number
  > {
    const user: User = (await this.getById(userId)) || null;

    if (!user) {
      return 0;
    }

    if (user.password !== newData.oldPassword) {
      return StatusCodes.FORBIDDEN;
    }

    const updated = await this.client.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newData.newPassword,
        version: user.version + 1,
        updatedAt: new Date().getTime(),
      },
    });

    if (updated) {
      return {
        id: updated.id,
        login: updated.login,
        version: updated.version,
        createdAt: Number(updated.createdAt),
        updatedAt: Number(updated.updatedAt),
      };
    }

    return 0;
  }
}
