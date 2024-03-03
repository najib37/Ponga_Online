import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomChatDto } from './create-room-chat.dto';

export class UpdateRoomChatDto extends PartialType(CreateRoomChatDto) {
  id: number;
}
