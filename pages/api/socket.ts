import * as dotenv from 'dotenv';
dotenv.config();
import { Server } from 'socket.io';
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';
import { MaxQueue } from '../../utils/MaxQueue';
import { HandleRustServersServerIdEventsStarted } from '../../utils/NatsHandlers/RustServersServerIdEventsStarted';
import { HandleRustServersServerIdEventsCommand } from '../../utils/NatsHandlers/RustServersServerIdEventsCommand';
import { HandleRustServersServerIdEventsPlayerSteamIdChatted } from '../../utils/NatsHandlers/RustServersServerIdEventsPlayerSteamIdChatted';
import { HandleRustServersServerIdEventsStopped } from '../../utils/NatsHandlers/RustServersServerIdEventsStopped';
import { HandleRustServersServerIdEventsWiped } from '../../utils/NatsHandlers/RustServersServerIdEventsWiped';
import { HandleRustServersServerIdPlayersSteamIdEventsBanned } from '../../utils/NatsHandlers/RustServersServerIdPlayersSteamIdEventsBanned';
import { HandleRustServersServerIdPlayersSteamIdEventsCombatHit } from '../../utils/NatsHandlers/RustServersServerIdPlayersSteamIdEventsCombatHit';
import { HandleRustServersServerIdPlayersSteamIdEventsConnected } from '../../utils/NatsHandlers/RustServersServerIdPlayersSteamIdEventsConnected';
import { HandleRustServersServerIdPlayersSteamIdEventsGatheredResources } from '../../utils/NatsHandlers/RustServersServerIdPlayersSteamIdEventsGatheredResources';
import { HandleRustServersServerIdPlayersSteamIdEventsItemsItemIdCrafted } from '../../utils/NatsHandlers/RustServersServerIdPlayersSteamIdEventsItemsItemIdCrafted';
import { HandleRustServersServerIdPlayersSteamIdEventsItemsItemIdLoot } from '../../utils/NatsHandlers/RustServersServerIdPlayersSteamIdEventsItemsItemIdLoot';
import { HandleRustServersServerIdPlayersSteamIdEventsItemsItemIdPickup } from '../../utils/NatsHandlers/RustServersServerIdPlayersSteamIdEventsItemsItemIdPickup';
import { HandleRustServersServerIdPlayersSteamIdEventsReported } from '../../utils/NatsHandlers/RustServersServerIdPlayersSteamIdEventsReported';
import { HandleRustServersServerIdPlayersSteamIdEventsRespawned } from '../../utils/NatsHandlers/RustServersServerIdPlayersSteamIdEventsRespawned';
import { HandleRustServersServerIdPlayersSteamIdEventsUnbanned } from '../../utils/NatsHandlers/RustServersServerIdPlayersSteamIdEventsUnbanned';
import { HandleRustServersServerIdPlayersSteamIdEventsDisconnected } from '../../utils/NatsHandlers/RustServersServerIdPlayersSteamIdEventsDisconnected';

const creds = process.env.NATS_AUTHENTICATION;

const natsClient = new NatsAsyncApiClient();
const socketMessages: MaxQueue = new MaxQueue({maxSize: 10});
const setupNats = async (socketIo: Server) => {
  try {
    await natsClient.connect({
      servers: process.env.NATS_AUTHENTICATION_URL ? process.env.NATS_AUTHENTICATION_URL : "nats://localhost:4222",
      authenticator: Nats.nkeyAuthenticator(new TextEncoder().encode(creds)),
    });
    HandleRustServersServerIdEventsCommand(socketIo, socketMessages, natsClient); 
    HandleRustServersServerIdEventsPlayerSteamIdChatted(socketIo, socketMessages, natsClient); 
    HandleRustServersServerIdEventsStarted(socketIo, socketMessages, natsClient); 
    HandleRustServersServerIdEventsStopped(socketIo, socketMessages, natsClient); 
    HandleRustServersServerIdEventsWiped(socketIo, socketMessages, natsClient); 
    HandleRustServersServerIdPlayersSteamIdEventsBanned(socketIo, socketMessages, natsClient); 
    HandleRustServersServerIdPlayersSteamIdEventsCombatHit(socketIo, socketMessages, natsClient); 
    HandleRustServersServerIdPlayersSteamIdEventsConnected(socketIo, socketMessages, natsClient); 
    HandleRustServersServerIdPlayersSteamIdEventsDisconnected(socketIo, socketMessages, natsClient); 
    HandleRustServersServerIdPlayersSteamIdEventsGatheredResources(socketIo, socketMessages, natsClient); 
    HandleRustServersServerIdPlayersSteamIdEventsItemsItemIdCrafted(socketIo, socketMessages, natsClient); 
    HandleRustServersServerIdPlayersSteamIdEventsItemsItemIdLoot(socketIo, socketMessages, natsClient); 
    HandleRustServersServerIdPlayersSteamIdEventsItemsItemIdPickup(socketIo, socketMessages, natsClient); 
    HandleRustServersServerIdPlayersSteamIdEventsReported(socketIo, socketMessages, natsClient); 
    HandleRustServersServerIdPlayersSteamIdEventsRespawned(socketIo, socketMessages, natsClient); 
    HandleRustServersServerIdPlayersSteamIdEventsUnbanned(socketIo, socketMessages, natsClient); 
  } catch(e) {
    console.error(e);
  }
}

const SocketHandler = (
  req: any,
  res: any) => {
  if (res.socket.server.io) {
  } else {
    console.log('Socket is initializing');
    const socketIo = new Server(res.socket.server);
    res.socket.server.io = socketIo;
    setupNats(socketIo);
    socketIo.on('connection', socket => {
      socket.emit('init-messages', socketMessages.elements);
    });
  }
  res.end();
}

export default SocketHandler;