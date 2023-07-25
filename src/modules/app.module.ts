import { Module } from '@nestjs/common';
import { AppController, UsersController } from '../controllers';
import { AppService, UsersService } from '../services';

@Module({
  imports: [],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
