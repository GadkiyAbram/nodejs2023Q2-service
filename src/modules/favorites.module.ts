import { Module } from '@nestjs/common';
import { FavoritesController } from '../controllers/favorites.controller';
import { favoritesTable } from '../../db/in-memory';
import { FavoritesService } from '../services';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [FavoritesController],
  providers: [FavoritesService, favoritesTable],
})
export class FavoritesModule {}
