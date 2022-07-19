import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { useSwagger } from './swagger/swagger';
import { setConfig } from './app.config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static/'));
  app.setBaseViewsDir(join(__dirname, '..', 'static'));
  app.setViewEngine('hbs');
  setConfig(app);
  useSwagger(app);
  const PORT = process.env.PORT;
  const HOST = process.env.HOST;

  await app.listen(PORT, HOST);
  console.log(`Server is listening on http://${HOST}:${PORT}`);
}
bootstrap();
