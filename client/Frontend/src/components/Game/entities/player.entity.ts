
export class Player {
	PlayerId	: string;
	PlayerName	?: string;
	PlayerAvatar	?:	string;
	GameResult	?:	string;
	
	PlayerDirection	:	number;
	MatchScore	: number;
	
	x	: number;
	y	: number;
	Xp	: number;
	
	width	: number;
	height	: number;
	corner	: number;
	
	Ying	?:	boolean;

	constructor (){

		this.PlayerId = '';
		this.MatchScore = 0;
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		this.corner = 0;
		this.Xp = 0;
		this.PlayerDirection = 0;
	
	}
}
