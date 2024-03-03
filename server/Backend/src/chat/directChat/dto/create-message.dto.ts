import {Message} from '../entities/message.entity';
import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID} from "class-validator";

export class CreateMessageDto extends Message {
}

export class Conversation {

    @IsUUID()
    otherUserId: string;

    @IsOptional()
    @IsNumber()
    pageNumber?: number

    @IsOptional()
    @IsNumber()
    
    take?: number
}

export class Typing {

    @IsUUID()
    otherUser : string;

    @IsBoolean()
    isTyping : boolean;
}

export class getConversations {

    @IsString()
    filter: string;

    @IsNumber()
    page: number;

    @IsNumber()
    to_take: number;
}




