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
import { AlbumsService, LoggerService } from '../services';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { isUUID } from 'class-validator';
import { Album } from '../interfaces';
import { getUrl } from '../../utils';

const HEADERS = { 'Content-Type': 'application/json' };

@Controller('album')
export class AlbumsController {
  private loggingService = new LoggerService(AlbumsController.name);
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  async getAll(@Res() res: Response, @Req() req: Request): Promise<Response> {
    const albums = await this.albumsService.getAll();

    this.loggingService.info({
      url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
      response: albums,
      statusCode: StatusCodes.OK,
    });

    return res.header(HEADERS).status(StatusCodes.OK).json(albums);
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

    const album: Album = await this.albumsService.getById(id);

    if (album) {
      this.loggingService.info({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response: album,
        statusCode: StatusCodes.OK,
      });

      return res.header(HEADERS).status(StatusCodes.OK).json(album);
    }

    this.loggingService.info({
      url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
      params: req.params,
      statusCode: StatusCodes.NOT_FOUND,
    });

    return res
      .header(HEADERS)
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: 'Album not found' });
  }

  @Post()
  async create(
    @Body() newAlbum: Album,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const { name, year, artistId } = newAlbum;
    if (
      (newAlbum.artistId && !isUUID(artistId)) ||
      typeof name !== 'string' ||
      typeof year !== 'number'
    ) {
      const response = { msg: 'Invalid incoming data' };

      this.loggingService.error({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response,
        statusCode: StatusCodes.BAD_REQUEST,
      });

      return res.header(HEADERS).status(StatusCodes.BAD_REQUEST).json(response);
    }
    const album = await this.albumsService.createAlbum(newAlbum);

    this.loggingService.info({
      url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
      params: req.params,
      response: album,
      statusCode: StatusCodes.CREATED,
    });

    return res.header(HEADERS).status(StatusCodes.CREATED).json(album);
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

    const result = await this.albumsService.deleteAlbum(id);

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
    @Body() album: Album,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const validUuid = isUUID(id);
    const { name, year } = album;

    if (!validUuid || typeof name !== 'string' || typeof year !== 'number') {
      const response = { msg: 'Invalid data provided' };

      this.loggingService.error({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response,
        statusCode: StatusCodes.BAD_REQUEST,
      });

      return res.header(HEADERS).status(StatusCodes.BAD_REQUEST).json(response);
    }

    const result: Album | number = await this.albumsService.updateAlbum(
      id,
      album,
    );

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
