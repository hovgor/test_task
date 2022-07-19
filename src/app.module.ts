import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
// import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WsGateway } from './ws/ws.gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule, ConfigModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [WsGateway, AppService],
})
export class AppModule {}
