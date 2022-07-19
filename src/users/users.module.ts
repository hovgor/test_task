import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { HashPassword } from 'src/shared/password_hash/passwordHash';
import { UserValidator } from 'src/validaters/UserValidator';
import { UsersController } from './users.controller';
import UserEntity from './users.pg.entity';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    HashPassword,
    UserValidator,
    AuthService,
    JwtService,
  ],
})
export class UsersModule {}
