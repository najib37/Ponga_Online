import { GameData } from "../entities/game_data";

export interface PlayerSerelize{
	data		:	GameData;
	playerId	:	string | undefined;
}