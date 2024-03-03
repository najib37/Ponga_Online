

import {RoomUserState} from "@prisma/client";


export type RoomUsers = RoomUserDto[]

export class RoomUserDto {
    userId : string;
    roomId : string;
    state : RoomUserState;
    muteDuration: Date
}