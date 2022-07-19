import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import UserEntity from '../users/users.pg.entity';
import { jwtConstants } from './jwt.constants';
@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [AuthService, UsersService],
  exports: [AuthService],
})
export class AuthModule {}
