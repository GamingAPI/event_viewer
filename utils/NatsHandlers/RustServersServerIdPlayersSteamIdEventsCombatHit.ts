import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';
import { SocketMessage } from "../types";

let lastSeqV0RustServersServerIdEventsPlayerSteamIdCombatHit = 0;

export function HandleRustServersServerIdPlayersSteamIdEventsCombatHit(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
    natsClient.jetStreamPushSubscribeToV0RustServersServerIdPlayersSteamIdEventsCombatHit((err, msg, server_id, steam_id, jetstreamMsg) => {
      console.log('Got V0RustServersServerIdEventsPlayerSteamIdCombatHit', msg);
      jetstreamMsg ? lastSeqV0RustServersServerIdEventsPlayerSteamIdCombatHit = jetstreamMsg.seq : null;
      const socketMessage: SocketMessage = {
        msg: msg?.marshal(), 
        params: [{ name: 'server_id', value: server_id}, { name: 'steam_id', value: steam_id}], 
        channel: 'v0.rust.servers.{server_id}.events.player.{steam_id}.combat.hit',
        sequence: lastSeqV0RustServersServerIdEventsPlayerSteamIdCombatHit,
        definitionLink: 'https://github.com/GamingAPI/definitions/blob/main/documents/components/schemas/ServerPlayerCombatPlayerhit.json',
        definitionLinkText: 'ServerPlayerCombatPlayerhit.json'
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
