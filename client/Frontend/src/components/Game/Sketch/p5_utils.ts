import { P5CanvasInstance } from "react-p5-wrapper";
import { MyProps } from "../interfaces/MyProps";
import p5Types from "p5";
import { GameRes } from "../entities/game-resolution";
import { Player } from "../entities/player.entity";
import { Ball } from "../entities/ball.entity";
import { PlayerMoves } from "../entities/player_moves";
import { GameData } from "../entities/game_data";
import { game } from "../../Socket/socket";
import { Ying_Yang } from "../entities/ying-yang-mode";
import { Loading } from "../entities/loading-animation";


export function glow( p5: P5CanvasInstance<MyProps>, glowColor : p5Types.Color , blurriness : number ) {
	p5.drawingContext.shadowColor = glowColor;
	p5.drawingContext.shadowBlur = blurriness;
}

export function textNeon( p5: P5CanvasInstance<MyProps>, color : p5Types.Color, gameRes : GameRes, Text : string){
	p5.push();
	p5.noStroke();
	glow(p5, color, 100);
	p5.text(Text, gameRes.width/2, gameRes.height/2);
	glow(p5, color, 50);
	p5.text(Text, gameRes.width/2, gameRes.height/2);
	glow(p5, color, 10);
	p5.text(Text, gameRes.width/2, gameRes.height/2);
	p5.pop();

}

export function NeonRacket( p5: P5CanvasInstance<MyProps>, Player : Player, Scaling : number, color : p5Types.Color ){
	p5.noStroke();
	glow(p5, color, 40);
	p5.rect(Player.x * Scaling, Player.y * Scaling, Player.width * Scaling, Player.height* Scaling, Player.corner * Scaling);
	glow(p5, color, 20);
	p5.rect(Player.x * Scaling, Player.y * Scaling, Player.width * Scaling, Player.height* Scaling, Player.corner * Scaling);
	glow(p5, color, 10);
	p5.fill(255, 255, 255);
	p5.rect(Player.x * Scaling, Player.y * Scaling, Player.width * Scaling, Player.height* Scaling, Player.corner * Scaling);
}

export function NeonBall( p5: P5CanvasInstance<MyProps>, Ball : Ball, Scaling : number, color : p5Types.Color ){
	p5.push();
	p5.noStroke();
	glow(p5, color, 60);
	p5.ellipse(Ball.x * Scaling, Ball.y * Scaling, Ball.radius * Scaling, Ball.radius* Scaling);
	glow(p5, color, 30);
	p5.ellipse(Ball.x * Scaling, Ball.y * Scaling, Ball.radius * Scaling, Ball.radius* Scaling);
	glow(p5, color, 15);
	p5.fill(color);
	p5.ellipse(Ball.x * Scaling, Ball.y * Scaling, Ball.radius * Scaling, Ball.radius* Scaling);
	p5.pop();

}

export function DrawLoadingBall( p5: P5CanvasInstance<MyProps>, Ball : Ball, fade : number ){
	p5.push();
	p5.fill(255, 0, 0, fade);
	p5.noStroke();
	p5.ellipse(Ball.x , Ball.y , Ball.radius , Ball.radius );
	p5.pop();
}

export function DrawLoadingPlayer(p5: P5CanvasInstance<MyProps>, Player : Player, fade : number ){
	p5.push();
	p5.noStroke();
	p5.fill(255, 255, 255, fade);
	p5.rect(Player.x , Player.y , Player.width , Player.height , Player.corner );
	p5.pop();
}

export function CanvasStyle( p5: P5CanvasInstance<MyProps> ){
	let cnv : p5Types.Element | null = p5.select('canvas');
	if ( cnv ){
		cnv.style('border-radius: 10px;');
		cnv.style('border: 2px solid black ');
		cnv.style('position', 'absolute');
		cnv.style('top', '70%');
		cnv.style('left', '50%');
		cnv.style('transform', 'translate(-50%, -50%)');
		cnv.style('filter: drop-shadow(15px 15px 15px #2F2F2F)');

	}
}

export function ColoredPlayer(p5: P5CanvasInstance<MyProps>, Player : Player, Scaling : number, color : p5Types.Color){

	p5.push();
	p5.fill(color);
	p5.rect(Player.x * Scaling, Player.y * Scaling, Player.width * Scaling, Player.height* Scaling, Player.corner * Scaling);
	p5.pop();
}

export function ColoredBall( p5: P5CanvasInstance<MyProps>, Ball : Ball, Scaling : number, color : p5Types.Color){
	p5.push();
	p5.fill(color);
	p5.noStroke();
	p5.ellipse(Ball.x * Scaling, Ball.y * Scaling, Ball.radius * Scaling, Ball.radius* Scaling);
	p5.pop();
}

export function  EvenetListner( p5: P5CanvasInstance<MyProps>, cmd : PlayerMoves, data : GameData  ){

	if ( cmd && cmd.keyPressed === false ) {
		cmd.KeyReleased = false;
		if ( p5.keyCode === p5.UP_ARROW) {
			cmd.keyPressed = true;
			cmd.MoveUp = true;
			if ( data._player && data._player.y - data._player.height > 0 ){
				game.emit('PlayerMoves', cmd);
			}
		}
		else if ( p5.keyCode === p5.DOWN_ARROW) {
			cmd.keyPressed = true;
			cmd.MoveDown = true;
			if ( data._player && data._player.y + data._player.height < data._Server.height ){
				game.emit('PlayerMoves', cmd);
			}
		}
	}
}

export function Resize( res : GameRes, _loading : Loading, p5: P5CanvasInstance<MyProps>){
	p5.textSize(res.TextSize);
	_loading.TextAlignement(p5, res);
	_loading.SetGameBoarder(p5);
	_loading.GameInitializer( res, p5 );
}

export function YinYang( p5: P5CanvasInstance<MyProps>, gameRes : GameRes, data : GameData, Scaling : number, Ying : Ying_Yang){

	p5.push();
	Ying.SetPlayerColor( data._player, p5 );
	Ying.SetBallColor( data._ball, gameRes, Scaling);
	p5.noStroke();
	p5.fill (Ying.color);
	p5.rect(Ying.lx, Ying.ly, Ying.width, Ying.height);
	p5.fill (Ying.ReversColor);
	p5.rect(Ying.rx, Ying.ry, Ying.width, Ying.height);
	ColoredBall(p5, data._ball, Scaling, Ying.Ball_Color);
	ColoredPlayer(p5, data._player1, Scaling, Ying.ReversColor);
	ColoredPlayer(p5, data._player2, Scaling, Ying.color);
	p5.pop();
}
