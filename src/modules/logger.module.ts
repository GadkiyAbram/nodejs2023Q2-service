import { Global, Module } from '@nestjs/common';
import { LoggerService } from '../services';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
