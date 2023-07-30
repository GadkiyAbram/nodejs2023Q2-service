import { Module } from '@nestjs/common';
import {
  ArtistsModule,
  AuthModule,
  UserModule,
  TracksModule,
} from '../modules';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ArtistsModule,
    TracksModule,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
