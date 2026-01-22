import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly onlineMap = new Map<
    string,
    { role: 'user' | 'barber'; id: number }
  >();

  emitNewMessage(payload: unknown) {
    this.server.emit('chat:new', payload);
  }

  handleConnection(client: Socket) {
    client.emit('presence:connected', { status: 'ok' });
  }

  handleDisconnect(client: Socket) {
    const meta = this.onlineMap.get(client.id);
    if (meta) {
      this.onlineMap.delete(client.id);
      this.server.emit('presence:offline', meta);
    }
  }

  @SubscribeMessage('presence:online')
  handlePresenceOnline(
    client: Socket,
    payload: { role: 'user' | 'barber'; id: number },
  ) {
    if (!payload?.role || !payload?.id) return;
    this.onlineMap.set(client.id, payload);
    this.server.emit('presence:online', payload);
  }

  @SubscribeMessage('presence:offline')
  handlePresenceOffline(client: Socket) {
    const meta = this.onlineMap.get(client.id);
    if (meta) {
      this.onlineMap.delete(client.id);
      this.server.emit('presence:offline', meta);
    }
  }

  @SubscribeMessage('chat:join')
  handleJoin(
    client: Socket,
    payload: { user_id: number; barber_id: number },
  ) {
    if (!payload?.user_id || !payload?.barber_id) return;
    client.join(this.roomName(payload.user_id, payload.barber_id));
  }

  @SubscribeMessage('typing:start')
  handleTypingStart(
    client: Socket,
    payload: { user_id: number; barber_id: number; sender_role: string },
  ) {
    if (!payload?.user_id || !payload?.barber_id) return;
    this.server
      .to(this.roomName(payload.user_id, payload.barber_id))
      .emit('typing:start', payload);
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    client: Socket,
    payload: { user_id: number; barber_id: number; sender_role: string },
  ) {
    if (!payload?.user_id || !payload?.barber_id) return;
    this.server
      .to(this.roomName(payload.user_id, payload.barber_id))
      .emit('typing:stop', payload);
  }

  private roomName(userId: number, barberId: number) {
    return `chat:${userId}:${barberId}`;
  }
}
