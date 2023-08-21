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
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { isUUID } from 'class-validator';
import { Artist } from '../interfaces';
import { ArtistsService, LoggerService } from '../services';
import { getUrl } from '../../utils';

const HEADERS = { 'Content-Type': 'application/json' };

@Controller('artist')
export class ArtistsController {
  private loggingService = new LoggerService(ArtistsController.name);
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  async getAll(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const result = await this.artistsService.getAll();

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
    const response = { msg: 'Invalid UUID provided' };

    if (!isUUID(id)) {
      this.loggingService.error({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response,
        statusCode: StatusCodes.BAD_REQUEST,
      });

      return res.header(HEADERS).status(StatusCodes.BAD_REQUEST).json(response);
    }

    const artist = await this.artistsService.getById(id);

    if (artist) {
      this.loggingService.info({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response: artist,
        statusCode: StatusCodes.OK,
      });

      return res.header(HEADERS).status(StatusCodes.OK).json(artist);
    }

    this.loggingService.info({
      url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
      params: req.params,
      statusCode: StatusCodes.NOT_FOUND,
    });

    return res
      .header(HEADERS)
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: 'Artist not found' });
  }

  @Post()
  async create(
    @Body() newArtist: Artist,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    if (!newArtist.name || !Boolean(newArtist.grammy)) {
      const response = { msg: 'Empty required fields' };

      this.loggingService.error({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response,
        statusCode: StatusCodes.BAD_REQUEST,
      });

      return res.header(HEADERS).status(StatusCodes.BAD_REQUEST).json(response);
    }
    const artist = await this.artistsService.createArtist(newArtist);

    this.loggingService.info({
      url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
      params: req.params,
      response: artist,
      statusCode: StatusCodes.CREATED,
    });

    return res.header(HEADERS).status(StatusCodes.CREATED).json(artist);
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

    const result = await this.artistsService.deleteArtist(id);

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
    @Body() artist: Artist,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const { name } = artist;
    const validUuid = isUUID(id);

    if (!validUuid || typeof name === 'number') {
      const response = { msg: 'Invalid DTO provided' };

      this.loggingService.error({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response,
        statusCode: StatusCodes.BAD_REQUEST,
      });

      return res.header(HEADERS).status(StatusCodes.BAD_REQUEST).json(response);
    }

    const result: Artist | number = await this.artistsService.updateArtist(
      id,
      artist,
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
