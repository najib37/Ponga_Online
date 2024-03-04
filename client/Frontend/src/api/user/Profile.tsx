import { myApi } from "../axiosInstance"
import { User } from "./User";


export interface Profile {
  user: Omit<User, "email" | "twoFactorEnabled">,
  isFriend?: boolean, // for the others profile
  isBlocked?: boolean, // for the others profile
  friends: User[],
}


export async function getProfile({ url, username }: { url: string, username: string }): Promise<Profile> {

  return myApi.get(url, {
    params: {
      username
    }
  }).then(res => res.data).catch(() => { })
}
