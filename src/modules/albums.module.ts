import { Module } from '@nestjs/common';
import { AlbumsController } from '../controllers';
import { AlbumsService } from '../services';
import { albumsTable } from '../../db/in-memory';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [AlbumsController],
  providers: [AlbumsService, albumsTable],
})
export class AlbumsModule {}
