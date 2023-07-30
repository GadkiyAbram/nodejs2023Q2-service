import { Album } from '../../src/interfaces';

export class AlbumsTable {
  _table: Map<string, Album>;

  constructor() {
    this._table = new Map<string, Album>();
  }

  async insert(album: Album): Promise<Map<string, Album>> {
    return this._table.set(album.id, album);
  }

  async findAll(): Promise<{ id: string; album: Album }[]> {
    return Array.from(this._table, ([id, album]) => ({ id, album }));
  }

  async findById(albumId: string): Promise<Album | null> {
    return this._table.get(albumId);
  }

  async deleteById(albumId: string): Promise<boolean> {
    return this._table.delete(albumId);
  }

  async updateById(album: Album): Promise<Map<string, Album>> {
    return this._table.set(album.id, album);
  }
}