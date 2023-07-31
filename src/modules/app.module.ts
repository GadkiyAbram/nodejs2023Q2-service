import { Module } from '@nestjs/common';
import {
  ArtistsModule,
  AuthModule,
  UserModule,
  TracksModule,
  AlbumsModule,
  FavoritesModule,
} from '../modules';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ArtistsModule,
    TracksModule,
    AlbumsModule,
    FavoritesModule,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
