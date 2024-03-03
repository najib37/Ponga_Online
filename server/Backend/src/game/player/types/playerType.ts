import { GameType } from "src/game/types/GameType";
import { User } from "src/user/entities/user.entity";

export type  Achievment = {
  type: string
}

export interface PlayerType {
  userId?: string,
  level?: number,
  xp: number,

  achievments?: Achievment[],
}

export class PlayerSelectType {
  userId?: boolean = true ;
  user: boolean = true;
  level?: boolean = true;
  xp?: boolean = true;
}
