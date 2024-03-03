
import { User } from "./User";
import { myApi } from "../axiosInstance";

// interface PaginationQuryType {
//   take: number,
//   skip: number,
//   limit?: number,
// } // dont see the need of implemeting the pagination

export async function sendFriendRequest(
  url: string,
  { arg: friendId }: { arg: string }
): Promise<User> {
  return myApi.post(url + '/request/' + friendId).then(res => res.data).catch(() => {})
}


export async function checkForFriendRequests (
  url: string,
): Promise<User> {
  return myApi.get(url).then(res => res.data).catch(() => {})
}

export async function addFriend(
  url: string,
  { arg: friendId }: { arg: string }
): Promise<User> {
  return myApi.post(url + "/" + friendId).then(res => res.data).catch(() => {})
}

export async function deleteFriend(
  url: string,
  { arg: friendId }: { arg: string }
): Promise<User> {
  return myApi.delete(url + '/' + friendId).then(res => res.data).catch(() => {})
}

export async function deleteFriendRequest (
  url: string,
  { arg: friendId }: { arg: string }
): Promise<User> {
  return myApi.delete(url + '/request/' + friendId).then(res => res.data).catch(() => {})
}

// export async function (
//   url: string,
// ): Promise<User> {
//   return myApi.get(url).then(res => res.data).catch(() => {})
// }

// export async function allFriend(
//   url: string,
//   {
//     arg: paginationQuery,
//   }: { arg: PaginationQueryType }
// ): Promise<User> {
//   return myApi.get(
//     url,
//     {
//       params: {
//         ...paginationQuery
//       },
//     }
//   ).then(res => res.data).catch(() => {})
// }
