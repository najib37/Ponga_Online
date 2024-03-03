
import {z} from 'zod'

export interface User {
  id: string,
  email: string,
  name: string,
  username: string,
  avatar: string,
  status: string,
  twoFactorEnabled: boolean,
}

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().optional(),
  name: z.string().trim().min(4).max(20),
  avatar: z.string(),
  status: z.union([z.literal('online'), z.literal('ofline')]),

  twoFactorEnabled: z.boolean(),
}).passthrough()
