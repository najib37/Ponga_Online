import { IsNotEmpty } from 'class-validator'
import { player } from './player.entity';
import { ball } from './ball.entity';
import { servergame } from './servergame.entity';
import { Clash } from './clash_of_olors.entity';

export class GameData {

	public	_Server		:	servergame;
	public	_player1	:	player;
	public	_player2	:	player;
	public	_ball		:	ball;
	public	_Red		:	Clash;
	public	_Blue		:	Clash;
	
	constructor( RoomId : string ){

			this._Server = new servergame( RoomId );
			this._player1 = new player( this._Server );
			this._player2 = new player( this._Server );
			this._ball = new ball( this._Server );
			this._Red = new Clash( this._Server );
			this._Blue = new Clash( this._Server );
	}
}
