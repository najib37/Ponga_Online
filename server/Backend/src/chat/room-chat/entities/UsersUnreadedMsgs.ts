export type UsersToSendEvent = users[]

type users = {
    senderId :string;
}


// id: string, senderId: string, ReadedMessage: {id: string, name: string, avatar: string}

export class unReadedMsgs {
    id : string;
    senderId : string;
    ReadedMessage? : Messages;
}


class Messages {
    id : string;
    name : string;
    avatar : string;
}