import {RoomType} from "@prisma/client";
import {
    IsEnum,
    IsNumber,
    IsOptional, IsPositive,
    isPositive,
    IsString,
    IsStrongPassword,
    MaxLength,
    MinLength
} from "class-validator";

export class RoomChat {


    @MinLength(1)
    @MaxLength(20)
    @IsString()
    name: string;


    @IsString()
    @IsEnum(RoomType)
    type: RoomType;

    @IsOptional()
    @IsStrongPassword()
    password: string;
}

export class UserRoom {

    @IsString()
    filter: string;

    @IsNumber()
    @IsPositive()
    page: number;


    @IsNumber()
    @IsPositive()
    to_take: number;
}