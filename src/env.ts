import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3000),
  DATABASE_URL: z.string(),
  JWT_PRIVATE_KEY: z.string().base64(),
  JWT_PUBLIC_KEY: z.string().base64(),
})

export type Env = z.infer<typeof envSchema>
