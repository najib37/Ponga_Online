
import { User } from "src/user/entities/user.entity"; 

export interface Profile {
  user: User,
  // games: games[],
  // achievments: achievment[],
  friends: User[],
  isFriend: boolean,
  isBlocked: boolean
}
