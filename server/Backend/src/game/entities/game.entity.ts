import { AuthSocket } from "src/notification/types/AuthSocket";
import { Animation } from "./animation";
import { GameData } from "./gamed_data.entity";
import * as _ from 'lodash';
import { GameMode } from "../dto/game_mode.dto";
import { PlayerMoves } from "../dto/playermoves";
import { player } from "./player.entity";
import { GameModes } from "../types/GameType";
import { ClientGameData } from "../types/ClientGameDataType";

export class Game extends GameData {
	
	GameIsReady		:	boolean;
	GameIsStart 	:	boolean;
	GameIsEnd		:	boolean;
	GameIsLoading	:	boolean;
	GameIsFinished	:	boolean;
	Disconnection	:	boolean;
	IsLastRound		: 	boolean;
	LastRound		:	boolean;
	Round_End		:	boolean;

	Mode			:	GameMode;
	Texts			:	Animation;
	Players			:	Animation;

	MaxRounds 		: number;
	GameMode 		: GameModes;

	constructor( RoomId : string, Mode : GameMode ){
		super( RoomId );

		this.Mode =  Mode;
		this.GameIsReady = false;
		this.GameIsStart = false;
		this.GameIsEnd = false;
		this.GameIsLoading = true;
		this.GameIsFinished = false;
		this.Disconnection = false;
		this.IsLastRound = false;
		this.LastRound = false;
		this.Round_End = false;
		this.Texts = new Animation();
		this.Players = new Animation();

		if ( Mode ){
			this.MaxRounds = Mode.MaxRounds;
			this.GameMode = Mode.GameMode;
		}
	}
	//! SETING THE TEAM
	SetTeam1( PlayerSocket : AuthSocket ) : void {
		
		this._player1.SetPlayerId( PlayerSocket );
		this._player1.LeftPosition( this._Server );

	}

	SetTeam2( PlayerSocket : AuthSocket ) : void {
		this._player2.SetPlayerId( PlayerSocket );
		this._player2.RightPosition( this._Server );
	}
	GameRestart(){
		this._player1.ResetPlayer();
		this._player2.ResetPlayer();
		this._player1.LeftPosition( this._Server );
		this._player2.RightPosition( this._Server );
		this._Server.ServerReset();
		this.GameIsLoading = false;
		this.GameIsReady = true;
		this.GameIsStart = false;
		this.GameIsEnd = false;
		this.GameIsFinished = false;
		this.Disconnection = false;
		this.IsLastRound = false;
		this.LastRound = false;
		this.Round_End = false;
		this.Texts.ResetAnimation();
		this.Players.ResetAnimation();

	}

	ResetPlayersPosition(){
		this._player1.LeftPosition( this._Server );
		this._player2.RightPosition( this._Server );
	}

	checkDisconnect(){
	
		if ( this.Disconnection === true ){
			this.GameIsStart = false;
			this.GameIsEnd = true;
			this._player1.CheckGameResult( this._player2 );
			this._player2.CheckGameResult( this._player1 );
		}

	}

	CheckEnding(){
	
		if ( this._Server.round === this.Mode.MaxRounds ){
			this.GameIsStart = false;
			this.GameIsEnd = true;
			this._player1.CheckGameResult( this._player2 );
			this._player2.CheckGameResult( this._player1 );
		}

	}

	YingYangPong(  ){

		if (!(this._Server.round % 2)){
			this._player1.Ying = true;
			this._player2.Ying = false;
		}
		else{
			this._player1.Ying = false;
			this._player2.Ying = true;
		}
	}

	InitialGame(){
		this.Round_End = false;
		this._Server.round++;
		this._ball.InitialBallPosition( this._Server );
		this._player1.LeftPosition( this._Server );
		this._player2.RightPosition( this._Server ); 
		this._Server.InitialSpeed( );
		if ( this.Mode.GameMode === 'YINYANG'){
			this.YingYangPong();
		}
	}
	
	BallMovement(){

		if (this.Mode.GameMode === 'CLASHOFCOLORS'){
			if ( this._Red.CheckCollecting( this._ball ) ){
				this._player1.SmashPower( this._ball.Getxd(), this._player2 );
				this._player2.SmashPower( this._ball.Getxd(), this._player1 );
			}
			if ( this._Blue.CheckCollecting( this._ball ) ){
				this._player1.Slow_MotionPower( this._ball.Getxd(), this._player2 );
				this._player2.Slow_MotionPower( this._ball.Getxd(), this._player1 );
			}
			this._player1.CheckForAttacking_Ace( this._player2, this._Server );
			this._player2.CheckForAttacking_Ace( this._player1, this._Server );

		}
		this._ball.BallMovement( this._Server );
		this._player1.PlayerSpeed( this._Server );
		this._player2.PlayerSpeed( this._Server );
	}

