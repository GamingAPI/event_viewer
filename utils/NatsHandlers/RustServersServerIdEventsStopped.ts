import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';

let lastSeqV0RustServersServerIdEventsStopped = 0;

export function HandleRustServersServerIdEventsStopped(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
    natsClient.jetStreamPushSubscribeToV0RustServersServerIdEventsStopped((err, msg, server_id, jetstreamMsg) => {
      console.log('Got V0RustServersServerIdEventsStopped', msg);
      jetstreamMsg ? lastSeqV0RustServersServerIdEventsStopped = jetstreamMsg.seq : null;
      const socketMessage = {
        msg: msg?.marshal(), 
        params: [{ name: 'server_id', value: server_id}], 
        channel: 'v0.rust.servers.{server_id}.events.stopped',
        sequence: lastSeqV0RustServersServerIdEventsStopped
      };
      socketMessages.push(socketMessage);
      socketIo?.emit('newMessage', socketMessage);
    }, '*', {
      stream: "everything",
      ordered: true,
      config: {
        opt_start_seq: lastSeqV0RustServersServerIdEventsStopped,
        ack_policy: Nats.AckPolicy.None
      }
    });
}
