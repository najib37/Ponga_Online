
import {z} from 'zod'

export interface Use {
  id: string,
  email: string,
  name: string,
  username: string,
  avatar: string,
  status: string,
  twoFactorEnabled: boolean,
}

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email().optional(),
  name: z.string().trim().min(4).max(20).regex(/^[a-zA-Z ]+$/).optional(), // WARN: espace
  avatar: z.string().optional(),
  status: z.union([z.literal('online'), z.literal('offline')]).optional(),

  twoFactorEnabled: z.boolean().optional(),
}).passthrough()// lets non specified fileds to passthrough
