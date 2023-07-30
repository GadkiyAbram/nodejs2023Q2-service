import { Injectable } from '@nestjs/common';
import { albumsTable } from '../../db/in-memory';
import { Album, Track } from '../interfaces';
import { v4 as uuidV4 } from 'uuid';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AlbumsService {
  constructor(
    private client: albumsTable,
    private _albumsServiceEmitter: EventEmitter2,
  ) {}

  async getAll(): Promise<{ id: string; album: Album }[]> {
    return this.client.findAll();
  }

  async getById(id: string): Promise<Album> {
    return (await this.client.findById(id)) || null;
  }

  async createAlbum(album: Album): Promise<Album | number> {
    const albumId: string = uuidV4();

    const created: Map<string, Album> = await this.client.insert({
      ...album,
      id: albumId,
    });

    if (created) {
      return this.client.findById(albumId);
    }

    return 0;
  }

  async deleteAlbum(albumId: string): Promise<boolean | number> {
    const album: Album = (await this.getById(albumId)) || null;

    if (!album) {
      return 0;
    }

    const deleted = await this.client.deleteById(albumId);

    if (deleted) {
      this._albumsServiceEmitter.emit('album.deleted', { albumId });
    }

    return deleted;
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

    const updated = await this.client.updateById(updatedAlbum);

    if (updated) {
      return updatedAlbum;
    }

    return 0;
  }

  async getByArtistId(artistId: string): Promise<Album[] | []> {
    const albumsAll = await this.client.findAll();

    return (
      albumsAll
        ?.map(({ album }) => album)
        .filter(({ artistId: trackArtistId }) => trackArtistId === artistId) ||
      []
    );
  }

  @OnEvent('artist.deleted')
  async updateAlbumsWhenArtistDeleted({ artistId }: { artistId: string }) {
    const tracksByArtist = await this.getByArtistId(artistId);

    return tracksByArtist.map((track) =>
      this.client.updateById({
        ...track,
        artistId: null,
      }),
    );
  }
}
