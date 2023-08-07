export interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version?: number; // integer number, increments on update
  createdAt?: bigint; // timestamp of creation
  updatedAt?: bigint; // timestamp of last update
}
