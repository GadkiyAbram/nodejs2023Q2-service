import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../services';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDto } from '../interfaces/dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string): Promise<User> {
    const user = await this.usersService.getByName(login);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return user;
    }

    return null;
  }

  async login(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, username: user.login };

    return this.generateTokens(payload);
  }

  async signup(userDto: CreateUserDto) {
    const { password } = userDto;
    const passwordHashed = await bcrypt.hash(password, 10);

    const { id, login, version, createdAt, updatedAt } =
      await this.usersService.createUser({
        ...userDto,
        password: passwordHashed,
      });

    return {
      id: id,
      login: login,
      version: version,
      createdAt: Number(createdAt),
      updatedAt: Number(updatedAt),
    };
  }

  generateTokens(payload: object): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: 'my-secret-key',
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: 'my-secret-key',
      }),
    };
  }

  async generateAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<string> {
    try {
      const decodedToken = this.jwtService.verify(refreshToken);

      return this.jwtService.sign({ sub: decodedToken.sub });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
