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
import { TracksService } from '../services';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { isUUID } from 'class-validator';
import { Track } from '../interfaces';

const HEADERS = { 'Content-Type': 'application/json' };

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  async getAll(@Res() res: Response): Promise<Response> {
    const tracks = await this.tracksService.getAll();

    return res.header(HEADERS).status(StatusCodes.OK).json(tracks);
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

    const track = await this.tracksService.getById(id);

    if (track) {
      return res.header(HEADERS).status(StatusCodes.OK).json(track);
    }

    return res
      .header(HEADERS)
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: 'Track not found' });
  }

  @Post()
  async create(
    @Body() newATrack: Track,
    @Res() res: Response,
  ): Promise<Response> {
    const { name, duration } = newATrack;
    if (!name || !duration || typeof duration !== 'number') {
      return res
        .header(HEADERS)
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Empty required fields' });
    }
    const track = await this.tracksService.createTrack(newATrack);

    return res.header(HEADERS).status(StatusCodes.CREATED).json(track);
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

    const result = await this.tracksService.deleteTrack(id);

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
    @Body() track: Track,
    @Res() res: Response,
  ): Promise<Response> {
    const { name } = track;
    const validUuid = isUUID(id);

    if (!validUuid || !name || typeof name !== 'string') {
      return res
        .header(HEADERS)
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Invalid DTO' });
    }

    const result: Track | number = await this.tracksService.updateTrack(
      id,
      track,
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
