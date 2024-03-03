import {RoomChat} from "../entities/room-chat.entity";
import {FieldRef} from "@prisma/client/runtime/library";
import {RoomType, RoomUserState} from "@prisma/client";
import {
    IsEmpty,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    isNumber, IsOptional,
    isPositive,
    IsPositive,
    IsString, IsStrongPassword,
    IsUUID, MAX_LENGTH, MaxLength, MIN_LENGTH, MinLength
} from "class-validator";

export class CreateRoomChatDto extends RoomChat {
}

export class dataOperation {
    @IsUUID()
    roomId : string;
    @IsUUID()
    userId : string
}

export class operationRoom {
    @IsUUID()
    roomId : string;
    @IsUUID()
    userId : string;

    @IsEnum(RoomUserState)
    state: RoomUserState;

    @IsOptional()
    muteDuration?: string;
}


export class RoomInfos {


    @IsUUID()
    roomId :  string;

    @IsNotEmpty()
    @IsString()
    name : string;

    @IsEnum(RoomType)
    type : RoomType;

    @IsOptional()
    @IsStrongPassword()
    Password : string;
}


export class searchForGroup {
    @IsString()
    filter :string;

    @IsNumber()
    @IsPositive()
    page : number;

    @IsNumber()
    @IsPositive()
    to_take : number;
}


export class RoomMessage {

    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    @IsNotEmpty()
    content: string;


    @IsUUID()
    roomId: string;

    @IsNotEmpty()
    createdAt : Date
}

export class getRoomMessages {


    @IsUUID()
    roomId: string;

    @IsNumber()
    @IsPositive()
    page: number;

    @IsNumber()
    @IsPositive()
    to_take: number;
}

export class emitToRoomUsers {
    roomId : string;
    event : string;
    data? : any;
    toExclude? : string
}
