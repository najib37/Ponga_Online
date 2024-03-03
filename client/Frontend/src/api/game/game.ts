

import { myApi } from "../axiosInstance";
import { User } from "../user/User";

export type Player = {
  userId: string,
  user: User,
  xp: number,
  level: number
}

export type Game = {

  id: string,
  winner: Player,
  loser: Player,

  winnerId: string,
  loserId: string,

  rounds: number,
  mode: "CLASSIC" | "YINYANG" | "CLASHOFCOLORS",
  winnerScore: number,
  loserScore: number,

}

export async function sendGameRequest(
  url: string,
  { arg: playerId }: { arg: string }
): Promise<Game> {

  return myApi.post(
    url + '/' + playerId,
  ).then(res => res.data).catch(() => { });
}

export async function getPlayedGames(
  url: string,
): Promise<Game[]> {
  return myApi.get(url).then(res => res.data).catch(() => { });
}
