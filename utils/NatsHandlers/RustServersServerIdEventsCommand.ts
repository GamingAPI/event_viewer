import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';

let lastSeqV0RustServersServerIdEventsCommand = 0;

export function HandleRustServersServerIdEventsCommand(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
    natsClient.jetStreamPushSubscribeToV0RustServersServerIdEventsCommand((err, msg, server_id, jetstreamMsg) => {
      console.log('Got V0RustServersServerIdEventsCommand', msg);
      jetstreamMsg ? lastSeqV0RustServersServerIdEventsCommand = jetstreamMsg.seq : null;
      const socketMessage = {
        msg: msg?.marshal(), 
        params: [{ name: 'server_id', value: server_id}], 
        channel: 'v0.rust.servers.{server_id}.events.command',
        sequence: lastSeqV0RustServersServerIdEventsCommand
      };
      socketMessages.push(socketMessage);
      socketIo?.emit('newMessage', socketMessage);
    }, '*', {
      stream: "everything",
      ordered: true,
      config: {
        opt_start_seq: lastSeqV0RustServersServerIdEventsCommand,
        ack_policy: Nats.AckPolicy.None
      }
    });
}
