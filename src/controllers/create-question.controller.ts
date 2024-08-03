import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common'

import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { TokenPayload } from 'src/auth/jwt.strategy'

@Controller('/api')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor() {}

  @Post('/questions')
  @HttpCode(201)
  public async handle(@CurrentUser() user: TokenPayload) {
    return { user_id: user.sub }
  }
}
