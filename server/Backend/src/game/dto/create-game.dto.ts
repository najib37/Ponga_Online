import { IsNumber, IsOptional, IsUUID } from "class-validator";
import { PlayerType } from "../player/types/playerType";


type gameResults = "WIN" | "LOSE" | "RESIGN";


type GameMods = "CLASSIC" | "YINYANG" | "CLASHOFCOLORS";

export class createGameDto {
  @IsNumber()
  rounds: number;

  @IsNumber()
  mode: GameMods;
}
