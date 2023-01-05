import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';

let lastSeqV0RustServersServerIdEventsPlayerSteamIdChatted = 0;

export function HandleRustServersServerIdEventsPlayerSteamIdChatted(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
    natsClient.jetStreamPushSubscribeToV0RustServersServerIdEventsPlayerSteamIdChatted((err, msg, server_id, player_id, jetstreamMsg) => {
      console.log('Got V0RustServersServerIdEventsPlayerSteamIdChatted', msg);
      jetstreamMsg ? lastSeqV0RustServersServerIdEventsPlayerSteamIdChatted = jetstreamMsg.seq : null;
      const socketMessage = {
        msg: msg?.marshal(), 
        params: [{ name: 'server_id', value: server_id}, { name: 'player_id', value: player_id}], 
        channel: 'v0.rust.servers.{server_id}.events.player.{steam_id}.chatted',
        sequence: lastSeqV0RustServersServerIdEventsPlayerSteamIdChatted
      };
      socketMessages.push(socketMessage);
      socketIo?.emit('newMessage', socketMessage);
    }, '*', '*', {
      stream: "everything",
      ordered: true,
      config: {
        opt_start_seq: lastSeqV0RustServersServerIdEventsPlayerSteamIdChatted,
        ack_policy: Nats.AckPolicy.None
      }
    });
}
