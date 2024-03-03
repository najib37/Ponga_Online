import { Animation } from "../entities/animation";
import { ball } from "../entities/ball.entity";
import { Clash } from "../entities/clash_of_olors.entity";
import { player } from "../entities/player.entity";
import { servergame } from "../entities/servergame.entity";

export interface ClientGameData {

	_Server		:	servergame | Partial<servergame>,
	_player1	:	player | Partial<player>,
	_player2	:	player | Partial<player>,
	_ball		:	ball | Partial<ball>,
	_Red		:	Clash | Partial<Clash>,
	_Blue		:	Clash | Partial<Clash>,
	Texts		:	Animation | Partial<Animation>;
	Players		:	Animation | Partial<Animation>;
}