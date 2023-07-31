import { favoritesTable } from '../../db/in-memory';
import { Album, Artist, FavoritesResponse, Track } from '../interfaces';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { request } from '../../utils';

@Injectable()
export class FavoritesService {
  constructor(private client: favoritesTable) {}

  async getAll(): Promise<FavoritesResponse> {
    return this.client.findAll();
  }

  async createFavTrack(track: Track): Promise<Track | number> {
    const created = await this.client.insertTrack(track);

    if (!created) {
      return 0;
    }

    return track;
  }

  async createFavArtist(artist: Artist): Promise<Artist | number> {
    const created = await this.client.insertArtist(artist);

    if (!created) {
      return 0;
    }

    return artist;
  }

  async createFavAlbum(album: Album): Promise<Album | number> {
    const created = await this.client.insertAlbum(album);

    if (!created) {
      return 0;
    }

    return album;
  }

  async deleteTrack(track: Track): Promise<string[]> {
    return this.client.deleteTrack(track);
  }

  async deleteArtist(artist: Artist): Promise<string[]> {
    return this.client.deleteArtist(artist);
  }

  async deleteAlbum(album: Album): Promise<string[]> {
    return this.client.deleteAlbum(album);
  }

  @OnEvent('artist.deleted')
  async deleteArtistFromFavorites({ artistId }: { artistId: string }) {
    const artist: Artist = await request(
      'http://localhost:4000/artists',
      'get',
      artistId,
    );

    if (artist) {
      await this.client.deleteArtist(artist);
    }
  }

  @OnEvent('album.deleted')
  async deleteAlbumFromFavorites({ albumId }: { albumId: string }) {
    const album: Album = await request(
      'http://localhost:4000/albums',
      'get',
      albumId,
    );

    if (album) {
      await this.client.deleteAlbum(album);
    }
  }

  @OnEvent('track.deleted')
  async deleteTrackFromFavorites({ trackId }: { trackId: string }) {
    const track: Track = await request('http://localhost:4000', 'get', trackId);

    if (track) {
      await this.client.deleteTrack(track);
    }
  }
}
