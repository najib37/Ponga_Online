import {IsDefined, IsOptional, IsStrongPassword, IsUUID} from "class-validator";

export class JoinChannelDto {

    @IsUUID()
    roomId : string;

    @IsOptional()
    @IsStrongPassword()
    password : string;
}