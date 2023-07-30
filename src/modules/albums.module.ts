import { Module } from '@nestjs/common';
import { AlbumsController } from '../controllers';
import { AlbumsService } from '../services';
import { albumsTable } from '../../db/in-memory';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService, albumsTable],
})
export class AlbumsModule {}
