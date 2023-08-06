import { Injectable } from '@nestjs/common';
import { Artist } from '../interfaces';
import { v4 as uuidV4 } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(
    private client: PrismaService,
    private _artistsServiceEmitter: EventEmitter2,
  ) {}

  async getAll(): Promise<Artist[] | []> {
    return this.client.artist.findMany();
  }

  async getById(artistId: string): Promise<Artist | null> {
    return (
      (await this.client.artist.findUnique({
        where: {
          id: artistId,
        },
      })) || null
    );
  }

  async createArtist(artist: Artist): Promise<Artist | null | number> {
    const artistId: string = uuidV4();

    const created = await this.client.artist.create({
      data: {
        ...artist,
        id: artistId,
      },
    });

    if (created) {
      return this.client.artist.findUnique({
        where: {
          id: artistId,
        },
      });
    }

    return 0;
  }

  async deleteArtist(artistId: string): Promise<boolean | number> {
    const artist = (await this.getById(artistId)) || null;

    if (!artist) {
      return 0;
    }

    const deleted =
      (await this.client.artist.delete({
        where: {
          id: artistId,
        },
      })) || 0;

    if (deleted) {
      this._artistsServiceEmitter.emit('artist.deleted', { artistId });

      return true;
    }

    return 0;
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

    const updated = await this.client.artist.update({
      where: {
        id: artistId,
      },
      data: updatedArtist,
    });

    if (updated) {
      return updatedArtist;
    }

    return 0;
  }
}
