import { WebSocketServer, SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { subscribe } from 'diagnostics_channel';


@WebSocketGateway({ namespace: 'tracking', cors: true })
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private logger = new Logger('TrackingGateway');

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log("Client connected: ${client.id}")
  }

  handleDisconnect(client: Socket) {
    this.logger.log("Client disconnected: ${client.id}");
  }

  @SubscribeMessage('updateLocation')
  handleLocation(client: Socket, payload: { orderId: string; lat: string; lng: string }) {
    this.server.to('order: ${payload.orderId}').emit('locationUpdate', payload);
    return { ok: true };
  }

  @SubscribeMessage('joinOrder')
  joinOrder(client: Socket, orderId: string) {
    client.join('order: ${orderId}');
    return { ok: true, orderId };
  }
}
