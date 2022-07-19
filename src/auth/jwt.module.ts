// Packages
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Providers
import { JWTConfigService } from '../config/jwt.config.service';
import { AuthService } from './auth.service';
import { jwtConstants } from './jwt.constants';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useExisting: JWTConfigService,
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  exports: [JwtModule, AuthService],
})
export class JWTModule {}
