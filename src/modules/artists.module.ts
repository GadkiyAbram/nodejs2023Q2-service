import { Module } from '@nestjs/common';
import { ArtistsController } from '../controllers';
import { ArtistsService } from '../services';
import { artistsTable } from '../../db/in-memory';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService, artistsTable],
})
export class ArtistsModule {}
