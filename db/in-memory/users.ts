import { User } from '../../src/interfaces';

export class UsersTable {
  _table: Map<string, User>;

  constructor() {
    this._table = new Map<string, User>();
  }

  async insert(user: User): Promise<{
    id: string;
    login: string;
    version: number;
    createdAt: bigint;
    updatedAt: bigint;
  }> {
    this._table.set(user.id, user);

    const { id, login, version, createdAt, updatedAt } = await this.findById(
      user.id,
    );

    return {
      id,
      login,
      version,
      createdAt,
      updatedAt,
    };
  }

  async findAll(): Promise<{ id: string; user: User }[]> {
    return Array.from(this._table, ([id, user]) => ({ id, user }));
  }

  async findById(userId: string): Promise<User | null> {
    return this._table.get(userId) || null;
  }

  async deleteById(userId: string): Promise<boolean> {
    return this._table.delete(userId);
  }

  async updateById(user: User): Promise<{
    id: string;
    login: string;
    version: number;
    createdAt: bigint;
    updatedAt: bigint;
  }> {
    this._table.set(user.id, user);

    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
