import { Injectable } from '@nestjs/common';
import { Album } from '../interfaces';
import { v4 as uuidV4 } from 'uuid';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { request } from '../../utils';

@Injectable()
export class AlbumsService {
  constructor(
    private client: PrismaService,
    private _albumsServiceEmitter: EventEmitter2,
  ) {}

  async getAll(): Promise<Album[]> {
    return this.client.album.findMany();
  }

  async getById(id: string): Promise<Album | null> {
    return (
      (await this.client.album.findUnique({
        where: { id },
      })) || null
    );
  }

  async createAlbum(album: Album): Promise<Album | number> {
    const albumId: string = uuidV4();

    const created: Album = await this.client.album.create({
      data: {
        ...album,
        id: albumId,
      },
    });

    if (created) {
      return this.client.album.findUnique({ where: { id: albumId } });
    }

    return 0;
  }

  async deleteAlbum(albumId: string): Promise<boolean | number> {
    const album: Album = (await this.getById(albumId)) || null;

    if (!album) {
      return 0;
    }

    const deleted = await this.client.album.delete({ where: { id: albumId } });

    if (deleted) {
      this._albumsServiceEmitter.emit('album.deleted', { albumId });

      return true;
    }

    return 0;
  }

  async updateAlbum(albumId: string, newData: Album): Promise<Album | number> {
    const album: Album = (await this.getById(albumId)) || null;

    if (!album) {
      return 0;
    }

    const updatedAlbum: Album = {
      ...album,
      name: newData.name,
      year: newData.year,
      artistId: newData.artistId || null,
    };

    const updated = await this.client.album.update({
      where: {
        id: albumId,
      },
      data: updatedAlbum,
    });

    if (updated) {
      return updatedAlbum;
    }

    return 0;
  }

  // async getByArtistId(artistId: string): Promise<Album[] | []> {
  //   const albumsAll = await this.client.findAll();
  //
  //   return (
  //     albumsAll
  //       ?.map(({ album }) => album)
  //       .filter(({ artistId: trackArtistId }) => trackArtistId === artistId) ||
  //     []
  //   );
  // }
  //
  // @OnEvent('artist.deleted')
  // async updateAlbumsWhenArtistDeleted({ artistId }: { artistId: string }) {
  //   const tracksByArtist = await this.getByArtistId(artistId);
  //
  //   return tracksByArtist.map((track) =>
  //     this.client.updateById({
  //       ...track,
  //       artistId: null,
  //     }),
  //   );
  // }
}
