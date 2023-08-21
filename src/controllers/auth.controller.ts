import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from '../services';
import { Request, Response } from 'express';
import { CreateUserDto } from '../interfaces/dtos';
import { StatusCodes } from 'http-status-codes';

const HEADERS = { 'Content-Type': 'application/json' };

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() userDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { login, password } = userDto;
    if (!login || !password) {
      const response = { msg: 'Empty required fields' };

      return res.header(HEADERS).status(StatusCodes.BAD_REQUEST).json(response);
    }

    const result = await this.authService.signup(userDto);

    return res.header(HEADERS).status(StatusCodes.CREATED).json(result);
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const { login, password } = req.body;

    if (typeof login === 'number' || typeof password === 'number') {
      return res
        .header(HEADERS)
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Login and Password should be strings' });
    }

    const user = await this.authService.validateUser(login, password);

    if (!user) {
      return res
        .header(HEADERS)
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }

    const result = await this.authService.login(user);

    return res.header(HEADERS).status(StatusCodes.OK).json(result);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    const newAccessToken =
      await this.authService.generateAccessTokenFromRefreshToken(refreshToken);

    return res.header(HEADERS).status(StatusCodes.OK).json(newAccessToken);
  }
}
