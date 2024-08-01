import { NestFactory } from '@nestjs/core'

import { ConfigService } from '@nestjs/config'
import { Env } from './env'
import { RootModule } from './root.module'

async function bootstrap() {
  const app = await NestFactory.create(RootModule)
  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const PORT = configService.get('PORT', { infer: true })
  await app.listen(PORT)
}
bootstrap()
