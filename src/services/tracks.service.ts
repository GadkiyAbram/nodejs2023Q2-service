import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { Track } from '../interfaces';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TracksService {
  constructor(
    private client: PrismaService,
    private _tracksServiceEmitter: EventEmitter2,
  ) {}

  async getAll(): Promise<Track[] | []> {
    return this.client.track.findMany();
  }

  async getById(id: string): Promise<Track | null> {
    return (
      (await this.client.track.findUnique({
        where: {
          id,
        },
      })) || null
    );
  }

  async createTrack(track: Track): Promise<Track | number> {
    const trackId: string = uuidV4();

    const created: Track = await this.client.track.create({
      data: {
        ...track,
        id: trackId,
      },
    });

    if (created) {
      return this.client.track.findUnique({
        where: {
          id: trackId,
        },
      });
    }

    return 0;
  }

  async deleteTrack(trackId: string): Promise<Track | number> {
    const track = (await this.getById(trackId)) || null;

    if (!track) {
      return 0;
    }

    const deleted = await this.client.track.delete({ where: { id: trackId } });

    if (deleted) {
      this._tracksServiceEmitter.emit('track.deleted', { trackId });

      return deleted;
    }

    return 0;
  }

  async updateTrack(trackId: string, newData: Track): Promise<Track | number> {
    const track: Track = (await this.getById(trackId)) || null;

    if (!track) {
      return 0;
    }

    const updatedTrack: Track = {
      ...track,
      name: newData.name,
      artistId: newData.artistId || null,
      albumId: newData.albumId || null,
      duration: newData.duration,
    };

    const updated = await this.client.track.update({
      where: {
        id: trackId,
      },
      data: updatedTrack,
    });

    if (updated) {
      return updatedTrack;
    }

    return 0;
  }

  // async getByArtistId(artistId: string): Promise<Track[] | []> {
  //   const tracksAll = await this.client.findAll();
  //
  //   return (
  //     tracksAll
  //       ?.map(({ track }) => track)
  //       .filter(({ artistId: trackArtistId }) => trackArtistId === artistId) ||
  //     []
  //   );
  // }
  //
  // async getByAlbumsId(albumId: string): Promise<Track[] | []> {
  //   const tracksAll = await this.client.findAll();
  //
  //   return (
  //     tracksAll
  //       ?.map(({ track }) => track)
  //       .filter(({ albumId: trackAlbumId }) => trackAlbumId === albumId) || []
  //   );
  // }
  //
  // @OnEvent('artist.deleted')
  // async updateAllTracksWhenArtistDeleted({ artistId }: { artistId: string }) {
  //   const tracksByArtist = await this.getByArtistId(artistId);
  //
  //   return tracksByArtist.map((track) =>
  //     this.client.updateById({
  //       ...track,
  //       artistId: null,
  //     }),
  //   );
  // }
  //
  // @OnEvent('album.deleted')
  // async updateAllTracksWhenAlbumDeleted({ albumId }: { albumId: string }) {
  //   const tracksByAlbum = await this.getByAlbumsId(albumId);
  //
  //   return tracksByAlbum.map((track) =>
  //     this.client.updateById({
  //       ...track,
  //       albumId: null,
  //     }),
  //   );
  // }
}
