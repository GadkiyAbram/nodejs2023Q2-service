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
import { LoggerService, TracksService } from '../services';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { isUUID } from 'class-validator';
import { Track } from '../interfaces';
import { getUrl } from '../../utils';

const HEADERS = { 'Content-Type': 'application/json' };

@Controller('track')
export class TracksController {
  private loggingService = new LoggerService(TracksController.name);
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  async getAll(@Res() res: Response, @Req() req: Request): Promise<Response> {
    const tracks = await this.tracksService.getAll();

    this.loggingService.info({
      url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
      response: tracks,
      statusCode: StatusCodes.OK,
    });

    return res.header(HEADERS).status(StatusCodes.OK).json(tracks);
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
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

    const track = await this.tracksService.getById(id);

    if (track) {
      this.loggingService.info({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response: track,
        statusCode: StatusCodes.OK,
      });

      return res.header(HEADERS).status(StatusCodes.OK).json(track);
    }

    this.loggingService.info({
      url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
      params: req.params,
      statusCode: StatusCodes.NOT_FOUND,
    });

    return res
      .header(HEADERS)
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: 'Track not found' });
  }

  @Post()
  async create(
    @Body() newTrack: Track,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const { name, duration } = newTrack;
    if (!name || !duration || typeof duration !== 'number') {
      const response = { msg: 'Empty required fields' };

      this.loggingService.error({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response,
        statusCode: StatusCodes.BAD_REQUEST,
      });

      return res.header(HEADERS).status(StatusCodes.BAD_REQUEST).json(response);
    }

    const track = await this.tracksService.createTrack(newTrack);

    this.loggingService.info({
      url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
      params: req.params,
      response: track,
      statusCode: StatusCodes.CREATED,
    });

    return res.header(HEADERS).status(StatusCodes.CREATED).json(track);
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

    const result = await this.tracksService.deleteTrack(id);

    if (!result) {
      this.loggingService.error({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        statusCode: StatusCodes.BAD_REQUEST,
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
    @Body() track: Track,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const { name } = track;
    const validUuid = isUUID(id);

    if (!validUuid || !name || typeof name !== 'string') {
      const response = { msg: 'Invalid data provided' };

      this.loggingService.error({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response,
        statusCode: StatusCodes.BAD_REQUEST,
      });

      return res.header(HEADERS).status(StatusCodes.BAD_REQUEST).json(response);
    }

    const result: Track | number = await this.tracksService.updateTrack(
      id,
      track,
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
