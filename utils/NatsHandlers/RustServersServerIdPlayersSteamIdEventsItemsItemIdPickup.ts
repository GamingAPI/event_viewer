import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';

let lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdPickup = 0;

export function HandleRustServersServerIdPlayersSteamIdEventsItemsItemIdPickup(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
    natsClient.jetStreamPushSubscribeToV0RustServersServerIdPlayersSteamIdEventsItemsItemIdPickup((err, msg, server_id, player_id, item_id, jetstreamMsg) => {
      console.log('Got V0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdPickup', msg);
      jetstreamMsg ? lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdPickup = jetstreamMsg.seq : null;
      const socketMessage = {
        msg: msg?.marshal(), 
        params: [{ name: 'server_id', value: server_id}, { name: 'player_id', value: player_id}], 
        channel: 'v0.rust.servers.{server_id}.events.player.{steam_id}.items.{item_id}.pickup',
        sequence: lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdPickup
      };
      socketMessages.push(socketMessage);
      socketIo?.emit('newMessage', socketMessage);
    }, '*', '*', '*', {
      stream: "everything",
      ordered: true,
      config: {
        opt_start_seq: lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdPickup,
        ack_policy: Nats.AckPolicy.None
      }
    });
}
