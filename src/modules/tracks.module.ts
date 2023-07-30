import { Module } from '@nestjs/common';
import { tracksTable } from '../../db/in-memory';
import { TracksController } from '../controllers';
import { TracksService } from '../services';

@Module({
  controllers: [TracksController],
  providers: [TracksService, tracksTable],
})
export class TracksModule {}
