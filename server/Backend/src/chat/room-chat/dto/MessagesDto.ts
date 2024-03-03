export type MessagesDto = MessagesDtoChild[];
export interface MessagesDtoChildSender {
	id: string;
	name: string;
	avatar: string;
}
export interface MessagesDtoChildReadedMessage {
	id: string;
	name: string;
	avatar: string;
}
export interface MessagesDtoChild {
	id: string;
	content: string;
	senderId: string;
	roomId: string;
	createdAt: Date;
	sender: MessagesDtoChildSender;
	ReadedMessage: MessagesDtoChildReadedMessage[];
}