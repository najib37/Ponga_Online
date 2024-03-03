import { Socket } from 'socket.io'
import { AuthUser } from 'src/user/types/AuthUser'

export interface AuthSocket extends Socket {
  user: AuthUser
}
