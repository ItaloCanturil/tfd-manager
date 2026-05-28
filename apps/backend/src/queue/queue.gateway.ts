import {
  MessageBody,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { type Server, type Socket } from "@nestjs/platform-socket.io";

@WebSocketGateway({ cor: true })
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Device connected ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Device disconnected ${client.id}`);
  }

  @SubscribeMessage("call_patient")
  handleCallPatient(@MessageBody() data: { ticketId: string; room: string }) {
    console.log(`Room called ${data}`);

    this.server.emit("patient_called", data);

    return { event: "call_patient_ack", data: { success: true } };
  }
}
