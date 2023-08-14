import { Album, Artist, FavoritesResponse, Track } from '../interfaces';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private client: PrismaService) {}

  async getAll(): Promise<FavoritesResponse> {
    const [artistsNames, albumsNames, tracksNames] = await Promise.all([
      this.client.favoriteArtists.findMany(),
      this.client.favoriteAlbums.findMany(),
      this.client.favoriteTracks.findMany(),
    ]);

    const [artists, albums, tracks] = await Promise.all([
      this.client.artist.findMany({
        where: { name: { in: artistsNames.map(({ name }) => name) } },
      }),
      this.client.album.findMany({
        where: { name: { in: albumsNames.map(({ name }) => name) } },
      }),
      this.client.track.findMany({
        where: { name: { in: tracksNames.map(({ name }) => name) } },
      }),
    ]);

    return {
      artists,
      albums,
      tracks,
    };
  }

  async createFavTrack(track: Track): Promise<boolean | number> {
    const created = await this.client.favoriteTracks.create({
      data: {
        id: track.id,
        name: track.name,
      },
    });

    if (!created) {
      return 0;
    }

    return true;
  }

  async createFavArtist(artist: Artist): Promise<boolean | number> {
    const created = await this.client.favoriteArtists.create({
      data: {
        id: artist.id,
        name: artist.name,
      },
    });

    if (!created) {
      return 0;
    }

    return true;
  }

  async createFavAlbum(album: Album): Promise<Album | number> {
    const created = await this.client.favoriteAlbums.create({
      data: {
        id: album.id,
        name: album.name,
      },
    });

    if (!created) {
      return 0;
    }

    return album;
  }

  async deleteTrack(track: Track): Promise<boolean | number> {
    const searchTrack = await this.client.favoriteTracks.findUnique({
      where: {
        id: track.id,
      },
    });

    if (!searchTrack) {
      return 0;
    }

    const deleted = await this.client.favoriteTracks.delete({
      where: {
        id: track.id,
      },
    });

    return deleted ? true : 0;
  }

  async deleteArtist(artist: Artist): Promise<boolean | number> {
    const searchArtist = await this.client.favoriteAlbums.findUnique({
      where: {
        id: artist.id,
      },
    });

    if (!searchArtist) {
      return 0;
    }

    const deleted = await this.client.favoriteArtists.delete({
      where: {
        id: artist.id,
      },
    });

    return deleted ? true : 0;
  }

  async deleteAlbum(album: Album): Promise<boolean | number> {
    const searchAlbum = await this.client.favoriteAlbums.findUnique({
      where: {
        id: album.id,
      },
    });

    if (!searchAlbum) {
      return 0;
    }

    const deleted = await this.client.favoriteAlbums.delete({
      where: {
        id: album.id,
      },
    });

    return deleted ? true : 0;
  }
}
