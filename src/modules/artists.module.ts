import { Module } from '@nestjs/common';
import { ArtistsController } from '../controllers';
import { ArtistsService } from '../services';
import { artistsTable } from '../../db/in-memory';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [ArtistsController],
  providers: [ArtistsService, artistsTable],
})
export class ArtistsModule {}
