import { ball } from "./ball.entity";
import { player } from "./player.entity";
import { servergame } from "./servergame.entity";
import * as _ from 'lodash';

export class Clash extends ball{
	private	Collected		:	boolean;
	private	Xmin			:	number;
	private	Xmax			:	number;
	private	ymin			:	number;
	private	ymax			:	number;

	constructor( servergame : servergame ){
		super( servergame );

		this.radius = 3;
		this.yd = 1;
		this.xd = 1;
		
		
		this.Xmax = servergame.width - servergame.height / 2 - this.radius;
		this.Xmin = this.radius + servergame.height / 2;
		this.ymin = servergame.height - this.radius;
		this.ymax = this.radius;
		
		this.Collected = false;
		
				
		this.x = this.GetRandge(this.Xmin, this.Xmax);
		this.y = this.GetRandge(this.ymin, this.ymax);	
	}

	GetRandge( min : number, max : number ) {
		return Math.floor(Math.random() * (max - min) ) + min;
	}
	
	ClashOfColorsMode( ) {
		if ( this.Collected === true ){
			this.x = this.GetRandge(this.Xmin, this.Xmax);
			this.y = this.GetRandge(this.ymin, this.ymax);
			this.Collected = false;
		}
	}

	CheckCollecting( ball : ball ){
	const	distance = Math.sqrt( (this.x - ball.Getx()) * (this.x - ball.Getx())
									+ (this.y - ball.Gety()) * (this.y - ball.Gety()));
		if ( distance < this.radius + ball.Getradius()){
			this.Collected = true;
			return this.Collected;
		}
		return false;
	}

	FilterClash( ) : Partial<Clash> {
		return _.pick(this, ['x', 'y', 'radius']);
	}

}