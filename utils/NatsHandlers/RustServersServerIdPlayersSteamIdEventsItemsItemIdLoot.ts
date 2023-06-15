import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';
import { SocketMessage } from "../types";

let lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdLoot = 0;

export function HandleRustServersServerIdPlayersSteamIdEventsItemsItemIdLoot(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
    natsClient.jetStreamPushSubscribeToV0RustServersServerIdPlayersSteamIdEventsItemsItemIdLoot((err, msg, server_id, steam_id, item_id, jetstreamMsg) => {
      console.log('Got V0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdLoot', msg);
      jetstreamMsg ? lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdLoot = jetstreamMsg.seq : null;
      const socketMessage: SocketMessage = {
        msg: msg?.marshal(), 
        params: [{ name: 'server_id', value: server_id}, { name: 'steam_id', value: steam_id}, { name: 'item_id', value: item_id}], 
        channel: 'v0.rust.servers.{server_id}.events.player.{steam_id}.items.{item_id}.loot',
        sequence: lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdLoot,
        definitionLink: 'https://github.com/GamingAPI/definitions/blob/main/documents/components/schemas/ServerPlayerItemLoot.json',
        definitionLinkText: 'ServerPlayerItemLoot.json'
      };
      socketMessages.push(socketMessage);
      socketIo?.emit('newMessage', socketMessage);
    }, '*', '*', '*', {
      stream: "everything",
      ordered: true,
      config: {
        deliver_policy: Nats.DeliverPolicy.Last,
        ack_policy: Nats.AckPolicy.None
      }
    });
}
