import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@Controller('/api')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor() {}

  @Post('/questions')
  @HttpCode(201)
  public async handle() {
    return { message: 'OK' }
  }
}
