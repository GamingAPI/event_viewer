import { Server } from "socket.io";
import { MaxQueue } from "../MaxQueue";
import * as Nats from 'nats';
import { NatsAsyncApiClient } from '@gamingapi/rust-ts-public-api';

let lastSeqV0RustServersServerIdEventsStarted = 0;

export function HandleRustServersServerIdEventsStarted(socketIo: Server, socketMessages: MaxQueue, natsClient: NatsAsyncApiClient ) {
	natsClient.jetStreamPushSubscribeToV0RustServersServerIdEventsStarted(
		(err, msg, server_id, jetstreamMsg) => {
			console.log('Got V0RustServersServerIdEventsStarted', msg);
			jetstreamMsg !== undefined
				? (lastSeqV0RustServersServerIdEventsStarted = jetstreamMsg.seq)
				: null;
			const socketMessage = {
				msg: msg?.marshal(),
				params: [{ name: 'server_id', value: server_id }],
				channel: 'v0.rust.servers.{server_id}.events.started',
				sequence: lastSeqV0RustServersServerIdEventsStarted,
			};
			socketMessages.push(socketMessage);
			socketIo?.emit('newMessage', socketMessage);
		},
		'*',
		{
			stream: 'everything',
			ordered: true,
			config: {
				opt_start_seq: lastSeqV0RustServersServerIdEventsStarted,
				ack_policy: Nats.AckPolicy.None,
			},
		}
	);
}
