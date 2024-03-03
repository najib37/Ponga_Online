
import { IsNotEmpty, IsNumber, IsUUID, isNumber } from "class-validator"
type gameResults = "WIN" | "LOSE" | "RESIGN";

export class CreatePlayerDto {

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  level: number;

  @IsNotEmpty()
  @IsNumber()
  xp: number;
}
