import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { z } from 'zod'

import { compare } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'

const authenticateUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateUserBody = z.infer<typeof authenticateUserBodySchema>

@Controller('/api')
export class AuthenticateController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  @Post('/sessions')
  @UsePipes(new ZodValidationPipe(authenticateUserBodySchema))
  public async handle(@Body() payload: AuthenticateUserBody) {
    const { email, password } = payload

    const user = await this.prismaService.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials are invalid.')
    }

    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials are invalid.')
    }

    const token = this.jwt.sign({ sub: user.id })
    return { token }
  }
}
