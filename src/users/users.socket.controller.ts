import {
  Controller,
  Logger,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { WsJwtGuard } from 'src/guards/ws.strategy.service';
import { UserRoles } from 'src/types/roles';
import { WsMessages } from 'src/ws/ws.messages';
import { UsersService } from './users.service';

@Controller()
@WebSocketGateway({
  namespace: 'users',
})
@UseGuards(WsJwtGuard, RolesGuard)
export default class UsersSocketController implements OnGatewayConnection {
  @WebSocketServer()
  public readonly server: any;
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  public async handleConnection(socket: Socket) {
    try {
      if (socket.handshake.headers['authorization']) {
        const token = (socket.handshake.headers['authorization'] + '').split(
          ' ',
        )[1];
        const payload = this.authService.afterDecode(token);
        const user = await this.authService.validateUser(payload, token);
        if (user.role === UserRoles.Guest) {
          socket.emit('message', { message: WsMessages.Guest });
        } else if (user.role === UserRoles.User) {
          socket.emit('message', { message: WsMessages.User });
        } else if (user.role === UserRoles.Supervisor) {
          socket.emit('message', { message: WsMessages.Supervisor });
        } else if (user.role === UserRoles.Admin) {
          socket.emit('message', { message: WsMessages.Admin });
        } else {
          socket.emit('exception', { message: WsMessages.unauthorized });
          return socket.disconnect();
        }
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
