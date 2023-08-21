import { Artist } from '../../src/interfaces';

export class ArtistsTable {
  _table: Map<string, Artist>;

  constructor() {
    this._table = new Map<string, Artist>();
  }

  async insert(artist: Artist): Promise<Map<string, Artist>> {
    return this._table.set(artist.id, artist);
  }

  async findAll(): Promise<{ id: string; artist: Artist }[]> {
    return Array.from(this._table, ([id, artist]) => ({ id, artist }));
  }

  async findById(artistId: string): Promise<Artist | null> {
    return this._table.get(artistId);
  }

  async deleteById(artistId: string): Promise<boolean> {
    return this._table.delete(artistId);
  }

  async updateById(artist: Artist): Promise<Map<string, Artist>> {
    return this._table.set(artist.id, artist);
  }
}
