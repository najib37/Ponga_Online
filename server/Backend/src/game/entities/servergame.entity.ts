import * as _ from 'lodash';
import { player } from './player.entity';

export class servergame{

	public RoomId			:	string;
	public width			:	number;
	public height			:	number;
	public margin			:	number;
	public round			:	number;
	public maxSpeed			:	number;
	public acceleration		:	number;
	public speed			:	number;
	public Slow_motionSpeed	:	number;
	public OverSpeed		:	number;

	constructor( RoomId : string ){
		this.RoomId = RoomId;
		this.width = 200;
		this.height = 100;
		this.margin = 10;
		this.speed = 1;
		this.maxSpeed = 4;
		this.round = 1;
		this.acceleration = 0.001;
		this.Slow_motionSpeed = 0;
		this.OverSpeed = 6;
	}
	
	ServerReset(){
		this.InitialSpeed();
		this.round = 1;
	}

	InitialSpeed(){
		this.speed = 1;
		this.maxSpeed = 4;
	}

	SpeedAdjustments( player : player, ballDirection : number ){
	
		if ( player.Slow_Motion === true && player.PlayerDirection !== ballDirection ){
			this.speed = this.Slow_motionSpeed;
		}
		else if ( player.Smash === true && player.PlayerDirection === ballDirection ){
			this.speed = this.OverSpeed;
			this.maxSpeed = this.OverSpeed;
		}
	} 
	
	FilterServerGame(  ) : Partial<servergame> {
		return _.omit(this, 'speed', 'maxSpeed', 'acceleration', 'Slow_motionSpeed', 'OverSpeed');
	}
}
