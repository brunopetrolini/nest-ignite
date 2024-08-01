import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { z } from 'zod'

import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

type CreateAccountBody = z.infer<typeof createAccountBodySchema>

@Controller('/api')
export class CreateAccountController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('/accounts')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  public async handle(@Body() payload: CreateAccountBody) {
    const { name, email, password } = payload

    const userWithSameEmail = await this.prismaService.user.findUnique({
      where: { email },
    })
    if (userWithSameEmail) {
      throw new ConflictException('User with this email already exists.')
    }

    const saltRounds = 8
    const hashedPassword = await hash(password, saltRounds)

    const { id } = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return { accountId: id }
  }
}
