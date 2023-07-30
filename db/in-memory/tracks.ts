import { Track } from '../../src/interfaces';

export class TracksTable {
  _table: Map<string, Track>;

  constructor() {
    this._table = new Map<string, Track>();
  }

  async insert(track: Track): Promise<Map<string, Track>> {
    return this._table.set(track.id, track);
  }

  async findAll(): Promise<{ id: string; track: Track }[]> {
    return Array.from(this._table, ([id, track]) => ({ id, track }));
  }

  async findById(trackId: string): Promise<Track | null> {
    return this._table.get(trackId);
  }

  async deleteById(trackId: string): Promise<boolean> {
    return this._table.delete(trackId);
  }

  async updateById(track: Track): Promise<Map<string, Track>> {
    return this._table.set(track.id, track);
  }
}
