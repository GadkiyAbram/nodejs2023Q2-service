import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { load as loadYaml } from 'js-yaml';
import { config } from 'dotenv';
import * as process from 'process';
import {
  LoggerService,
  UncaughtExceptionHandler,
  UnhandledRejectionHandler,
} from './services';

config();

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

async function setupSwagger(app) {
  SwaggerModule.setup(
    'api',
    app,
    loadYaml(await readFile('./doc/api.yaml', 'utf8')),
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  const uncaughtExceptionHandler = new UncaughtExceptionHandler();
  const unhandledRejectionHandler = new UnhandledRejectionHandler();

  await setupSwagger(app);

  process.on('uncaughtException', (error) => {
    uncaughtExceptionHandler.handle(error);
  });

  process.on('unhandledRejectionException', (error) => {
    unhandledRejectionHandler.handle(error);
  });

  console.log(`Server started on port ${PORT}`);
  await app.listen(PORT);
}
bootstrap();
