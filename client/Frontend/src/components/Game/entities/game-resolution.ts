import { GameData } from "./game_data";

export class GameRes{
	width	:	number;
	height	:	number;
	Scaling	:	number;
	TextSize:	number;
	initialDimension:	number;

	constructor(){
		this.initialDimension = Math.min(window.innerWidth * 0.8, window.innerHeight);
		this.width = this.initialDimension;
		this.height = this.initialDimension / 2;
		this.Scaling = 1;
		this.TextSize = this.width / 10;
	}

	CalculateDimensions(){
		this.initialDimension = Math.min(window.innerWidth * 0.8, window.innerHeight);
		this.width = this.initialDimension;
		this.height = this.initialDimension / 2;
		this.TextSize = this.width / 10;
	}

	CalculateScaling( data : GameData ){
		this.Scaling = this.width / data._Server.width;
	}
}