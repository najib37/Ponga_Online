import {
    Contains, Equals, IsAlphanumeric, IsBoolean,
    IsDate, IsDateString,
    IsDefined,
    IsEmail,
    IsEmpty,
    IsFQDN,
    IsInt,
    IsNotEmpty, IsString, IsUUID,
    Length,
    Max, MaxLength,
    Min, MinLength
} from 'class-validator';

export class Message {


    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    content: string;

    @IsUUID()
    receiverId: string;


    @IsNotEmpty()
    createdAt: Date
}

export class createMessage {

}
