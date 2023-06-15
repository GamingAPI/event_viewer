import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';
import { SocketMessage } from "../types";

let lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbanned = 0;

export function HandleRustServersServerIdPlayersSteamIdEventsUnbanned(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
    natsClient.jetStreamPushSubscribeToV0RustServersServerIdPlayersSteamIdEventsUnbanned((err, msg, server_id, steam_id, jetstreamMsg) => {
      console.log('Got V0RustServersServerIdEventsPlayerSteamIdUnbanned', msg);
      jetstreamMsg ? lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbanned = jetstreamMsg.seq : null;
      const socketMessage: SocketMessage = {
        msg: msg?.marshal(), 
        params: [{ name: 'server_id', value: server_id}, { name: 'steam_id', value: steam_id}], 
        channel: 'v0.rust.servers.{server_id}.events.player.{steam_id}.unbanned',
        sequence: lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbanned,
        definitionLink: 'https://github.com/GamingAPI/definitions/blob/main/documents/components/schemas/ServerPlayerUnbanned.json',
        definitionLinkText: 'ServerPlayerUnbanned.json'
      };
      socketMessages.push(socketMessage);
      socketIo?.emit('newMessage', socketMessage);
    }, '*', '*', {
      stream: "everything",
      ordered: true,
      config: {
        deliver_policy: Nats.DeliverPolicy.Last,
        ack_policy: Nats.AckPolicy.None
      }
    });
}
