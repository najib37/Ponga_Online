export type MessagesDto = MessagesDtoChild[];
export interface MessagesDtoChildSender {
	id: string;
	name: string;
	avatar: string;
}
export interface MessagesDtoChild {
	id: string;
	content: string;
	createdAt: Date;
	senderId: string;
	receiverId: string;
	readed: boolean;
	sender: MessagesDtoChildSender;
}