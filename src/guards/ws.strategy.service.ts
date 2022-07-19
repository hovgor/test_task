import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  public async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    if (
      client.handshake.headers['authorization'] &&
      client.handshake.headers['authorization'].split(' ')[0] === 'Bearer'
    ) {
      const token = (client.handshake.headers['authorization'] + '').split(
        ' ',
      )[1];
      const payload = await this.authService.afterDecode(token);
      const user = await this.authService.validateUser(payload, token);
      if (user) {
        client.user = user;
        return true;
      }
    }
  }
}
