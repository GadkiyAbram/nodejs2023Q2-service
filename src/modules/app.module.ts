import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ArtistsModule,
  AuthModule,
  UserModule,
  TracksModule,
  AlbumsModule,
  FavoritesModule,
  LoggerModule,
} from '../modules';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from '../prisma/prisma.module';

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
    LoggerModule,
  ],
})
export class AppModule {}
