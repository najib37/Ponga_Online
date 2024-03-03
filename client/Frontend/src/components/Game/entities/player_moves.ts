// interface Command{
// 	PlayerId		:	string;
// 	RoomId			:	string;
// 	keyPressed		:	boolean;
// 	KeyReleased		:	boolean;
// 	MoveUp			:	boolean;
// 	MoveDown		:	boolean;
// }

export class PlayerMoves {
	public	RoomId		:	string;
	public	PlayerId	?:	string;
	public keyPressed 	:	boolean;
	public KeyReleased 	:	boolean;
	public MoveUp 		:	boolean;
	public MoveDown 	:	boolean;

	constructor( PlayerId : string | undefined, RoomId : string){
		this.RoomId = RoomId;
		this.PlayerId = PlayerId;
		this.KeyReleased = false;
		this.keyPressed = false;
		this.MoveUp = false;
		this.MoveDown = false;
	}
}

