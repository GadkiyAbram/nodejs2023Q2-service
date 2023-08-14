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
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { isUUID } from 'class-validator';
import { Artist } from '../interfaces';
import { ArtistsService } from '../services';

const HEADERS = { 'Content-Type': 'application/json' };

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  async getAll(@Res() res: Response): Promise<Response> {
    const artists = await this.artistsService.getAll();

    return res.header(HEADERS).status(StatusCodes.OK).json(artists);
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

    const artist = await this.artistsService.getById(id);

    if (artist) {
      return res.header(HEADERS).status(StatusCodes.OK).json(artist);
    }

    return res
      .header(HEADERS)
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: 'Artist not found' });
  }

  @Post()
  async create(
    @Body() newArtist: Artist,
    @Res() res: Response,
  ): Promise<Response> {
    if (!newArtist.name || !Boolean(newArtist.grammy)) {
      return res
        .header(HEADERS)
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Empty required fields' });
    }
    const artist = await this.artistsService.createArtist(newArtist);

    return res.header(HEADERS).status(StatusCodes.CREATED).json(artist);
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

    const result = await this.artistsService.deleteArtist(id);

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
    @Body() artist: Artist,
    @Res() res: Response,
  ): Promise<Response> {
    const { name } = artist;
    const validUuid = isUUID(id);

    if (!validUuid || typeof name === 'number') {
      return res
        .header(HEADERS)
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Invalid DTO' });
    }

    const result: Artist | number = await this.artistsService.updateArtist(
      id,
      artist,
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
