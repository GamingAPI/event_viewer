import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';

let lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdLoot = 0;

export function HandleRustServersServerIdPlayersSteamIdEventsItemsItemIdLoot(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
    natsClient.jetStreamPushSubscribeToV0RustServersServerIdPlayersSteamIdEventsItemsItemIdLoot((err, msg, server_id, player_id, item_id, jetstreamMsg) => {
      console.log('Got V0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdLoot', msg);
      jetstreamMsg ? lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdLoot = jetstreamMsg.seq : null;
      const socketMessage = {
        msg: msg?.marshal(), 
        params: [{ name: 'server_id', value: server_id}, { name: 'player_id', value: player_id}], 
        channel: 'v0.rust.servers.{server_id}.events.player.{steam_id}.items.{item_id}.loot',
        sequence: lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdLoot
      };
      socketMessages.push(socketMessage);
      socketIo?.emit('newMessage', socketMessage);
    }, '*', '*', '*', {
      stream: "everything",
      ordered: true,
      config: {
        opt_start_seq: lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdLoot,
        ack_policy: Nats.AckPolicy.None
      }
    });
}
