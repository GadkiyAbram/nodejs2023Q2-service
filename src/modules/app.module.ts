import { Module } from '@nestjs/common';
import {
  AppController,
  UsersController,
  ArtistsController,
} from '../controllers';
import { AppService, UsersService, ArtistsService } from '../services';
import { ArtistsModule, AuthModule, UserModule } from '../modules';
import { usersTable, artistsTable } from '../../db/in-memory';

@Module({
  imports: [AuthModule, UserModule, ArtistsModule],
})
export class AppModule {}

// @Module({
//   imports: [AuthModule, UserModule, ArtistsModule],
//   controllers: [AppController, UsersController, ArtistsController],
//   providers: [
//     AppService,
//     UsersService,
//     ArtistsService,
//     usersTable,
//     artistsTable,
//   ],
// })
// export class AppModule {}
