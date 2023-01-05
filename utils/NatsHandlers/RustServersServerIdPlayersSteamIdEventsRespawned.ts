import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';

let lastSeqV0RustServersServerIdEventsPlayerSteamIdRespawned = 0;

export function HandleRustServersServerIdPlayersSteamIdEventsRespawned(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
    natsClient.jetStreamPushSubscribeToV0RustServersServerIdPlayersSteamIdEventsRespawned((err, msg, server_id, player_id, jetstreamMsg) => {
      console.log('Got V0RustServersServerIdEventsPlayerSteamIdRespawned', msg);
      jetstreamMsg ? lastSeqV0RustServersServerIdEventsPlayerSteamIdRespawned = jetstreamMsg.seq : null;
      const socketMessage = {
        msg: msg?.marshal(), 
        params: [{ name: 'server_id', value: server_id}, { name: 'player_id', value: player_id}], 
        channel: 'v0.rust.servers.{server_id}.events.player.{steam_id}.respawned',
        sequence: lastSeqV0RustServersServerIdEventsPlayerSteamIdRespawned
      };
      socketMessages.push(socketMessage);
      socketIo?.emit('newMessage', socketMessage);
    }, '*', '*', {
      stream: "everything",
      ordered: true,
      config: {
        opt_start_seq: lastSeqV0RustServersServerIdEventsPlayerSteamIdRespawned,
        ack_policy: Nats.AckPolicy.None
      }
    });
}
