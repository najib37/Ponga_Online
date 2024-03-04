import { Socket } from 'socket.io'
import { AuthSocket } from 'src/notification/types/AuthSocket';
import { Game } from './game.entity';
import { GameMode } from '../dto/game_mode.dto';
import * as _ from 'lodash';

type Status = {
	[key : string] : boolean;
};

export class Room {

	IsEmpty			:	boolean;
	IsEnd			:	boolean;
	IsUpdated		:	boolean;
	/*	About the clients  */
	PlayersId		:	Set<string>;
	PlayersSocket	:	Set<AuthSocket>;
	Online			:	Status;
	/* About the Room Itself */
	RoomId			:	string;
	Capacity		:	number;
	/* Game */
	Game			:	Game;
	
	constructor ( RoomId : string, Mode : GameMode ) {
		//?
		this.IsEmpty = true;
		this.IsEnd = false;
		this.IsUpdated = false;
		this.PlayersId = new Set();
		this.PlayersSocket = new Set();
		this.Online = {};
		this.RoomId = RoomId;
		this.Capacity = Mode.RoomCapacity;
		this.Game = new Game(RoomId, Mode);
	}
	AddPlayer( playerSocket : AuthSocket ) : void {
		// 	//! SET TEAM
		if ( !this.PlayersId.has(playerSocket.user?.sub) ) {
			this.PlayersId.add(playerSocket.user?.sub);
			this.AddPlayerToGame(playerSocket);
		}

		this.Online[playerSocket.user?.sub] = true;
	}
	//? START GAME
	StartGame() : void {
		this.Game._ball.InitialBallPosition( this.Game._Server );
		if (this.Game.Mode.GameMode === 'YINYANG'){
			this.Game.YingYangPong();
		}
	}

	GameReady() : void{
		this.Game.GameIsReady = true;
	}
	
	UpdateGame() : void {
		this.Game.checkDisconnect();
		this.Game.BallMovement();
		this.Game.Checker();
		this.Game.CheckMovement();
		if (this.Game.Mode.GameMode === 'CLASHOFCOLORS'){
			this.Game.CheckForSpecialPower();
			this.Game._Red.ClashOfColorsMode(  );
			this.Game._Blue.ClashOfColorsMode(   );
		}
	}

	AddPlayerToGame( PlayerSocket : AuthSocket ) : void {
		this.Size() <= this.Capacity / 2 ? this.Game.SetTeam1( PlayerSocket )  :  this.Game.SetTeam2( PlayerSocket );
	}

	ResetRoom(  ){
		this.IsUpdated = false;
		this.Game.GameRestart();
	}

	IsOnline( uid : string ) : boolean{
		return this.Online[uid];
	}

	Size() : number{
		return this.PlayersId.size
	}
}
