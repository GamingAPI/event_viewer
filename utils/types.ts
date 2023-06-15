export interface SocketMessage {
	msg: string | undefined;
	params: {name: string, value: any}[];
	channel: string;
	sequence: number;
	definitionLink: string;
	definitionLinkText: string;
}