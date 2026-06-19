import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway {
  @WebSocketServer() server!: Server;

  constructor(private chat: ChatService) {
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
    return { ok: true, room };
  }

  @SubscribeMessage('sendMessage')
  async onMessage(@MessageBody() payload: { senderId: string, roomId: string, content: string }, @ConnectedSocket() client: Socket) {
    const saved = this.chat.save(payload);
    this.server.to(payload.roomId).emit('newMessage', saved);
    return saved;
  }

}
