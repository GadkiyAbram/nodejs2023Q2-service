import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { ArtistsModule } from './artists.module';
import { TracksModule } from './tracks.module';
import { AlbumsModule } from './albums.module';
import { FavoritesModule } from './favorites.module';
import { PrismaModule } from './prisma.module';
import { ConfigModule } from '@nestjs/config';

export {
  ConfigModule,
  AuthModule,
  UserModule,
  ArtistsModule,
  TracksModule,
  AlbumsModule,
  FavoritesModule,
  PrismaModule,
};
