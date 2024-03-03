export interface GroupMessage {
	msgs: GroupMsgs[];
	roomId: string;
}
export interface GroupReadedMessage {
	id : string;
	name: string;
	avatar: string;
}
export interface GroupMsgs {
	id: string;
	senderId: string;
	ReadedMessage: GroupReadedMessage;
}