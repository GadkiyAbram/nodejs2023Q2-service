import { Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common';
import { FavoritesService, LoggerService } from '../services';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getUrl, request } from '../../utils';
import { isUUID } from 'class-validator';

const HEADERS = { 'Content-Type': 'application/json' };

@Controller('favs')
export class FavoritesController {
  private loggingService = new LoggerService(FavoritesController.name);
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getAll(@Res() res: Response, @Req() req: Request): Promise<Response> {
    const favs = await this.favoritesService.getAll();

    this.loggingService.info({
      url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
      response: favs,
      statusCode: StatusCodes.OK,
    });

    return res.header(HEADERS).status(StatusCodes.OK).json(favs);
  }

  @Post('track/:id')
  async createTrackFav(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
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

    const track = await request('http://localhost:4000/track', 'get', id);

    if (!track.id) {
      const response = { msg: 'Track not exists' };

      this.loggingService.info({
        url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
        params: req.params,
        response,
        statusCode: StatusCodes.OK,
      });

      return res
        .header(HEADERS)
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(response);
    }

    const trackFav = await this.favoritesService.createFavTrack(track);

    this.loggingService.info({
      url: `${getUrl(req.protocol, req.get('host'), req.originalUrl)}`,
      params: req.params,
      statusCode: StatusCodes.CREATED,
    });

    return res.header(HEADERS).status(StatusCodes.CREATED).json(trackFav);
  }

  @Post('album/:id')
  async createAlbumFav(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    if (!isUUID(id)) {
      return res
        .header(HEADERS)
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Invalid UUID provided' });
    }

    const album = await request('http://localhost:4000/album', 'get', id);

    if (!album.id) {
      return res
        .header(HEADERS)
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ msg: 'Album not exists' });
    }

    const albumFav = await this.favoritesService.createFavAlbum(album);

    return res.header(HEADERS).status(StatusCodes.CREATED).json(albumFav);
  }

  @Post('artist/:id')
  async createArtistFav(@Param('id') id: string, @Res() res: Response) {
    if (!isUUID(id)) {
      return res
        .header(HEADERS)
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Invalid UUID provided' });
    }

    const artist = await request('http://localhost:4000/artist', 'get', id);

    if (!artist.id) {
      return res
        .header(HEADERS)
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ msg: 'Artist not exists' });
    }

    const artistFav = await this.favoritesService.createFavArtist(artist);

    return res.header(HEADERS).status(StatusCodes.CREATED).json(artistFav);
  }

  @Delete('track/:id')
  async deleteTrack(
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

    const track = await request('http://localhost:4000/track', 'get', id);

    if (!track) {
      return res.header(HEADERS).status(StatusCodes.NOT_FOUND).json();
    }

    const result = await this.favoritesService.deleteTrack(track);

    return res
      .header(HEADERS)
      .status(StatusCodes.NO_CONTENT)
      .json({ tracks: result });
  }

  @Delete('artist/:id')
  async deleteArtist(
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

    const artist = await request('http://localhost:4000/artist', 'get', id);

    if (!artist) {
      return res.header(HEADERS).status(StatusCodes.NOT_FOUND).json();
    }

    const result = await this.favoritesService.deleteArtist(artist);

    return res
      .header(HEADERS)
      .status(StatusCodes.NO_CONTENT)
      .json({ artists: result });
  }

  @Delete('album/:id')
  async deleteAlbum(
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

    const album = await request('http://localhost:4000/album', 'get', id);

    if (!album) {
      return res.header(HEADERS).status(StatusCodes.NOT_FOUND).json();
    }

    const result = await this.favoritesService.deleteAlbum(album);

    return res
      .header(HEADERS)
      .status(StatusCodes.NO_CONTENT)
      .json({ albums: result });
  }
}
