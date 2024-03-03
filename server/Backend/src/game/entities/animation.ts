import * as _ from 'lodash';

export class Animation{
	private	fade		:	number;
	private	IsFadeIn	:	boolean;
	private	IsFadeOut	:	boolean;
	private	Text		:	string;
	private	index		:	number;
	private	Animated	:	boolean;

	constructor(){
		this.IsFadeIn = true;
		this.IsFadeOut = false;
		this.fade = 0;
		this.Text = undefined;
		this.index = 0;
		this.Animated = false;
	}

	ResetAnimation(){
		this.IsFadeIn = true;
		this.IsFadeOut = false;
		this.fade = 0;
		this.Text = undefined;
		this.index = 0;
		this.Animated = false;
	}

	Animate( Amount : number ){
		if (this.IsFadeIn === true){
			this.fade += Amount;
			if (this.fade > 255){
				this.IsFadeIn = false;
				this.IsFadeOut = true;
				this.fade = 255;
				this.Animated = true;
			}
		}
	
	}
	
	Animation( Texts : string[], Amount : number){
		if (this.index === Texts.length) {
			this.Animated = true;
		}
		this.Text = Texts[this.index];
		if (this.IsFadeIn === true){
			this.fade += Amount;
			if (this.fade > 255){
				this.IsFadeIn = false;
				this.IsFadeOut = true;
				this.fade = 255;
			}
		}
		else if (this.IsFadeOut === true){
			this.fade -= Amount;
			if ( this.fade < 0){
				this.IsFadeOut = false;
				this.fade = 0;
				if (this.index < Texts.length){
					this.index++;
					this.IsFadeIn = true;
				}
			}
		}
	}
	
	IsAnimated() : boolean {
		return this.Animated;
	}

	FilterAnimation() : Partial<Animation>{
		return _.pick(this, ['fade', 'Text']);
	}
}
