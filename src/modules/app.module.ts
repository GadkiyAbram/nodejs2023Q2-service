import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ArtistsModule,
  AuthModule,
  UserModule,
  TracksModule,
  AlbumsModule,
  FavoritesModule,
  PrismaModule,
} from '../modules';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    ArtistsModule,
    TracksModule,
    AlbumsModule,
    FavoritesModule,
  ],
})
export class AppModule {}
