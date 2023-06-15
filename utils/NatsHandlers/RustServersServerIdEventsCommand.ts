import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';
import { SocketMessage } from "../types";

let lastSeqV0RustServersServerIdEventsCommand = 0;

export function HandleRustServersServerIdEventsCommand(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
    natsClient.jetStreamPushSubscribeToV0RustServersServerIdEventsCommand((err, msg, server_id, jetstreamMsg) => {
      console.log('Got V0RustServersServerIdEventsCommand', msg);
      jetstreamMsg ? lastSeqV0RustServersServerIdEventsCommand = jetstreamMsg.seq : null;
      const socketMessage: SocketMessage = {
        msg: msg?.marshal(), 
        params: [{ name: 'server_id', value: server_id}], 
        channel: 'v0.rust.servers.{server_id}.events.command',
        sequence: lastSeqV0RustServersServerIdEventsCommand,
        definitionLink: 'https://github.com/GamingAPI/definitions/blob/main/documents/components/schemas/ServerCommand.json',
        definitionLinkText: 'ServerCommand.json'
      };
      socketMessages.push(socketMessage);
      socketIo?.emit('newMessage', socketMessage);
    }, '*', {
      stream: "everything",
      ordered: true,
      config: {
        deliver_policy: Nats.DeliverPolicy.Last,
        ack_policy: Nats.AckPolicy.None
      }
    });
}
