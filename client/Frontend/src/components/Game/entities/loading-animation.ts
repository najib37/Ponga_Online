import { P5CanvasInstance } from "react-p5-wrapper";
import { GameRes } from "./game-resolution";
import { GameData } from "./game_data";
import { MyProps } from "../interfaces/MyProps";

export class Loading{
	Name		:	string;
	// text 
	TextSize	:	number;
	TextWidth	:	number;
	TextHeight	:	number;
	TextLength	:	number;
	TextFade	:	number;
	TextColor	:	number;

	//Vertical Wall 
	VWall1		:	number;
	VWall2		:	number;

	//Horizontal Wall
	HWall1		:	number;
	HWall2		:	number;

	speed		:	number;
	MaxSpeed	:	number;
	FadeAmount	: number;

	PlayersFade	:	number;

	GamePlay	:	GameData;

	Mode	?: 	string;
	constructor(){
		this.Name = 'LOADING';
		// text 
		this.TextSize = 0;
		this.TextWidth = 0;
		this.TextHeight = 0;
		this.TextLength = 0;
		this.TextFade = 0;
		this.TextColor = 0;

		//Vertical Wall 
		this.VWall1	= 0;
		this.VWall2	= 0;
		//Horizontal Wall
		this.HWall1	= 0;
		this.HWall2	= 0;
		this.speed	= 1;
		this.MaxSpeed= 3;
		this.FadeAmount = 1;
		this.PlayersFade = 0;

		this.GamePlay = new GameData();
	}

	SetAnimatedText( Text : string ){
		this.Name = Text;
	}

	TextAlignement( p5 : P5CanvasInstance<MyProps>, gameRes : GameRes ) {
		this.TextSize = gameRes.width / 10;
		p5.textSize(this.TextSize);
		this.TextWidth = gameRes.width / 2;
		this.TextHeight = gameRes.height - gameRes.height / 3;
		this.TextLength = p5.textWidth(this.Name);
	}

	GameInitializer( gameRes : GameRes, p5 : P5CanvasInstance<MyProps> ){

		const Player1Width = this.TextWidth - this.TextLength / 2 + this.GamePlay._player1.width;
		const Player2width = this.TextWidth + this.TextLength / 2 - this.GamePlay._player2.width;
	
		const line1 = this.TextHeight - p5.textWidth(' ');
		const dist = Math.abs(Player2width - Player1Width);

		this.GamePlay._player1.corner = gameRes.height / 10;
		this.GamePlay._player2.corner = gameRes.height / 10;

		this.GamePlay._ball.x = gameRes.width / 2;
		this.GamePlay._ball.y =	line1 - dist / 4;
		this.GamePlay._ball.radius = gameRes.width / 80;
	
		this.GamePlay._player1.x = Player1Width;
		this.GamePlay._player1.y =	line1 - dist / 4;
		this.GamePlay._player1.width = this.GamePlay._ball.radius;
		this.GamePlay._player1.height = gameRes.height / 10;
		
		this.GamePlay._player2.x = Player2width;
		this.GamePlay._player2.y =	line1 - dist / 4;
		this.GamePlay._player2.height = gameRes.height / 10;
		this.GamePlay._player2.width = this.GamePlay._ball.radius;
	}

	SetGameBoarder(p5 : P5CanvasInstance<MyProps> ){
		this.VWall1 = this.TextWidth - this.TextLength / 2 + this.GamePlay._player1.width;
		this.VWall2 = this.TextWidth + this.TextLength / 2 - this.GamePlay._player2.width;
	
		this.HWall1 = this.TextHeight - p5.textWidth(' ');
		const distance =  Math.abs(this.VWall1 - this.VWall2)
		this.HWall2 = this.HWall1 - distance / 2;
	}

	TextAnimation(  ){
		if ( this.TextFade < 0 ) this.FadeAmount = 1;
		if ( this.TextFade > 255) this.FadeAmount = -10;
		if ( this.PlayersFade < 255) this.PlayersFade++;
		this.TextFade += this.FadeAmount;
	}

	BallAnimation(  ){
		this.speed += 0.01;
		this.speed = Math.min(this.speed, this.MaxSpeed);
	
		this.GamePlay._ball.x += this.GamePlay._ball.xd * this.speed;
		this.GamePlay._ball.y += this.GamePlay._ball.yd * this.speed;

		if (this.GamePlay._ball.x + this.GamePlay._ball.radius >= this.VWall2 - this.GamePlay._player2.width){
			this.GamePlay._ball.xd = -1;
		}
		else if (this.GamePlay._ball.x - this.GamePlay._ball.radius <= this.VWall1 + this.GamePlay._player1.width ){
			this.GamePlay._ball.xd = 1;
		}
		if (this.GamePlay._ball.y + this.GamePlay._ball.radius>= this.HWall1){
			this.GamePlay._ball.yd = -1;
		}
		else if (this.GamePlay._ball.y - this.GamePlay._ball.radius<= this.HWall2){
			this.GamePlay._ball.yd = 1;
		}
	}

	PlayersAnimation(  ){
		const dir1 = this.GamePlay._player1.y < this.GamePlay._ball.y ?  1 :  -1;
		const dir2 =  this.GamePlay._player2.y < this.GamePlay._ball.y ?  1 :  -1;

		if ( this.GamePlay._ball.x >= this.TextWidth  && this.GamePlay._ball.xd > 0){
			this.GamePlay._player2.y += this.speed * dir2;
		
			if (this.GamePlay._player2.y + this.GamePlay._player2.height >= this.HWall1){
				this.GamePlay._player2.y = this.HWall1 - this.GamePlay._player2.height;
			}
			else if ( this.GamePlay._player2.y - this.GamePlay._player2.height <= this.HWall2){
				this.GamePlay._player2.y = this.HWall2 + this.GamePlay._player2.height;
			}
		}
		else if ( this.GamePlay._ball.x < this.TextWidth &&  this.GamePlay._ball.xd < 0 ){
			this.GamePlay._player1.y += this.speed * dir1;
			
			if (this.GamePlay._player1.y + this.GamePlay._player1.height >= this.HWall1){
				this.GamePlay._player1.y = this.HWall1 - this.GamePlay._player1.height;
			}
			else if ( this.GamePlay._player1.y - this.GamePlay._player1.height <= this.HWall2){
				this.GamePlay._player1.y = this.HWall2 + this.GamePlay._player1.height;
			}
		}
		
	}

	Animate( p5 : P5CanvasInstance<MyProps> ){
		p5.fill(255, 0, 0);
		this.TextAnimation( );
		p5.stroke('red');
		p5.strokeWeight(4);
		p5.fill(255, 255, 255, this.TextFade);
		p5.text(this.Name, this.TextWidth, this.TextHeight);
		this.BallAnimation();
		this.PlayersAnimation();
	}
}