import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';
import { SocketMessage } from "../types";

let lastSeqV0RustServersServerIdEventsStopped = 0;

export function HandleRustServersServerIdEventsStopped(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
    natsClient.jetStreamPushSubscribeToV0RustServersServerIdEventsStopped((err, msg, server_id, jetstreamMsg) => {
      console.log('Got V0RustServersServerIdEventsStopped', msg);
      jetstreamMsg ? lastSeqV0RustServersServerIdEventsStopped = jetstreamMsg.seq : null;
      const socketMessage: SocketMessage = {
        msg: msg?.marshal(), 
        params: [{ name: 'server_id', value: server_id}], 
        channel: 'v0.rust.servers.{server_id}.events.stopped',
        sequence: lastSeqV0RustServersServerIdEventsStopped,
        definitionLink: 'https://github.com/GamingAPI/definitions/blob/main/documents/components/schemas/ServerStopped.json',
        definitionLinkText: 'ServerStopped.json'
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
