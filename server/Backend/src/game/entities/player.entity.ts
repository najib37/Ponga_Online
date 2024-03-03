import { AuthSocket } from "src/notification/types/AuthSocket";
import { servergame } from "./servergame.entity";
import * as _ from 'lodash';
import { PlayerMoves } from "../dto/playermoves";

export class player{

	GameResult		:	string;
	PlayerName		:	string;
	PlayerAvatar	:	string;
	PlayerId		:	string;
	x				:	number;
	y				:	number;
	Xp				:	number;
	MatchScore		:	number;
	MaxSpeed		:	number;
	Speed			:	number;
	width			:	number;
	height			:	number;
	corner			:	number;
	/*  achievement */
	achievement		:	Set<string>;
	Mirror_Image	:	number;
	Slow_Motion		:	boolean;
	Smash			:	boolean;
	PlayerDirection	:	number;
	Strike			:	boolean;
	Smash_Master	:	number;
	Attacking_Ace	:	number;
	Shadow_Master	:	number;
	White_King		:	number;

	/** */
	Ying			:	boolean;
	Up				:	boolean;
	Down			:	boolean;

	constructor ( servergame : servergame ) {
		this.GameResult	= undefined;
		this.PlayerName	= undefined;
		this.PlayerId = undefined;
		this.width = 3;
		this.height = 15;
		this.x = 0;
		this.y = 0;
		this.Xp = 0;
		this.MatchScore	= 0;
		this.MaxSpeed = 2;
		this.Speed = 1;

		this.corner = 10;
		this.achievement = new Set<string>();
		this.Mirror_Image = 0;
		this.Slow_Motion = false;
		this.Smash = false;
		this.Strike = false;
		this.Smash_Master = 0;
		this.Attacking_Ace = 0;
		this.Ying = false;
		this.Shadow_Master = 0;
		this.White_King = 0;
		this.Up = false;
		this.Down = false;
	}

	MoveUp(	 ): void { 
		this.y <= this.height ? this.y = this.height : this.y -= this.Speed;
	}

	MoveDown( ServerData : servergame ): void {
		const H = ServerData.height - this.height
		this.y >= H ? this.y = H : this.y += this.Speed;
	}

	ResetPlayer(){
		this.GameResult	= undefined;
		this.Xp = 0;
		this.MatchScore	= 0;
		this.MaxSpeed = 2;
		this.Speed = 1;
		delete this.achievement;
		this.achievement = new Set<string>();
		this.Mirror_Image = 0;
		this.Slow_Motion = false;
		this.Smash = false;
		this.Strike = false;
		this.Smash_Master = 0;
		this.Attacking_Ace = 0;
		this.Ying = false;
		this.Shadow_Master = 0;
		this.White_King = 0;
	}

	PlayerResign(){
		this.GameResult = 'Resign';

	}

	PlayerWin(){
		this.GameResult = 'WIN!';

	}

	PlayerLost(){
		this.GameResult = 'LOST!';

	}

	CheckGameResult( player : player ){
		if ( this.GameResult === 'Resign' ){
			return ;
		}
		else if ( this.MatchScore > player.MatchScore || player.GameResult === 'Resign' ){
			this.GameResult = 'WIN!';
		}
		else{
			this.GameResult = 'LOST!'
		}
		if ( this.GameResult === 'WIN!' && player.MatchScore + 1 === this.MatchScore ){
			this.achievement.add('Last_Stand');
			this.Xp += 10;
		}
		else if ( this.GameResult === 'WIN!' && !player.MatchScore ){
			this.achievement.add('Clean_Sheet');
			this.Xp += 10;
		}
		if ( this.Smash_Master >= 5 ){
			this.achievement.add('Smash_Master');
			this.Xp += 10;
		}
		if ( this.Attacking_Ace >= 5 ){
			this.achievement.add('Attacking_Ace');
			this.Xp += 10;
		}
		if ( this.White_King >= 5 ){
			this.achievement.add('White_King');
			this.Xp += 10;
		} 
		if ( this.Shadow_Master >= 5 ){
			this.achievement.add('Shadow_Master');
			this.Xp += 10;
		}
	}

	SetPlayerAvatar( PlayerAvatar : string ){
		this.PlayerAvatar = PlayerAvatar;
	}

	SetPlayerId( PlayerSocket : AuthSocket ){
		this.PlayerId = PlayerSocket.user?.sub;
		this.PlayerName = PlayerSocket.user?.username;
	}

	LeftPosition( servergame : servergame ){
		this.Strike = false;
		this.Smash = false;
		this.Slow_Motion = false;
		this.Mirror_Image = 0;
		this.x = servergame.margin;
		this.y = servergame.height / 2;
		this.PlayerDirection = 1;
	}

	RightPosition( servergame : servergame ){
		this.Strike = false;
		this.Smash = false;
		this.Slow_Motion = false;
		this.Mirror_Image = 0;
		this.x = servergame.width - servergame.margin;
		this.y = servergame.height / 2;
		this.PlayerDirection = -1;
	}

	PlayerSpeed( servergame ){
		this.Speed += servergame.acceleration;
		this.Speed = Math.min(this.MaxSpeed, this.Speed);
	}

	OnkeyReleased(  ){
		this.Up = false;
		this.Down = false;
	}

	OnkeyPressed( playerMove : PlayerMoves ){
		if ( playerMove.MoveUp === true ){
			this.Up = true;
			this.Down = false;
		}
		else if ( playerMove.MoveDown === true ){
			this.Down = true;
			this.Up = false;
		}
	}

	PlayerMovement( servergame : servergame ){

		if ( this.Up === true ){
			this.MoveUp();
		}
		else if ( this.Down === true ){
			this.MoveDown( servergame );
		}
	}

	Slow_MotionPower( ballDirection : number, player : player ){
		if ( ballDirection === this.PlayerDirection )
		{
			this.Slow_Motion = true;
		}
	}

	SmashPower( ballDirection : number, player : player ){
		if ( ballDirection === this.PlayerDirection ){
			this.Smash = true;
			player.Slow_Motion = false;
		}
	}

	CheckForAttacking_Ace( player : player, servergame : servergame ){
		if ( this.Strike === true ){
			this.Strike = false;
			if ( player.Smash === true ){
				this.Attacking_Ace++;
				servergame.InitialSpeed();
			}
			player.Smash = false;
			if ( this.Slow_Motion === true ){
				servergame.InitialSpeed();
				this.Slow_Motion = false;
			}
		}
	}

	FilterPlayer( ) : Partial<player> {
		return _.pick(this, ['PlayerId', 'PlayerName', 'PlayerAvatar', 'GameResult', 'PlayerDirection',
		'MatchScore', 'x', 'y', 'Xp', 'width', 'height', 'corner', 'Ying']);
	}
}

