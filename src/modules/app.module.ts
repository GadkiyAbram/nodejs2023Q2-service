import { Module } from '@nestjs/common';
import {
  ArtistsModule,
  AuthModule,
  UserModule,
  TracksModule,
  AlbumsModule,
} from '../modules';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ArtistsModule,
    TracksModule,
    AlbumsModule,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
