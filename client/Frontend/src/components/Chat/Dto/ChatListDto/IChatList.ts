export type IChatList = IChatListChild[];
export interface IChatListChildPerson {
	id: string;
	username: string;
	email: string;
	name: string;
	avatar: string;
}
export interface IChatListChildLastMessage {
	id: string;
	content: string;
	createdAt: string;
	senderId: string;
	receiverId: string;
}
export interface IChatListChild {
	person: IChatListChildPerson;
	lastMessage: IChatListChildLastMessage;
	unReadedMessage : number
}