import { Favorites } from '../../src/interfaces';

export class FavoritesTable {
  _table: Map<string, Favorites>;

  constructor() {
    this._table = new Map<string, Favorites>();
  }

  async insert(
    favoriteId: string,
    favorite: Favorites,
  ): Promise<Map<string, Favorites>> {
    return this._table.set(favoriteId, favorite);
  }

  async findAll(): Promise<{ id: string; favorite: Favorites }[]> {
    return Array.from(this._table, ([id, favorite]) => ({ id, favorite }));
  }

  async findById(favoriteId: string): Promise<Favorites | null> {
    return this._table.get(favoriteId);
  }

  async deleteById(favoriteId: string): Promise<boolean> {
    return this._table.delete(favoriteId);
  }

  async updateById(
    favoriteId: string,
    favorite: Favorites,
  ): Promise<Map<string, Favorites>> {
    return this._table.set(favoriteId, favorite);
  }
}
