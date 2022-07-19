import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('WsGeteway');

  afterInit(server: Server) {
    this.logger.log('initialize!!!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`client disconnected: ${client.id}`);
  }

  handleMessage(client: Socket, text: string): WsResponse<string> {
    return { event: 'messageToClient', data: text };
  }
}
