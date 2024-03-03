import { player } from "./player.entity";
import { servergame } from "./servergame.entity";
import * as _ from 'lodash';

export class ball{
	protected	x				:	number;
	protected	y				:	number;
	protected	xd				:	number;
	protected	yd				:	number;
	protected	radius			:	number;
	protected	angle			:	number;
	protected	Startx			:	number;
	protected	Starty			:	number;
	protected	steps			:	number;
	protected	distance		:	number;

	constructor( servergame : servergame ){
		this.Startx = servergame.width / 2;
		this.Starty = servergame.height / 2;
		this.xd = 1;
		this.yd = 1;
		this.radius = 3;
		this.angle = Math.PI / 32;
		this.x = this.Startx;
		this.y = this.Starty;
		this.steps = 0.04;
		this.distance = 0;
	}

	ResetBall(){
		this.xd = 1;
		this.yd = 1;
	}

	InitialBallPosition( servergame : servergame ) {
		this.x = this.Startx
		this.y = this.Starty;
		!( servergame.round % 2) ? this.xd = 1 : this.xd = -1;
		( servergame.round % 4 ) < 2 ? this.yd = 1 : this.yd = -1;
		this.angle = Math.PI / 32;
	}

	BallMovement ( servergame : servergame ){
		servergame.speed += servergame.acceleration;
		servergame.speed = Math.min( servergame.speed, servergame.maxSpeed);
		this.x += (this.xd + (this.xd * servergame.speed)) * Math.cos(this.angle);
		this.y += (this.yd + (this.yd * servergame.speed)) * Math.sin(this.angle);
	}

	LeftPlayerWithBall( player : player ) : boolean {
		const ballPosition = this.x + (this.radius * this.xd);
		const playerPosition = Math.round(player.x + (player.width * this.xd * -1));

		if ( this.xd < 0 ){
			this.distance = Math.abs( this.y - player.y );
			if ( ballPosition <= playerPosition && this.x > player.x ){
				if ( this.distance <= player.height && player.Ying === false ){
					this.angle = this.distance * this.steps;
					this.xd = 1;
					player.Xp++;
					player.Mirror_Image++;
					player.Strike = true;
				}
				else if ( this.distance <= player.height && player.Ying === true ){
					return true;
				}
			}
			if ( ballPosition <= 0 && player.Ying === false ){
				return true;
			}
			if ( ballPosition <= 0 && player.Ying === true ){
				this.xd = 1;
				player.Xp++;
			}
		}
		return false;
	}

	RightPlayerWithBall( servergame : servergame, player : player ) : boolean{
		const ballPosition = this.x + (this.radius * this.xd);
		const playerPosition = Math.round(player.x + (player.width * this.xd * -1))

		if ( this.xd > 0 ){
			this.distance = Math.abs( this.y - player.y );
			if ( ballPosition >= playerPosition && this.x < player.x ){
				if ( this.distance <= player.height && player.Ying === false ){
					this.angle = this.distance * this.steps;
					this.xd = -1;
					player.Xp++;
					player.Mirror_Image++;
					player.Strike = true;
				}
				else if ( this.distance <= player.height && player.Ying === true ){
					return true;
				}
			}
			if ( ballPosition >= servergame.width && player.Ying === false ){
				return true;
			}
			else if ( ballPosition >= servergame.width && player.Ying === true ){
				this.xd = -1;
				player.Xp++;
			}
		}
		return false;
	}

	CheckBallMovement( servergame : servergame ) {
		// up
		if ( this.y <= this.radius ) {
			this.yd = 1;
		}
		// down
		if ( this.y >= servergame.height - this.radius ) {
			this.yd = -1;
		}
	}

	// Getters
	Getx() : number {
		return this.x;
	}
	Gety() : number {
		return this.y;
	}
	Getxd() : number{
		return this.xd;
	}
	Getxyd() : number{
		return this.xd;
	}
	Getradius() : number {
		return this.radius;
	}

	FilterBall(  ) : Partial<ball> {
		return _.pick(this, ['x', 'y', 'radius']);
	}
	
}