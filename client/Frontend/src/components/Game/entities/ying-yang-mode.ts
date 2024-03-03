import { P5CanvasInstance } from "react-p5-wrapper";
import { Ball } from "./ball.entity";
import { GameRes } from "./game-resolution";
import { Player } from "./player.entity";
import p5Types from "p5";
import { MyProps } from "../interfaces/MyProps";

export class Ying_Yang{
	
	color		:	p5Types.Color;
	ReversColor	:	p5Types.Color;
	Ball_Color	:	p5Types.Color;

	lx		:	number;
	ly		:	number;
	rx		:	number;
	ry		:	number;
	width	:	number;
	height	:	number;

	constructor( Res : GameRes,  p5: P5CanvasInstance<MyProps> ){
		this.color = p5.color(0, 0, 0);
		this.ReversColor = p5.color(0, 0, 0);
		this.Ball_Color = p5.color(0, 0, 0);

		this.lx = Res.width / 4;
		this.ly = Res.height / 2;
		this.rx = Res.width - this.lx;
		this.ry = this.ly;

		this.width = Res.height / 2;
		this.height = this.width;
	}

	ResizeGame( Res : GameRes ){
		this.lx = Res.width / 4;
		this.ly = Res.height / 2;
		this.rx = Res.width - this.lx;
		this.ry = this.ly;

		this.width = Res.height / 2;
		this.height = this.width;

	}

	SetPlayerColor( player : Player | undefined,  p5: P5CanvasInstance<MyProps> ){
		
		if ( player && player.Ying === true && player.PlayerDirection > 0){
			this.color = p5.color(0, 0, 0);// black
			this.ReversColor = p5.color(255, 255, 255);// white
		}
		else if ( player && player.PlayerDirection > 0){
			this.color = p5.color(255, 255, 255);//
			this.ReversColor = p5.color(0, 0, 0);//
		}
		if (player && player.Ying === true && player.PlayerDirection < 0){
			this.color = p5.color(255, 255, 255);
			this.ReversColor = p5.color(0, 0, 0);
		}
		else if (player && player.PlayerDirection < 0){
			this.color = p5.color(0, 0, 0);// black
			this.ReversColor = p5.color(255, 255, 255);// white
		}
	}

	SetBallColor( ball : Ball, Res : GameRes, S : number ){
		if ( ball.x * S < Res.width / 2 ){
			this.Ball_Color = this.ReversColor;
		}
		else{
			this.Ball_Color = this.color;
		}
	}
}