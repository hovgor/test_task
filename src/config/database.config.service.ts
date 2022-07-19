import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigEnum } from './config.enum';
import { ConfigService } from './config.service';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'default',
      type: 'mysql',
      host: this.configService.get(ConfigEnum.DATABASE_HOST) || 'localhost',
      port: this.configService.get(ConfigEnum.DATABASE_PORT) || 3306,
      username: this.configService.get(ConfigEnum.DATABASE_USERNAME) || 'admin',
      password:
        this.configService.get(ConfigEnum.DATABASE_PASSWORD) || 'password',
      database: this.configService.get(ConfigEnum.DATABASE_NAME) || 'my_db',
      logging: false,
      entities: [process.cwd(), '**/*.pg.entity.{js, ts}'],
      synchronize: true,
      migrationsRun: false,
    };
  }
}
