import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';
import { SocketMessage } from "../types";

let lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdCrafted = 0;

export function HandleRustServersServerIdPlayersSteamIdEventsItemsItemIdCrafted(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
    natsClient.jetStreamPushSubscribeToV0RustServersServerIdPlayersSteamIdEventsItemsItemIdCrafted((err, msg, server_id, steam_id, item_id, jetstreamMsg) => {
      console.log('Got V0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdCrafted', msg);
      jetstreamMsg ? lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdCrafted = jetstreamMsg.seq : null;
      const socketMessage: SocketMessage = {
        msg: msg?.marshal(), 
        params: [{ name: 'server_id', value: server_id}, { name: 'steam_id', value: steam_id}, { name: 'item_id', value: item_id}], 
        channel: 'v0.rust.servers.{server_id}.events.player.{steam_id}.items.{item_id}.crafted',
        sequence: lastSeqV0RustServersServerIdEventsPlayerSteamIdUnbannedItemsItemIdCrafted,
        definitionLink: 'https://github.com/GamingAPI/definitions/blob/main/documents/components/schemas/ServerPlayerItemCrafted.json',
        definitionLinkText: 'ServerPlayerItemCrafted.json'
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
