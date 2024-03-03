import { IsBoolean, IsIn, IsNumber, IsString, IsUUID } from "class-validator";
import { Optional } from "@nestjs/common";
import { GameModes } from "../types/GameType";

export class GameMode{

	@IsNumber()
	@IsIn([3, 5, 11, 17, 21])
	MaxRounds: number;

	@IsString()
	@IsIn(['CLASSIC', 'CLASHOFCOLORS', 'YINYANG'])
	GameMode: GameModes;

	@IsNumber()
	@IsIn([2])
	RoomCapacity: number;

	@IsBoolean()
	IsPublic: boolean;

	@Optional()
	GuestId: string;

}