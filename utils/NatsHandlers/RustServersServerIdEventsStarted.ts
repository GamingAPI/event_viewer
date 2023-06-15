import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';
import { SocketMessage } from "../types";

let lastSeqV0RustServersServerIdEventsStarted = 0;

export function HandleRustServersServerIdEventsStarted(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
	natsClient.jetStreamPushSubscribeToV0RustServersServerIdEventsStarted(
		(err, msg, server_id, jetstreamMsg) => {
			console.log('Got V0RustServersServerIdEventsStarted', msg);
			jetstreamMsg !== undefined
				? (lastSeqV0RustServersServerIdEventsStarted = jetstreamMsg.seq)
				: null;
			const socketMessage: SocketMessage = {
				msg: msg?.marshal(),
				params: [{ name: 'server_id', value: server_id }],
				channel: 'v0.rust.servers.{server_id}.events.started',
				sequence: lastSeqV0RustServersServerIdEventsStarted,
        definitionLink: 'https://github.com/GamingAPI/definitions/blob/main/documents/components/schemas/ServerStarted.json',
        definitionLinkText: 'ServerStarted.json'
			};
			socketMessages.push(socketMessage);
			socketIo?.emit('newMessage', socketMessage);
		},
		'*',
		{
			stream: 'everything',
			ordered: true,
			config: {
				deliver_policy: Nats.DeliverPolicy.Last,
				ack_policy: Nats.AckPolicy.None,
			},
		}
	);
}
