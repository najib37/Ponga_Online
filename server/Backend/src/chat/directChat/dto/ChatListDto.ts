
export type IChatList = ChatListDto[]

export interface ChatListDto {
	person: ChatListDtoPerson;
	lastMessage: ChatListDtoLastMessage;
	unReadedMessage: number;
}
export interface ChatListDtoPerson {
	id: string;
	name: string;
	avatar: string;
}
export interface ChatListDtoLastMessage {
	id: string;
	content: string;
	createdAt: Date;
	senderId: string;
	receiverId: string;
	readed: boolean;
}