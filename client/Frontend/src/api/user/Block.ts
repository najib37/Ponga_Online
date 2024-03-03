import { myApi } from "../axiosInstance";
import { User } from "./User";

export type BlockStateType = {
  isBlocked: false,
  blockedBy: true
}

export async function blockUser (
  url: string,
  { arg: blockId}: { arg: string }
): Promise<User> {
  return myApi.post(url + '/' + blockId).then(res => res.data).catch(() => {})
}

export async function unblockUser (
  url: string,
  { arg: blockId}: { arg: string }
): Promise<User> {
  return myApi.delete(url + '/' + blockId).then(res => res.data).catch(() => {})
}

export async function checkBlockState(url: string) : Promise<BlockStateType> {
  return myApi.get(  url  ).then(res => res.data).catch(() => {})
}
