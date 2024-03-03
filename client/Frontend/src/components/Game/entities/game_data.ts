import { Animate } from "./animation";
import { Ball } from "./ball.entity";
import { GameMode } from "./game_mode";
import { Player } from "./player.entity";
import { ServerGame } from "./servergame";

export class GameData {

	GameIsReady		:	boolean;
	GameIsStart 	:	boolean;
	GameIsEnd		:	boolean;
	GameIsLoading	:	boolean;
	GameIsFinished	:	boolean;
	LastRound		: 	boolean;
	Disconnection	:	boolean;
	Round_End		:	boolean;

	Mode			:	GameMode;
	Texts			:	Animate;
	Players			:	Animate;

	_Server		:	ServerGame;
	_player		?:	Player;
	_player1	:	Player;
	_player2	:	Player;
	_ball		:	Ball;
	_Red		:	Ball;
	_Blue		:	Ball;

	constructor(  ) {
		this.GameIsReady = false;
		this.GameIsStart = false;
		this.GameIsEnd = false;
		this.GameIsLoading = true;
		this.GameIsFinished = false;
		this.LastRound = false;
		this.Disconnection = false;
		this.Round_End = false;
	
		this.Texts = new Animate();
		this.Players = new Animate();
		this.Texts.fade = 255;
		this.Mode = new GameMode();

		this._player1 = new Player();
		this._player2 = new Player();
		this._ball = new Ball();
		this._Server = new ServerGame();
		this._Red = new Ball();
		this._Blue = new Ball();
	}
	
}