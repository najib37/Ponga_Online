
import {RoomType, RoomUserState} from "@prisma/client";

export type roomUsersAndAdmins = usersRooms;

class usersRooms {
    type : RoomType;

    admins : {
      id :string
    }[];

    RoomUsers : {
        userId : string;
        state : RoomUserState
    }[]

}
