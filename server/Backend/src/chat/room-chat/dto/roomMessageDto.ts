// {sender: {id: string, name: string, avatar: string}, roomUserId: {name: string}}



export class roomMessageDto {
    sender : userSender;
    roomUserId : {
        name : string;
    }
}

class userSender {
    id: string;
    name: string;
    avatar: string;
}