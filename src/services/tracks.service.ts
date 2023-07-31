import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { tracksTable } from '../../db/in-memory';
import { Track } from '../interfaces';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TracksService {
  constructor(
    private client: tracksTable,
    private _tracksServiceEmitter: EventEmitter2,
  ) {}

  async getAll(): Promise<{ id: string; track: Track }[]> {
    return this.client.findAll();
  }

  async getById(id: string): Promise<Track | null> {
    return (await this.client.findById(id)) || null;
  }

  async createTrack(track: Track): Promise<Track | number> {
    const trackId: string = uuidV4();

    const created: Map<string, Track> = await this.client.insert({
      ...track,
      id: trackId,
    });

    if (created) {
      return this.client.findById(trackId);
    }

    return 0;
  }

  async deleteTrack(trackId: string): Promise<boolean | number> {
    const track = (await this.getById(trackId)) || null;

    if (!track) {
      return 0;
    }

    const deleted = await this.client.deleteById(trackId);

    if (deleted) {
      this._tracksServiceEmitter.emit('track.deleted', { trackId });
    }

    return deleted;
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

    const updated = await this.client.updateById(updatedTrack);

    if (updated) {
      return updatedTrack;
    }

    return 0;
  }

  async getByArtistId(artistId: string): Promise<Track[] | []> {
    const tracksAll = await this.client.findAll();

    return (
      tracksAll
        ?.map(({ track }) => track)
        .filter(({ artistId: trackArtistId }) => trackArtistId === artistId) ||
      []
    );
  }

  async getByAlbumsId(albumId: string): Promise<Track[] | []> {
    const tracksAll = await this.client.findAll();

    return (
      tracksAll
        ?.map(({ track }) => track)
        .filter(({ albumId: trackAlbumId }) => trackAlbumId === albumId) || []
    );
  }

  @OnEvent('artist.deleted')
  async updateAllTracksWhenArtistDeleted({ artistId }: { artistId: string }) {
    const tracksByArtist = await this.getByArtistId(artistId);

    return tracksByArtist.map((track) =>
      this.client.updateById({
        ...track,
        artistId: null,
      }),
    );
  }

  @OnEvent('album.deleted')
  async updateAllTracksWhenAlbumDeleted({ albumId }: { albumId: string }) {
    const tracksByAlbum = await this.getByAlbumsId(albumId);

    return tracksByAlbum.map((track) =>
      this.client.updateById({
        ...track,
        albumId: null,
      }),
    );
  }
}
