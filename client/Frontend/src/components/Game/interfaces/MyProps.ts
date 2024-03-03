import { SketchProps } from "react-p5-wrapper";
import { GameData } from "../entities/game_data";
import { GameRes } from "../entities/game-resolution";
import { Loading } from "../entities/loading-animation";

export interface MyProps extends SketchProps{
	data	:	GameData;
	gameRes :	GameRes;
	_loading:	Loading;
}