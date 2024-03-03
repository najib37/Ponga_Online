export class GameMode{
	MaxRounds		?:	number;
	GameMode		?:	string;
	RoomCapacity	:	number;
	IsPublic		:	boolean;
	GuestId			?:	string;

	constructor(){
		this.IsPublic = true;
		this.RoomCapacity = 2;
	}
};