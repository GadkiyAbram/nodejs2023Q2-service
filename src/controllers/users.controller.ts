import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { UsersService } from '../services';
import { CreateUserDto, UpdatePasswordDto } from '../interfaces/dtos';
import { isUUID } from 'class-validator';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const HEADERS = { 'Content-Type': 'application/json' };

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(@Res() res: Response): Promise<Response> {
    const users = await this.usersService.getAll();

    return res.header(HEADERS).status(StatusCodes.OK).json(users);
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    if (!isUUID(id)) {
      return res
        .header(HEADERS)
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Invalid UUID provided' });
    }

    const user = await this.usersService.getById(id);

    if (user) {
      return res.header(HEADERS).status(StatusCodes.OK).json(user);
    }

    return res
      .header(HEADERS)
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: 'User not found' });
  }

  @Post()
  async create(
    @Body() userDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    if (!userDto.login || !userDto.password) {
      return res
        .header(HEADERS)
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Empty required fields' });
    }
    const user = await this.usersService.createUser(userDto);

    return res.header(HEADERS).status(StatusCodes.CREATED).json(user);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const validUuid = isUUID(id);

    if (!validUuid) {
      return res
        .header(HEADERS)
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Invalid UUID' });
    }

    const result = await this.usersService.deleteUser(id);

    if (!result) {
      return res.header(HEADERS).status(StatusCodes.NOT_FOUND).json();
    }

    return res
      .header(HEADERS)
      .status(StatusCodes.NO_CONTENT)
      .json(Number(result));
  }

  @Put(':id')
  async put(
    @Param('id') id: string,
    @Body() userDto: UpdatePasswordDto,
    @Res() res: Response,
  ): Promise<Response> {
    const validUuid = isUUID(id);

    if (!validUuid || !userDto.newPassword || !userDto.oldPassword) {
      return res
        .header(HEADERS)
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Invalid UUID' });
    }

    const result: { id: string; login: string } | number =
      await this.usersService.updateUser(id, userDto);

    if (!result) {
      return res.header(HEADERS).status(StatusCodes.NOT_FOUND).json();
    }

    if (result === StatusCodes.FORBIDDEN) {
      return res.header(HEADERS).status(result).json();
    }

    return res.header(HEADERS).status(StatusCodes.OK).json(result);
  }
}
