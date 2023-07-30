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
import { AlbumsService } from '../services';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { isUUID } from 'class-validator';
import { Album } from '../interfaces';

const HEADERS = { 'Content-Type': 'application/json' };

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  async getAll(@Res() res: Response): Promise<Response> {
    const albums = await this.albumsService.getAll();

    return res.header(HEADERS).status(StatusCodes.OK).json(albums);
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

    const album: Album = await this.albumsService.getById(id);

    if (album) {
      return res.header(HEADERS).status(StatusCodes.OK).json(album);
    }

    return res
      .header(HEADERS)
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: 'Album not found' });
  }

  @Post()
  async create(
    @Body() newAlbum: Album,
    @Res() res: Response,
  ): Promise<Response> {
    const { name, year, artistId } = newAlbum;
    if (
      (newAlbum.artistId && !isUUID(artistId)) ||
      typeof name !== 'string' ||
      typeof year !== 'number'
    ) {
      return res
        .header(HEADERS)
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Invalid incoming data' });
    }
    const album = await this.albumsService.createAlbum(newAlbum);

    return res.header(HEADERS).status(StatusCodes.CREATED).json(album);
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

    const result = await this.albumsService.deleteAlbum(id);

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
    @Body() album: Album,
    @Res() res: Response,
  ): Promise<Response> {
    const validUuid = isUUID(id);
    const { name, year } = album;

    if (!validUuid || typeof name !== 'string' || typeof year !== 'number') {
      return res
        .header(HEADERS)
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Invalid DTO' });
    }

    const result: Album | number = await this.albumsService.updateAlbum(
      id,
      album,
    );

    if (!result) {
      return res.header(HEADERS).status(StatusCodes.NOT_FOUND).json();
    }

    if (result === StatusCodes.FORBIDDEN) {
      return res.header(HEADERS).status(result).json();
    }

    return res.header(HEADERS).status(StatusCodes.OK).json(result);
  }
}
