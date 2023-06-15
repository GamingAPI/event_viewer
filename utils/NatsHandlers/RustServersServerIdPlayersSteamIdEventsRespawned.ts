import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';
import { SocketMessage } from "../types";

let lastSeqV0RustServersServerIdEventsPlayerSteamIdRespawned = 0;

export function HandleRustServersServerIdPlayersSteamIdEventsRespawned(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
    natsClient.jetStreamPushSubscribeToV0RustServersServerIdPlayersSteamIdEventsRespawned((err, msg, server_id, steam_id, jetstreamMsg) => {
      console.log('Got V0RustServersServerIdEventsPlayerSteamIdRespawned', msg);
      jetstreamMsg ? lastSeqV0RustServersServerIdEventsPlayerSteamIdRespawned = jetstreamMsg.seq : null;
      const socketMessage: SocketMessage = {
        msg: msg?.marshal(), 
        params: [{ name: 'server_id', value: server_id}, { name: 'steam_id', value: steam_id}], 
        channel: 'v0.rust.servers.{server_id}.events.player.{steam_id}.respawned',
        sequence: lastSeqV0RustServersServerIdEventsPlayerSteamIdRespawned,
        definitionLink: 'https://github.com/GamingAPI/definitions/blob/main/documents/components/schemas/ServerPlayerRespawned.json',
        definitionLinkText: 'ServerPlayerRespawned.json'
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
