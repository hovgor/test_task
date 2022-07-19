import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from 'src/config/database.config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useExisting: DatabaseConfigService,
    }),
  ],
  // providers: [DatabaseService],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
