export type IMessages = MessagesChild[];

export interface MessagesChildSender {
    id: string;
    name: string;
    avatar: string;
}

export interface userReadedMsg {
    id: string;
    name: string;
    avatar: string
}

export interface MessagesChild {

    id: string;
    content: string;
    createdAt: string;
    senderId: string;
    receiverId: string;
    sender: MessagesChildSender;
    readed?: boolean;
    ReadedMessage? : userReadedMsg[];
    roomId? : string;
}