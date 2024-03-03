export interface createMessageDto {
	id: string;
	content: string;
	createdAt: Date;
	senderId: string;
	receiverId: string;
	readed: boolean;
	sender: User;
	receiver: User;
}


interface User {
	id: string;
	name: string;
	avatar: string;
}