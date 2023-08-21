import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { LoggerService, UsersService } from '../services';
import { CreateUserDto, UpdatePasswordDto } from '../interfaces/dtos';
import { isUUID } from 'class-validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getUrl } from '../../utils';

const HEADERS = { 'Content-Type': 'application/json' };

@Controller('user')
export class UsersController {
  private loggingService = new LoggerService(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(@Res() res: Response, @Req() req: Request): Promise<Response> {
    const users = await this.usersService.getAll();

    const result = users.map((user) => {
      return {
        ...user,
        createdAt: String(user.createdAt),
        updatedAt: String(user.updatedAt),
      };
    });

    this.loggingService.info({
      url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
      response: result,
      statusCode: StatusCodes.OK,
    });

    return res.header(HEADERS).status(StatusCodes.OK).json(result);
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    if (!isUUID(id)) {
      const response = { msg: 'Invalid UUID provided' };

      this.loggingService.error({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response,
        statusCode: StatusCodes.BAD_REQUEST,
      });

      return res.header(HEADERS).status(StatusCodes.BAD_REQUEST).json(response);
    }

    const user = await this.usersService.getById(id);

    if (user) {
      const result = {
        ...user,
        createdAt: String(user.createdAt),
        updatedAt: String(user.updatedAt),
      };

      this.loggingService.info({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response: result,
        statusCode: StatusCodes.OK,
      });

      return res.header(HEADERS).status(StatusCodes.OK).json(result);
    }

    this.loggingService.info({
      url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
      params: req.params,
      statusCode: StatusCodes.NOT_FOUND,
    });

    return res
      .header(HEADERS)
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: 'User not found' });
  }

  @Post()
  async create(
    @Body() userDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    if (!userDto.login || !userDto.password) {
      const response = { msg: 'Empty required fields' };

      this.loggingService.error({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response,
        statusCode: StatusCodes.BAD_REQUEST,
      });

      return res
        .header(HEADERS)
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Empty required fields' });
    }
    const { id, login, version, createdAt, updatedAt } =
      await this.usersService.createUser(userDto);

    const result = {
      id: id,
      login: login,
      version: version,
      createdAt: Number(createdAt),
      updatedAt: Number(updatedAt),
    };

    this.loggingService.info({
      url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
      params: req.params,
      response: result,
      statusCode: StatusCodes.CREATED,
    });

    return res.header(HEADERS).status(StatusCodes.CREATED).json(result);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const validUuid = isUUID(id);

    if (!validUuid) {
      const response = { msg: 'Invalid UUID provided' };

      this.loggingService.error({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response,
        statusCode: StatusCodes.BAD_REQUEST,
      });

      return res.header(HEADERS).status(StatusCodes.BAD_REQUEST).json(response);
    }

    const result = await this.usersService.deleteUser(id);

    if (!result) {
      this.loggingService.error({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        statusCode: StatusCodes.NOT_FOUND,
      });

      return res.header(HEADERS).status(StatusCodes.NOT_FOUND).json();
    }

    this.loggingService.info({
      url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
      params: req.params,
      response: result,
      statusCode: StatusCodes.NO_CONTENT,
    });

    return res
      .header(HEADERS)
      .status(StatusCodes.NO_CONTENT)
      .json(Number(result));
  }

  @Put(':id')
  async put(
    @Param('id') id: string,
    @Body() userDto: UpdatePasswordDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const validUuid = isUUID(id);

    if (!validUuid || !userDto.newPassword || !userDto.oldPassword) {
      const response = { msg: 'Invalid data provided' };

      this.loggingService.error({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response,
        statusCode: StatusCodes.BAD_REQUEST,
      });

      return res.header(HEADERS).status(StatusCodes.BAD_REQUEST).json(response);
    }

    const result = await this.usersService.updateUser(id, userDto);

    if (!result) {
      this.loggingService.error({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        statusCode: StatusCodes.NOT_FOUND,
      });

      return res.header(HEADERS).status(StatusCodes.NOT_FOUND).json();
    }

    if (result === StatusCodes.FORBIDDEN) {
      this.loggingService.error({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        statusCode: result,
      });

      return res.header(HEADERS).status(result).json();
    }

    this.loggingService.info({
      url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
      params: req.params,
      response: result,
      statusCode: StatusCodes.NO_CONTENT,
    });

    return res.header(HEADERS).status(StatusCodes.OK).json(result);
  }
}
