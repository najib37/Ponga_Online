import { myApi } from "../axiosInstance";
import { Player } from "./game";

export interface PlayerStatsType {
  level: number,
  xp: number,
  wonGames: number,
  lostGames: number,
  totalGames: number,
  winPercentage: number,
}

export interface achievement {
  type: string
}

export async function getPlayerStats(url: string): Promise<PlayerStatsType> {
  return myApi.get(url).then(res => res.data).catch(() => { });
}

export async function getLeaderBoard(url: string): Promise<Player[]> {
  return myApi.get(url).then(res => res.data).catch(() => { });
}

export async function getPlayerachievements(url: string): Promise<achievement[]> {
  return myApi.get(url).then(res => res.data).catch(() => { });
}
