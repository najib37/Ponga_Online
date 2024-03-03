import { PlayerController } from "../player/player.controller";
import { PlayerType } from "../player/types/playerType";

export type GameModes = "CLASSIC" | "YINYANG" | "CLASHOFCOLORS";

export interface GameType {
  id?: string,
  winnerId?: string,
  loserId?: string,

  winner?: PlayerType,
  loser?: PlayerType,

  rounds: number ,
  mode: GameModes, 
  winnerScore: number,
  loserScore: number,
}