	PlayerResign( Player : player ){

		if ( this.Disconnection === false ){
			Player.PlayerResign();
		}
	
	}
	
	CheckForSpecialPower( ){

		if ( this._player1.Smash || this._player1.Slow_Motion ){
			this._Server.SpeedAdjustments( this._player1, this._ball.Getxd() );
		}
		if ( this._player2.Smash || this._player2.Slow_Motion ){
			this._Server.SpeedAdjustments( this._player2, this._ball.Getxd() );
		}
	}

	Checker()
	{
		this._ball.CheckBallMovement( this._Server );
		if ( this._ball.LeftPlayerWithBall( this._player1 ) === true ){
				this._player2.MatchScore++;
				this._player2.Xp += 5;
				if (this._player2.Smash === true){
					this._player2.Smash_Master++;
				}
				if (this.Mode.GameMode === 'YINYANG'){
					this._player2.Ying ? this._player2.Shadow_Master++ : this._player1.White_King++;
				}
				this.Round_End = true;
		}
		if ( this._ball.RightPlayerWithBall( this._Server, this._player2 ) === true ){
			this._player1.MatchScore++;
			this._player1.Xp += 5;
			if (this._player1.Smash === true ){
				this._player1.Smash_Master++;
			}
			if (this.Mode.GameMode === 'YINYANG'){
				this._player1.Ying ? this._player1.Shadow_Master++ : this._player2.White_King++;
			}
			this.Round_End = true;
		}
		if ( this.Round_End === true ){
			this.CheckEnding();
		}
	}


	CheckMovement( ){
		this._player1.PlayerMovement( this._Server );
		this._player2.PlayerMovement( this._Server );
	}

	GameMovement( PlayerMove : PlayerMoves ){

		if ( PlayerMove.keyPressed === true ){
			if ( this._player1.PlayerId === PlayerMove.PlayerId ){
				this._player1.OnkeyPressed( PlayerMove );
			}
			else if ( this._player2.PlayerId === PlayerMove.PlayerId ){
				this._player2.OnkeyPressed( PlayerMove );
			}
		}
		else if ( PlayerMove.KeyReleased === true ){
			if ( this._player1.PlayerId === PlayerMove.PlayerId ){
				this._player1.OnkeyReleased(  );
			}
			else if ( this._player2.PlayerId === PlayerMove.PlayerId ){
				this._player2.OnkeyReleased(  );
			}
		}
	}

	FilterData() : Partial<Game> {
		const clonedGame : any = _.cloneDeep(this);
		clonedGame._player1 = _.pick(clonedGame._player1, ['PlayerId', 'GameResult', 'Xp', 'MatchScore', 'achievement']);
		clonedGame._player2 = _.pick(clonedGame._player2, ['PlayerId', 'GameResult', 'Xp', 'MatchScore', 'achievement']);
		return _.pick(clonedGame, ['_player1', '_player2', 'MaxRounds', 'GameMode', 'Disconnection']);
	}

	GameOver(  ){
		this._player1.CheckGameResult( this._player2 );
		this._player2.CheckGameResult( this._player1 );
	}

	CheckForLastRound() : boolean{
		if ( this.IsLastRound === false && this._player1.MatchScore === this._player2.MatchScore &&
			this._player1.MatchScore + this._player2.MatchScore === this.MaxRounds - 1){
				this.LastRound = true;
				return true;
			}
		return false;
	}

	FilterGame( ) : ClientGameData {
		const copiedGame : ClientGameData = _.cloneDeep( this );
		copiedGame._ball = this._ball.FilterBall( );
		copiedGame._player1 = this._player1.FilterPlayer(  );
		copiedGame._player2 = this._player2.FilterPlayer(  );
		copiedGame._Server = this._Server.FilterServerGame(  );
		copiedGame._Red = this._Red.FilterClash(  );
		copiedGame._Blue = this._Blue.FilterClash(  );
		copiedGame.Texts = this.Texts.FilterAnimation( );
		copiedGame.Players = this.Players.FilterAnimation( );
		return copiedGame;
	}

	GetPlayerById( PlayerId : string ) : player{
		return this._player1.PlayerId === PlayerId ? this._player1 : this._player2;
	}
}
