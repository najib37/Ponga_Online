import {RoomType} from "@prisma/client";


export class Room {
    id : string;
    name : string;
    roomOwner : string;
    type :RoomType
}

export class CheckMember {
    UserStatus : string;
    RoomType : RoomType
}