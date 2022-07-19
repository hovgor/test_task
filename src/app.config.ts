import { INestApplication } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { ConfigEnum } from './config/config.enum';
import { ConfigService } from './config/config.service';

export function setConfig(app: INestApplication): void {
  const GLOBAL_PREFIX = app.get(ConfigService).get(ConfigEnum.GLOBAL_PREFIX);

  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
}
