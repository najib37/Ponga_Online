import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class PlayerMoves {

	@IsString()
	@IsUUID()
	RoomId: string;

	@IsString()
	@IsUUID()
	PlayerId	:	string;

  	@IsBoolean()
  	keyPressed: boolean;

  	@IsBoolean()
  	KeyReleased: boolean;

  	@IsBoolean()
  	MoveUp: boolean;

  	@IsBoolean()
  	MoveDown: boolean;
}
