export class Animate{
	fade		:	number;
	IsFadeIn	:	boolean;
	IsFadeOut	:	boolean;
	Text		:	string;
	index		:	number;
	Animated	:	boolean;

	constructor(){
		this.IsFadeIn = true;
		this.IsFadeOut = false;
		this.fade = 0;
		this.index = 0;
		this.Animated = false;
		this.Text = '';
	}
}