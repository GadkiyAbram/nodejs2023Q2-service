import { AppService } from './app.service';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { ArtistsService } from './artists.service';
import { TracksService } from './tracks.service';
import { AlbumsService } from './albums.service';
import { FavoritesService } from './favorites.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

export {
  ConfigService,
  PrismaService,
  AppService,
  UsersService,
  AuthService,
  ArtistsService,
  TracksService,
  AlbumsService,
  FavoritesService,
};
