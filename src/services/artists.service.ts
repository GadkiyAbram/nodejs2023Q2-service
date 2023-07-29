import { Injectable } from '@nestjs/common';
import { artistsTable } from '../../db/in-memory';
import { Artist, User } from '../interfaces';
import { v4 as uuidV4 } from 'uuid';
import { UpdatePasswordDto } from '../interfaces/dtos';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class ArtistsService {
  constructor(private client: artistsTable) {}

  async getAll(): Promise<{ id: string; artist: Artist }[]> {
    return this.client.findAll();
  }

  async getById(artistId: string): Promise<Artist | null> {
    return (await this.client.findById(artistId)) || null;
  }

  async createArtist(artist: Artist): Promise<Artist | null | number> {
    const artistId: string = uuidV4();

    const created = await this.client.insert({
      ...artist,
      id: artistId,
    });

    if (created) {
      return this.client.findById(artistId);
    }

    return 0;
  }

  async deleteArtist(artistId: string): Promise<boolean | number> {
    const artist = (await this.getById(artistId)) || null;

    if (!artist) {
      return 0;
    }

    return this.client.deleteById(artistId);
  }

  async updateArtist(
    artistId: string,
    newData: Artist,
  ): Promise<Artist | number> {
    const artist: Artist = (await this.getById(artistId)) || null;

    if (!artist) {
      return 0;
    }

    const updatedArtist: Artist = {
      ...artist,
      name: newData.name,
      grammy: newData.grammy,
    };

    const updated = this.client.updateById(updatedArtist);

    if (updated) {
      return updatedArtist;
    }

    return 0;
  }
}
