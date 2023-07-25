import * as process from 'process';
import * as inMemoryData from '../db/in-memory';

export const config = {
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
  memory: {
    username: process.env.MEMORY_USERNAME,
    password: process.env.MEMORY_PASSWORD,
    data: inMemoryData,
  },
};
