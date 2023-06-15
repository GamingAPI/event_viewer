import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';
import { SocketMessage } from "../types";

let lastSeqV0RustServersServerIdEventsWiped = 0;

export function HandleRustServersServerIdEventsWiped(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
    natsClient.jetStreamPushSubscribeToV0RustServersServerIdEventsWiped((err, msg, server_id, jetstreamMsg) => {
      console.log('Got V0RustServersServerIdEventsWiped', msg);
      jetstreamMsg ? lastSeqV0RustServersServerIdEventsWiped = jetstreamMsg.seq : null;
      const socketMessage: SocketMessage = {
        //msg: msg?.marshal(), 
        msg: '{}',
        params: [{ name: 'server_id', value: server_id}], 
        channel: 'v0.rust.servers.{server_id}.events.wiped',
        sequence: lastSeqV0RustServersServerIdEventsWiped,
        definitionLink: 'https://github.com/GamingAPI/definitions/blob/main/documents/components/schemas/ServerWiped.json',
        definitionLinkText: 'ServerWiped.json'
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
